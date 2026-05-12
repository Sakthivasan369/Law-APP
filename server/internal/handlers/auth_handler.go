package handlers

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/sakthivasan369/law-app/server/internal/dto"
	"github.com/sakthivasan369/law-app/server/internal/services"
	"github.com/sakthivasan369/law-app/server/internal/utils"
)

type AuthHandler struct {
	service   services.AuthService
	validator *validator.Validate
}

func NewAuthHandler(service services.AuthService) *AuthHandler {
	return &AuthHandler{service: service, validator: validator.New()}
}

func (h *AuthHandler) Register(c *fiber.Ctx) error {
	req := new(dto.RegisterRequest)
	if err := c.BodyParser(req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "invalid_request_payload")
	}

	if err := h.validator.Struct(req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, err.Error())
	}

	user, err := h.service.Register(req.Name, req.Email, req.Password)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusConflict, "email_already_exists")
	}

	return utils.SuccessResponse(c, user)
}

func (h *AuthHandler) Login(c *fiber.Ctx) error {
	req := new(dto.LoginRequest)
	if err := c.BodyParser(req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "invalid_request_payload")
	}

	token, err := h.service.Login(req.Email, req.Password)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, err.Error())
	}

	return utils.SuccessResponse(c, fiber.Map{"token": token})
}
