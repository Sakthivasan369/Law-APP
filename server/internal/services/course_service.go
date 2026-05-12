package services

import (
	"github.com/google/uuid"
	"github.com/sakthivasan369/law-app/server/internal/models"
	"github.com/sakthivasan369/law-app/server/internal/repositories"
)

type CourseService interface {
	GetCatalog(page, pageSize int) ([]models.Course, error)
	GetSyllabus(courseID uuid.UUID) ([]models.Video, error)
}

type courseService struct {
	repo repositories.CourseRepository
}

func NewCourseService(repo repositories.CourseRepository) CourseService {
	return &courseService{repo: repo}
}

func (s *courseService) GetCatalog(page, pageSize int) ([]models.Course, error) {
	offset := (page - 1) * pageSize
	return s.repo.GetAll(pageSize, offset)
}

func (s *courseService) GetSyllabus(courseID uuid.UUID) ([]models.Video, error) {
	return s.repo.GetVideos(courseID)
}
