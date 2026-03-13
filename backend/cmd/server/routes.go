package main

import (
	"learn-english-backend/internal/config"
	"learn-english-backend/internal/handlers"
	"learn-english-backend/internal/middleware"
	"learn-english-backend/internal/models"

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

	// ─── Grammar ─────────────────────────────────────────────────
	grammarHandler := &handlers.GrammarHandler{DB: db}
	grammar := r.Group("/api/grammar")
	{
		grammar.GET("/units", grammarHandler.ListUnits)
		grammar.GET("/lessons/:id", grammarHandler.GetLesson)
	}

	// ─── Progress (authenticated) ────────────────────────────────
	progressHandler := &handlers.ProgressHandler{DB: db}
	progress := r.Group("/api/progress")
	progress.Use(middleware.AuthMiddleware(cfg))
	{
		progress.GET("", progressHandler.GetMyProgress)
		progress.POST("", progressHandler.Update)
	}

	// ─── Admin (protected) ───────────────────────────────────────
	admin := r.Group("/api/admin")
	admin.Use(middleware.AuthMiddleware(cfg))
	admin.Use(middleware.AdminMiddleware())
	{
		handlers.RegisterCRUD[models.User](admin, db, "/users")
		handlers.RegisterCRUD[models.Course](admin, db, "/courses")
		handlers.RegisterCRUD[models.Lesson](admin, db, "/lessons")
		handlers.RegisterCRUD[models.Vocabulary](admin, db, "/vocabulary")
		handlers.RegisterCRUD[models.Topic](admin, db, "/topics")
		handlers.RegisterCRUD[models.Sentence](admin, db, "/sentences")
		handlers.RegisterCRUD[models.DictationCollection](admin, db, "/dictation-collections")
		handlers.RegisterCRUD[models.DictationPassage](admin, db, "/dictation-passages")
		handlers.RegisterCRUD[models.DictationExercise](admin, db, "/dictation-exercises")
		handlers.RegisterCRUD[models.GrammarUnit](admin, db, "/grammar-units")
		handlers.RegisterCRUD[models.GrammarLesson](admin, db, "/grammar-lessons")
		handlers.RegisterCRUD[models.GrammarExercise](admin, db, "/grammar-exercises")
	}
}
