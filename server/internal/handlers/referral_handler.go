package handlers

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/sakthivasan369/law-app/server/internal/services"
	"github.com/sakthivasan369/law-app/server/internal/utils"
)

type ReferralHandler struct {
	service   services.ReferralService
	validator *validator.Validate
}

func NewReferralHandler(service services.ReferralService) *ReferralHandler {
	return &ReferralHandler{
		service:   service,
		validator: validator.New(),
	}
}

type RedeemRequest struct {
	Code string `json:"code" validate:"required,len=6"`
}

func (h *ReferralHandler) RedeemCode(c *fiber.Ctx) error {
	userIDStr := c.Locals("user_id").(string)

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "invalid_user")
	}

	req := new(RedeemRequest)
	if err := c.BodyParser(req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "invalid_request_payload")
	}

	if err := h.validator.Struct(req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, err.Error())
	}

	if err := h.service.RedeemCode(userID, req.Code); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, err.Error())
	}

	return utils.SuccessResponse(c, fiber.Map{
		"message": "Referral code redeemed successfully!",
	})
}
