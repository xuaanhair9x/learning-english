package main

import (
	"learn-english-backend/internal/config"
	"learn-english-backend/internal/handlers"
	"learn-english-backend/internal/middleware"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// SetupRoutes registers all API route groups on the Gin engine.
func SetupRoutes(r *gin.Engine, db *gorm.DB, cfg *config.Config) {
	// ─── Auth ────────────────────────────────────────────────────
	authHandler := &handlers.AuthHandler{DB: db, Cfg: cfg}
	auth := r.Group("/api/auth")
	{
		auth.POST("/register", authHandler.Register)
		auth.POST("/login", authHandler.Login)
		auth.GET("/me", middleware.AuthMiddleware(cfg), authHandler.Me)
	}

	// ─── Courses ─────────────────────────────────────────────────
	courseHandler := &handlers.CourseHandler{DB: db}
	courses := r.Group("/api/courses")
	{
		courses.GET("", courseHandler.List)
		courses.GET("/:id", courseHandler.Get)
	}

	// ─── Lessons ─────────────────────────────────────────────────
	lessonHandler := &handlers.LessonHandler{DB: db}
	lessons := r.Group("/api/lessons")
	{
		lessons.GET("/:id", lessonHandler.Get)
		lessons.GET("/course/:courseId", lessonHandler.ListByCourse)
	}

	// ─── Topics ──────────────────────────────────────────────────
	topicHandler := &handlers.TopicHandler{DB: db}
	topics := r.Group("/api/topics")
	{
		topics.GET("", topicHandler.List)
		topics.GET("/:id", topicHandler.Get)
	}

	// ─── Sentences (Read Aloud) ──────────────────────────────────
	sentenceHandler := &handlers.SentenceHandler{DB: db}
	sentences := r.Group("/api/sentences")
	{
		sentences.GET("", sentenceHandler.List)
		sentences.GET("/:id", sentenceHandler.Get)
	}

	// ─── Dictation ───────────────────────────────────────────────
	dictHandler := &handlers.DictationHandler{DB: db}
	dict := r.Group("/api/dictation")
	{
		dict.GET("/collections", dictHandler.ListCollections)
		dict.GET("/collections/:id/passages", dictHandler.ListPassages)
		dict.GET("/passages/:id", dictHandler.GetPassage)
		dict.GET("/passages/:id/exercises", dictHandler.ListExercises)
		dict.POST("/exercises/:id/check", dictHandler.CheckAnswer)
	}

	// ─── Progress (authenticated) ────────────────────────────────
	progressHandler := &handlers.ProgressHandler{DB: db}
	progress := r.Group("/api/progress")
	progress.Use(middleware.AuthMiddleware(cfg))
	{
		progress.GET("", progressHandler.GetMyProgress)
		progress.POST("", progressHandler.Update)
	}
}
