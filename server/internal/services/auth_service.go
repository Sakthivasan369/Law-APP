package services

import (
	"crypto/rand"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/smtp"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/sakthivasan369/law-app/server/internal/dto"
	"github.com/sakthivasan369/law-app/server/internal/models"
	"github.com/sakthivasan369/law-app/server/internal/repositories"
	"gorm.io/gorm"
)

type AuthService interface {
	RequestOTP(email string) error
	VerifyOTP(email, code string) (string, error)
	Onboard(userID uuid.UUID, req *dto.OnboardRequest) (*models.User, error)
}

type authService struct {
	repo repositories.UserRepository
}

func NewAuthService(repo repositories.UserRepository) AuthService {
	return &authService{repo: repo}
}

func generateOTP() string {
	b := make([]byte, 3)
	_, _ = rand.Read(b)
	return fmt.Sprintf("%06d", int(b[0])<<16|int(b[1])<<8|int(b[2]))[:6]
}

func sendOTPEmail(to string, otp string) error {
	from := os.Getenv("SMTP_EMAIL")
	password := os.Getenv("SMTP_PASSWORD")
	host := os.Getenv("SMTP_HOST")
	port := os.Getenv("SMTP_PORT")

	// Message body
	subject := "Subject: Your Sattam Ungal Kaiyil OTP\n"
	mime := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"
	body := fmt.Sprintf("<html><body><h3>Verification Code</h3><p>Your 6-digit verification code is: <b>%s</b></p><p>This code will expire in 5 minutes.</p></body></html>", otp)
	msg := []byte(subject + mime + body)

	// Auth
	auth := smtp.PlainAuth("", from, password, host)
	addr := fmt.Sprintf("%s:%s", host, port)

	return smtp.SendMail(addr, auth, from, []string{to}, msg)
}

func (s *authService) RequestOTP(email string) error {
	user, err := s.repo.FindByEmail(email)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			user = &models.User{
				Email: email,
			}
			if err := s.repo.Create(user); err != nil {
				return err
			}
		} else {
			return err
		}
	}

	otp := generateOTP()
	user.OTPCode = otp
	user.OTPExpiresAt = time.Now().Add(5 * time.Minute)

	if err := s.repo.Update(user); err != nil {
		return err
	}

	// Send Real Email
	if err := sendOTPEmail(email, otp); err != nil {
		log.Printf("Failed to send email to %s: %v", email, err)
		// Don't return error to user for security, or return a generic one
		return errors.New("failed_to_send_email")
	}

	log.Printf("OTP sent successfully to %s", email)
	return nil
}

func (s *authService) VerifyOTP(email, code string) (string, error) {
	user, err := s.repo.FindByEmail(email)
	if err != nil {
		return "", errors.New("invalid_email")
	}

	if user.OTPCode != code {
		return "", errors.New("invalid_otp")
	}

	if time.Now().After(user.OTPExpiresAt) {
		return "", errors.New("expired_otp")
	}

	// Clear OTP after successful verification
	user.OTPCode = ""
	user.OTPExpiresAt = time.Time{}
	s.repo.Update(user)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id":      user.ID.String(),
		"role":         user.Role,
		"is_onboarded": user.IsOnboarded,
		"exp":          time.Now().Add(time.Hour * 24).Unix(),
	})

	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}

func (s *authService) Onboard(userID uuid.UUID, req *dto.OnboardRequest) (*models.User, error) {
	user, err := s.repo.FindByID(userID)
	if err != nil {
		return nil, err
	}

	if user.IsOnboarded {
		return nil, errors.New("already_onboarded")
	}

	interestsJSON, _ := json.Marshal(req.Interests)

	user.Name = req.Name
	user.Age = req.Age
	user.Occupation = req.Occupation
	user.Interests = string(interestsJSON)
	user.IsOnboarded = true

	if err := s.repo.Update(user); err != nil {
		return nil, err
	}

	return user, nil
}
