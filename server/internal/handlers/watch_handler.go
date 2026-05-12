package handlers

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/sakthivasan369/law-app/server/internal/dto"
	"github.com/sakthivasan369/law-app/server/internal/services"
	"github.com/sakthivasan369/law-app/server/internal/utils"
)

type WatchHandler struct {
	service   services.WatchService
	validator *validator.Validate
}

func NewWatchHandler(service services.WatchService) *WatchHandler {
	return &WatchHandler{service: service, validator: validator.New()}
}

func (h *WatchHandler) UpdateProgress(c *fiber.Ctx) error {
	userIDStr := c.Locals("user_id").(string)
	userID, _ := uuid.Parse(userIDStr)

	req := new(dto.WatchProgressRequest)
	if err := c.BodyParser(req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "invalid_request_payload")
	}

	videoID, err := uuid.Parse(req.VideoID)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "invalid_video_id")
	}

	if err := h.service.UpdateProgress(userID, videoID, req.CurrentTime); err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "failed_to_update_progress")
	}

	return utils.SuccessResponse(c, fiber.Map{"message": "progress_updated"})
}
