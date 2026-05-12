package handlers

import (
	"fmt"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/sakthivasan369/law-app/server/internal/repositories"
	"github.com/sakthivasan369/law-app/server/internal/utils"
)

type VideoHandler struct {
	videoRepo repositories.VideoRepository
	// In a real app, we'd also check if user bought the course
}

func NewVideoHandler(vr repositories.VideoRepository) *VideoHandler {
	return &VideoHandler{videoRepo: vr}
}

func (h *VideoHandler) StreamVideo(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "invalid_video_id")
	}

	video, err := h.videoRepo.GetVideoByID(id)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusNotFound, "video_not_found")
	}

	// PROD ARCHITECTURE NOTE:
	// In a production environment (AWS/GCP), we would NEVER stream raw files from the app server.
	// Instead, this handler would:
	// 1. Verify User Entitlement (does the user own the CourseID?).
	// 2. Generate a time-limited signed cookie or token for a CDN (e.g., CloudFront, Bunny.net).
	// 3. Return a 302 Redirect to the CDN URL or return an HLS (.m3u8) manifest URL.
	// 4. For DRM, we would integrate with Widevine/FairPlay key servers.
	
	// LOCAL DEVELOPMENT MODE:
	// Streaming from local filesystem using Fiber's optimized SendFile which supports Range Requests (206 Partial Content).
	
	filePath := fmt.Sprintf(".%s", video.VideoPath) // Ensure path starts relative to project root
	
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		return utils.ErrorResponse(c, fiber.StatusNotFound, "video_file_missing_on_disk")
	}

	// Anti-Download & Security Headers
	c.Set("Content-Disposition", "inline")
	c.Set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
	c.Set("Pragma", "no-cache")
	c.Set("Expires", "0")
	c.Set("X-Content-Type-Options", "nosniff")

	return c.SendFile(filePath)
}
