package services

import (
	"time"

	"github.com/google/uuid"
	"github.com/sakthivasan369/law-app/server/internal/models"
	"github.com/sakthivasan369/law-app/server/internal/repositories"
)

type WatchService interface {
	UpdateProgress(userID, videoID uuid.UUID, currentTime int) error
}

type watchService struct {
	historyRepo repositories.WatchHistoryRepository
	userRepo    repositories.UserRepository
}

func NewWatchService(h repositories.WatchHistoryRepository, u repositories.UserRepository) WatchService {
	return &watchService{historyRepo: h, userRepo: u}
}

func (s *watchService) UpdateProgress(userID, videoID uuid.UUID, currentTime int) error {
	history, err := s.historyRepo.Get(userID, videoID)
	if err != nil {
		return err
	}

	if history == nil {
		history = &models.WatchHistory{
			UserID:       userID,
			VideoID:      videoID,
			LastPosition: currentTime,
			UpdatedAt:    time.Now(),
		}
	} else {
		history.LastPosition = currentTime
		history.UpdatedAt = time.Now()
	}

	// Watch-to-Earn logic: Increment wallet if they watched more (simplified)
	// In production, you'd calculate the delta and apply rate limits.
	reward := 0.05 // Earn 0.05 per heartbeat
	if err := s.userRepo.UpdateWallet(userID, reward); err != nil {
		return err
	}

	return s.historyRepo.Upsert(history)
}
