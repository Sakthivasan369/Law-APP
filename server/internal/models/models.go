package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID           uuid.UUID `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()" json:"id"`
	Name         string    `gorm:"not null" json:"name"`
	Email        string    `gorm:"uniqueIndex;not null" json:"email"`
	PasswordHash string    `gorm:"not null" json:"-"`
	WalletBalance float64  `gorm:"default:0.0" json:"wallet_balance"`
	Role         string    `gorm:"default:'student'" json:"role"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
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
	ID            uuid.UUID `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()" json:"id"`
	UserID        uuid.UUID `gorm:"type:uuid;not null;uniqueIndex:idx_user_video" json:"user_id"`
	VideoID       uuid.UUID `gorm:"type:uuid;not null;uniqueIndex:idx_user_video" json:"video_id"`
	WatchSeconds  int       `gorm:"default:0" json:"watch_seconds"`
	Completed     bool      `gorm:"default:false" json:"completed"`
	LastPosition  int       `gorm:"default:0" json:"last_position"`
	UpdatedAt     time.Time `json:"updated_at"`
}

func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return
}
