package main

import (
	"log"

	"learn-english-backend/internal/config"
	"learn-english-backend/internal/database"
	"learn-english-backend/internal/handlers"
	"learn-english-backend/internal/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env if present
	_ = godotenv.Load()

	cfg := config.Load()

	// Database
	db := database.Connect(cfg)
	database.Migrate(db)
	database.Seed(db)

	// Router
	r := gin.Default()

	// CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Health check
	r.GET("/api/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "service": "learn-english-backend"})
	})

	// ─── Auth routes ────────────────────────────────────────────
	authHandler := &handlers.AuthHandler{DB: db, Cfg: cfg}
	auth := r.Group("/api/auth")
	{
		auth.POST("/register", authHandler.Register)
		auth.POST("/login", authHandler.Login)
		auth.GET("/me", middleware.AuthMiddleware(cfg), authHandler.Me)
	}

	// ─── Course routes ──────────────────────────────────────────
	courseHandler := &handlers.CourseHandler{DB: db}
	courses := r.Group("/api/courses")
	{
		courses.GET("", courseHandler.List)
		courses.GET("/:id", courseHandler.Get)
	}

	// ─── Lesson routes ──────────────────────────────────────────
	lessonHandler := &handlers.LessonHandler{DB: db}
	lessons := r.Group("/api/lessons")
	{
		lessons.GET("/:id", lessonHandler.Get)
		lessons.GET("/course/:courseId", lessonHandler.ListByCourse)
	}

	// ─── Topic routes ───────────────────────────────────────────
	topicHandler := &handlers.TopicHandler{DB: db}
	topics := r.Group("/api/topics")
	{
		topics.GET("", topicHandler.List)
		topics.GET("/:id", topicHandler.Get)
	}

	// ─── Sentence routes (Read Aloud) ───────────────────────────
	sentenceHandler := &handlers.SentenceHandler{DB: db}
	sentences := r.Group("/api/sentences")
	{
		sentences.GET("", sentenceHandler.List)
		sentences.GET("/:id", sentenceHandler.Get)
	}

	// ─── Progress routes (authenticated) ────────────────────────
	progressHandler := &handlers.ProgressHandler{DB: db}
	progress := r.Group("/api/progress")
	progress.Use(middleware.AuthMiddleware(cfg))
	{
		progress.GET("", progressHandler.GetMyProgress)
		progress.POST("", progressHandler.Update)
	}

	addr := ":" + cfg.Port
	log.Printf("Server starting on %s", addr)
	if err := r.Run(addr); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
