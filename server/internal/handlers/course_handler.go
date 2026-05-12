package handlers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/sakthivasan369/law-app/server/internal/services"
	"github.com/sakthivasan369/law-app/server/internal/utils"
)

type CourseHandler struct {
	service services.CourseService
}

func NewCourseHandler(service services.CourseService) *CourseHandler {
	return &CourseHandler{service: service}
}

func (h *CourseHandler) GetCatalog(c *fiber.Ctx) error {
	page, _ := strconv.Atoi(c.Query("page", "1"))
	pageSize, _ := strconv.Atoi(c.Query("page_size", "10"))

	courses, err := h.service.GetCatalog(page, pageSize)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "failed_to_fetch_courses")
	}

	return utils.SuccessResponse(c, courses)
}

func (h *CourseHandler) GetSyllabus(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "invalid_course_id")
	}

	videos, err := h.service.GetSyllabus(id)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "failed_to_fetch_syllabus")
	}

	return utils.SuccessResponse(c, videos)
}
