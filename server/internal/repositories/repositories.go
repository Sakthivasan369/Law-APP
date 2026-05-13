package repositories

import (
	"github.com/google/uuid"
	"github.com/sakthivasan369/law-app/server/internal/models"
	"gorm.io/gorm"
)

type UserRepository interface {
	Create(user *models.User) error
	FindByEmail(email string) (*models.User, error)
	FindByID(id uuid.UUID) (*models.User, error)
	Update(user *models.User) error
	UpdateWallet(id uuid.UUID, amount float64) error
}

type CourseRepository interface {
	GetAll(limit, offset int) ([]models.Course, error)
	GetCourseByID(id uuid.UUID) (*models.Course, error)
	GetVideos(courseID uuid.UUID) ([]models.Video, error)
}

type VideoRepository interface {
	GetVideoByID(id uuid.UUID) (*models.Video, error)
}

type WatchHistoryRepository interface {
	Upsert(history *models.WatchHistory) error
	Get(userID, videoID uuid.UUID) (*models.WatchHistory, error)
}

type postgresRepository struct {
	db *gorm.DB
}

func NewPostgresRepository(db *gorm.DB) (UserRepository, CourseRepository, VideoRepository, WatchHistoryRepository) {
	repo := &postgresRepository{db: db}
	return repo, repo, repo, repo
}

// User Implementation
func (r *postgresRepository) Create(user *models.User) error {
	return r.db.Create(user).Error
}

func (r *postgresRepository) FindByEmail(email string) (*models.User, error) {
	var user models.User
	err := r.db.Where("email = ?", email).First(&user).Error
	return &user, err
}

func (r *postgresRepository) FindByID(id uuid.UUID) (*models.User, error) {
	var user models.User
	err := r.db.First(&user, id).Error
	return &user, err
}

func (r *postgresRepository) Update(user *models.User) error {
	return r.db.Save(user).Error
}

func (r *postgresRepository) UpdateWallet(id uuid.UUID, amount float64) error {
	return r.db.Model(&models.User{}).Where("id = ?", id).Update("wallet_balance", gorm.Expr("wallet_balance + ?", amount)).Error
}

// Course Implementation
func (r *postgresRepository) GetAll(limit, offset int) ([]models.Course, error) {
	var courses []models.Course
	err := r.db.Limit(limit).Offset(offset).Find(&courses).Error
	return courses, err
}

func (r *postgresRepository) GetCourseByID(id uuid.UUID) (*models.Course, error) {
	var course models.Course
	err := r.db.First(&course, id).Error
	return &course, err
}

func (r *postgresRepository) GetVideos(courseID uuid.UUID) ([]models.Video, error) {
	var videos []models.Video
	err := r.db.Where("course_id = ?", courseID).Order("sequence_order asc").Find(&videos).Error
	return videos, err
}

// Video Implementation
func (r *postgresRepository) GetVideoByID(id uuid.UUID) (*models.Video, error) {
	var video models.Video
	err := r.db.First(&video, id).Error
	return &video, err
}

// WatchHistory Implementation
func (r *postgresRepository) Upsert(history *models.WatchHistory) error {
	return r.db.Save(history).Error
}

func (r *postgresRepository) Get(userID, videoID uuid.UUID) (*models.WatchHistory, error) {
	var history models.WatchHistory
	err := r.db.Where("user_id = ? AND video_id = ?", userID, videoID).First(&history).Error
	if err == gorm.ErrRecordNotFound {
		return nil, nil
	}
	return &history, err
}
