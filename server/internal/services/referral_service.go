package services

import (
	"errors"

	"github.com/google/uuid"
	"github.com/sakthivasan369/law-app/server/internal/models"
	"github.com/sakthivasan369/law-app/server/internal/repositories"
)

const (
	ReferrerReward = 50.0 // ₹50 for the person who shared the code
	RefereeReward  = 25.0 // ₹25 for the person who used the code
)

type ReferralService interface {
	RedeemCode(userID uuid.UUID, code string) error
}

type referralService struct {
	userRepo    repositories.UserRepository
	walletRepo  repositories.WalletTransactionRepository
}

func NewReferralService(userRepo repositories.UserRepository, walletRepo repositories.WalletTransactionRepository) ReferralService {
	return &referralService{userRepo: userRepo, walletRepo: walletRepo}
}

func (s *referralService) RedeemCode(userID uuid.UUID, code string) error {
	// 1. Find the referrer (owner of the code)
	referrer, err := s.userRepo.FindByReferralCode(code)
	if err != nil {
		return errors.New("invalid_referral_code")
	}

	// 2. Prevent self-referral
	if referrer.ID == userID {
		return errors.New("cannot_use_own_code")
	}

	// 3. Check if the current user has already been referred
	currentUser, err := s.userRepo.FindByID(userID)
	if err != nil {
		return errors.New("user_not_found")
	}

	if currentUser.ReferredByID != nil {
		return errors.New("already_redeemed_a_code")
	}

	// 4. Mark the current user as referred
	currentUser.ReferredByID = &referrer.ID
	if err := s.userRepo.Update(currentUser); err != nil {
		return errors.New("failed_to_update_user")
	}

	// 5. Credit wallets
	if err := s.userRepo.UpdateWallet(referrer.ID, ReferrerReward); err != nil {
		return errors.New("failed_to_credit_referrer")
	}
	if err := s.userRepo.UpdateWallet(userID, RefereeReward); err != nil {
		return errors.New("failed_to_credit_referee")
	}

	// 6. Record wallet transactions
	referrerTx := &models.WalletTransaction{
		UserID:      referrer.ID,
		Amount:      ReferrerReward,
		Type:        "referral_reward",
		Description: "Earned ₹50 for referring a friend",
		RelatedID:   &userID,
	}
	refereeTx := &models.WalletTransaction{
		UserID:      userID,
		Amount:      RefereeReward,
		Type:        "referral_bonus",
		Description: "Earned ₹25 for using a referral code",
		RelatedID:   &referrer.ID,
	}

	if err := s.walletRepo.CreateTransaction(referrerTx); err != nil {
		return errors.New("failed_to_record_referrer_transaction")
	}
	if err := s.walletRepo.CreateTransaction(refereeTx); err != nil {
		return errors.New("failed_to_record_referee_transaction")
	}

	return nil
}
