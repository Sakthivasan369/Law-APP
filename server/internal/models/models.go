package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID            uuid.UUID  `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()" json:"id"`
	Email         string     `gorm:"uniqueIndex;not null" json:"email"`
	OTPCode       string     `json:"-"`
	OTPExpiresAt  time.Time  `json:"-"`
	IsOnboarded   bool       `gorm:"default:false" json:"is_onboarded"`
	Name          string     `json:"name"`
	Age           int        `json:"age"`
	Occupation    string     `json:"occupation"`
	Interests     string     `gorm:"type:jsonb;default:'[]'" json:"interests"` // Store as JSON string or array, using jsonb in postgres
	WalletBalance float64    `gorm:"default:0.0" json:"wallet_balance"`
	Role          string     `gorm:"default:'student'" json:"role"`
	ReferralCode  string     `gorm:"uniqueIndex;size:6" json:"referral_code"`
	ReferredByID  *uuid.UUID `gorm:"type:uuid" json:"referred_by_id,omitempty"`
	CreatedAt     time.Time  `json:"created_at"`
	UpdatedAt     time.Time  `json:"updated_at"`
}

type Course struct {
	ID           uuid.UUID `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()" json:"id"`
	Title        string    `gorm:"not null" json:"title"`
	Description  string    `json:"description"`
	Instructor   string    `json:"instructor"`
	ThumbnailURL string    `json:"thumbnail_url"`
	Price        float64   `gorm:"default:0.0" json:"price"`
	IsPremium    bool      `gorm:"default:true" json:"is_premium"`
	Category     string    `json:"category"`
	Videos       []Video   `gorm:"foreignKey:CourseID" json:"videos,omitempty"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type Video struct {
	ID             uuid.UUID `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()" json:"id"`
	CourseID       uuid.UUID `gorm:"type:uuid;not null" json:"course_id"`
	Title          string    `gorm:"not null" json:"title"`
	Duration       int       `json:"duration"` // in seconds
	SequenceOrder  int       `json:"sequence_order"`
	VideoPath      string    `gorm:"not null" json:"-"` // Hidden from JSON
	DemoYouTubeURL string    `json:"demo_youtube_url"`
	IsPremium      bool      `gorm:"default:true" json:"is_premium"`
	CreatedAt      time.Time `json:"created_at"`
}

type WatchHistory struct {
	ID           uuid.UUID `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()" json:"id"`
	UserID       uuid.UUID `gorm:"type:uuid;not null;uniqueIndex:idx_user_video" json:"user_id"`
	VideoID      uuid.UUID `gorm:"type:uuid;not null;uniqueIndex:idx_user_video" json:"video_id"`
	WatchSeconds int       `gorm:"default:0" json:"watch_seconds"`
	Completed    bool      `gorm:"default:false" json:"completed"`
	LastPosition int       `gorm:"default:0" json:"last_position"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type WalletTransaction struct {
	ID          uuid.UUID `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()" json:"id"`
	UserID      uuid.UUID `gorm:"type:uuid;not null;index" json:"user_id"`
	Amount      float64   `gorm:"not null" json:"amount"`
	Type        string    `gorm:"not null" json:"type"`                    // "referral_bonus", "referral_reward", "purchase", etc.
	Description string    `json:"description"`
	RelatedID   *uuid.UUID `gorm:"type:uuid" json:"related_id,omitempty"` // ID of the related entity (e.g., referrer's user ID)
	CreatedAt   time.Time `json:"created_at"`
}

func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return
}

func (w *WalletTransaction) BeforeCreate(tx *gorm.DB) (err error) {
	if w.ID == uuid.Nil {
		w.ID = uuid.New()
	}
	return
}
