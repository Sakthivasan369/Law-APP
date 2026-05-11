package main

import (
	"log"
	"net/http"
	"os"

	"github.com/edearn/server/internal/database"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load("../../.env"); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Initialize database
	database.Connect()

	// Initialize router
	r := gin.Default()

	// Ping endpoint
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
			"status":  "connected",
		})
	})

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
