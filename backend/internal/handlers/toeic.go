package handlers

import (
	"net/http"

	"learn-english-backend/internal/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ToeicHandler struct {
	DB *gorm.DB
}

// ListTests returns all tests, possibly grouped or ordered by publisher
func (h *ToeicHandler) ListTests(c *gin.Context) {
	var tests []models.ToeicTest
	if err := h.DB.Order("publisher DESC, title ASC").Find(&tests).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch TOEIC tests"})
		return
	}
	c.JSON(http.StatusOK, tests)
}

// GetTest returns a specific test by ID, including its parts
func (h *ToeicHandler) GetTest(c *gin.Context) {
	id := c.Param("id")
	var test models.ToeicTest
	if err := h.DB.Preload("Parts", func(db *gorm.DB) *gorm.DB {
		return db.Order("part_number ASC")
	}).First(&test, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "TOEIC test not found"})
		return
	}
	c.JSON(http.StatusOK, test)
}

// GetPartQuestions returns questions for a specific part
func (h *ToeicHandler) GetPartQuestions(c *gin.Context) {
	partId := c.Param("partId")
	var questions []models.ToeicQuestion
	if err := h.DB.Where("part_id = ?", partId).Order("question_num ASC").Find(&questions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch questions"})
		return
	}
	c.JSON(http.StatusOK, questions)
}
