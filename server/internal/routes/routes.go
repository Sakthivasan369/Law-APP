package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/sakthivasan369/law-app/server/internal/handlers"
	"github.com/sakthivasan369/law-app/server/internal/middleware"
	"github.com/sakthivasan369/law-app/server/internal/repositories"
	"github.com/sakthivasan369/law-app/server/internal/services"
	"gorm.io/gorm"
)

func Setup(app *fiber.App, db *gorm.DB) {
	// 1. Initialize Repositories
	userRepo, courseRepo, videoRepo, watchRepo := repositories.NewPostgresRepository(db)

	// 2. Initialize Services
	authService := services.NewAuthService(userRepo)
	courseService := services.NewCourseService(courseRepo)
	watchService := services.NewWatchService(watchRepo, userRepo)

	// 3. Initialize Handlers
	authHandler := handlers.NewAuthHandler(authService)
	courseHandler := handlers.NewCourseHandler(courseService)
	watchHandler := handlers.NewWatchHandler(watchService)
	videoHandler := handlers.NewVideoHandler(videoRepo)

	// 4. Define Routes
	api := app.Group("/api")
	
	// Auth Routes
	auth := api.Group("/auth")
	auth.Post("/request-otp", authHandler.RequestOTP)
	auth.Post("/verify-otp", authHandler.VerifyOTP)

	// Protected Routes
	protected := api.Group("/", middleware.JWTMiddleware())

	// Onboarding Route
	protected.Put("/auth/onboard", authHandler.Onboard)

	// Course Routes
	protected.Get("/courses", courseHandler.GetCatalog)
	protected.Get("/courses/:id/videos", courseHandler.GetSyllabus)

	// Watch Routes
	protected.Post("/watch/progress", watchHandler.UpdateProgress)

	// Video Streaming (Secure)
	protected.Get("/videos/:id/stream", videoHandler.StreamVideo)
}
