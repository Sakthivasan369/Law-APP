package handlers

import (
	"log"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/sakthivasan369/law-app/server/internal/dto"
	"github.com/sakthivasan369/law-app/server/internal/services"
	"github.com/sakthivasan369/law-app/server/internal/utils"
)

type AuthHandler struct {
	service   services.AuthService
	validator *validator.Validate
}

func NewAuthHandler(service services.AuthService) *AuthHandler {
	return &AuthHandler{
		service:   service,
		validator: validator.New(),
	}
}

func (h *AuthHandler) RequestOTP(c *fiber.Ctx) error {
	log.Println("REQUEST HIT")

	req := new(dto.RequestOTPRequest)

	log.Println("STEP 1 - BEFORE BODY PARSE")

	if err := c.BodyParser(req); err != nil {
		log.Println("BODY PARSE FAILED:", err)

		return utils.ErrorResponse(
			c,
			fiber.StatusBadRequest,
			"invalid_request_payload",
		)
	}

	log.Println("STEP 2 - BODY PARSED")
	log.Println("EMAIL:", req.Email)

	if err := h.validator.Struct(req); err != nil {
		log.Println("VALIDATION FAILED:", err)

		return utils.ErrorResponse(
			c,
			fiber.StatusBadRequest,
			err.Error(),
		)
	}

	log.Println("STEP 3 - VALIDATION PASSED")

	if err := h.service.RequestOTP(req.Email); err != nil {
		log.Println("SERVICE ERROR:", err)

		return utils.ErrorResponse(
			c,
			fiber.StatusInternalServerError,
			"failed_to_request_otp",
		)
	}

	log.Println("STEP 4 - OTP SUCCESS")

	return utils.SuccessResponse(c, fiber.Map{
		"message": "OTP sent successfully",
	})
}

func (h *AuthHandler) VerifyOTP(c *fiber.Ctx) error {
	req := new(dto.VerifyOTPRequest)

	if err := c.BodyParser(req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "invalid_request_payload")
	}

	if err := h.validator.Struct(req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, err.Error())
	}

	token, err := h.service.VerifyOTP(req.Email, req.Code)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, err.Error())
	}

	return utils.SuccessResponse(c, fiber.Map{
		"token": token,
	})
}

func (h *AuthHandler) Onboard(c *fiber.Ctx) error {
	userIDStr := c.Locals("user_id").(string)

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "invalid_user")
	}

	req := new(dto.OnboardRequest)

	if err := c.BodyParser(req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "invalid_request_payload")
	}

	if err := h.validator.Struct(req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, err.Error())
	}

	user, err := h.service.Onboard(userID, req)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, err.Error())
	}

	return utils.SuccessResponse(c, user)
}

func (h *AuthHandler) GetMe(c *fiber.Ctx) error {
	userIDStr := c.Locals("user_id").(string)

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "invalid_user")
	}

	user, err := h.service.GetMe(userID)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusNotFound, err.Error())
	}

	return utils.SuccessResponse(c, user)
}