package handlers

import (
	"net/http"

	"learn-english-backend/internal/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type GrammarHandler struct {
	DB *gorm.DB
}

// ListUnits returns all grammar units, including their lessons
func (h *GrammarHandler) ListUnits(c *gin.Context) {
	var units []models.GrammarUnit
	if err := h.DB.Preload("Lessons", func(db *gorm.DB) *gorm.DB {
		return db.Order("grammar_lessons.order ASC")
	}).Order("grammar_units.order ASC").Find(&units).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch grammar units"})
		return
	}
	c.JSON(http.StatusOK, units)
}

// GetLesson returns a specific lesson by ID, including its exercises if any
func (h *GrammarHandler) GetLesson(c *gin.Context) {
	id := c.Param("id")
	var lesson models.GrammarLesson
	if err := h.DB.Preload("Exercises", func(db *gorm.DB) *gorm.DB {
		return db.Order("grammar_exercises.order ASC")
	}).First(&lesson, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Grammar lesson not found"})
		return
	}
	c.JSON(http.StatusOK, lesson)
}
