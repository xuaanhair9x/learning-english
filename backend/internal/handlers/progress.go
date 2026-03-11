package handlers

import (
	"net/http"
	"time"

	"learn-english-backend/internal/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ProgressHandler struct {
	DB *gorm.DB
}

func (h *ProgressHandler) GetMyProgress(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)

	var progresses []models.UserProgress
	h.DB.Where("user_id = ?", userID).Find(&progresses)
	c.JSON(http.StatusOK, gin.H{"data": progresses})
}

type UpdateProgressRequest struct {
	CourseID     uint    `json:"course_id" binding:"required"`
	LessonID     *uint   `json:"lesson_id"`
	WordsLearned int     `json:"words_learned"`
	TotalWords   int     `json:"total_words"`
	PercentDone  float64 `json:"percent_done"`
}

func (h *ProgressHandler) Update(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)

	var req UpdateProgressRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	now := time.Now()
	var progress models.UserProgress
	result := h.DB.Where("user_id = ? AND course_id = ?", userID, req.CourseID).First(&progress)

	if result.Error != nil {
		// Create new
		progress = models.UserProgress{
			UserID:        userID,
			CourseID:      req.CourseID,
			LessonID:      req.LessonID,
			WordsLearned:  req.WordsLearned,
			TotalWords:    req.TotalWords,
			PercentDone:   req.PercentDone,
			LastStudiedAt: &now,
		}
		h.DB.Create(&progress)
	} else {
		// Update existing
		h.DB.Model(&progress).Updates(map[string]interface{}{
			"words_learned":   req.WordsLearned,
			"total_words":     req.TotalWords,
			"percent_done":    req.PercentDone,
			"last_studied_at": &now,
			"lesson_id":       req.LessonID,
		})
	}

	c.JSON(http.StatusOK, progress)
}
