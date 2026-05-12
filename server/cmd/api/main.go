package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/joho/godotenv"
	"github.com/sakthivasan369/law-app/server/internal/database"
	"github.com/sakthivasan369/law-app/server/internal/routes"
)

func main() {
	// Load environment variables
	if err := godotenv.Load("../../.env"); err != nil {
		log.Println("Warning: .env file not found, using system environment variables")
	}

	// Initialize Database
	db := database.NewPostgresConnection()

	// Initialize Fiber App
	app := fiber.New(fiber.Config{
		AppName:      "Sattam Ungal Kaiyil API v1.0",
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	})

	// Global Middlewares
	app.Use(recover.New())
	app.Use(logger.New())
	app.Use(cors.New())

	// Health Check
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.Status(200).JSON(fiber.Map{"status": "healthy", "timestamp": time.Now()})
	})

	// Setup Routes
	routes.Setup(app, db)

	// Graceful Shutdown Setup
	go func() {
		port := os.Getenv("PORT")
		if port == "" {
			port = "8080"
		}
		if err := app.Listen(":" + port); err != nil {
			log.Panicf("Failed to start server: %v", err)
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down server...")

	// Create a context with timeout for shutdown
	_, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := app.Shutdown(); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	// Close DB connection
	sqlDB, _ := db.DB()
	if err := sqlDB.Close(); err != nil {
		log.Fatalf("Failed to close database: %v", err)
	}

	log.Println("Server exited gracefully")
}
