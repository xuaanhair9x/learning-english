package handlers

import (
	"net/http"
	"strconv"

	"learn-english-backend/internal/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type DictationHandler struct {
	DB *gorm.DB
}

// GET /api/dictation/collections
func (h *DictationHandler) ListCollections(c *gin.Context) {
	var collections []models.DictationCollection
	h.DB.Order("\"order\" asc").Find(&collections)

	// attach passage count per collection
	type CollectionOut struct {
		models.DictationCollection
		PassageCount int64 `json:"passage_count"`
	}
	out := make([]CollectionOut, len(collections))
	for i, col := range collections {
		var cnt int64
		h.DB.Model(&models.DictationPassage{}).Where("collection_id = ?", col.ID).Count(&cnt)
		out[i] = CollectionOut{col, cnt}
	}
	c.JSON(http.StatusOK, out)
}

// GET /api/dictation/collections/:id/passages
func (h *DictationHandler) ListPassages(c *gin.Context) {
	colID := c.Param("id")
	var passages []models.DictationPassage
	h.DB.Where("collection_id = ?", colID).Order("\"order\" asc").Find(&passages)
	c.JSON(http.StatusOK, passages)
}

// GET /api/dictation/passages/:id
func (h *DictationHandler) GetPassage(c *gin.Context) {
	id := c.Param("id")
	var passage models.DictationPassage
	if err := h.DB.First(&passage, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	c.JSON(http.StatusOK, passage)
}

// GET /api/dictation/passages/:id/exercises
func (h *DictationHandler) ListExercises(c *gin.Context) {
	passageID := c.Param("id")
	var exercises []models.DictationExercise
	h.DB.Where("passage_id = ?", passageID).Order("\"order\" asc").Find(&exercises)

	// Hide answer field if ?hide_answers=true (default true)
	hideAnswers := c.DefaultQuery("hide_answers", "true") == "true"
	if hideAnswers {
		type SafeExercise struct {
			ID          uint   `json:"id"`
			PassageID   uint   `json:"passage_id"`
			BeforeBlank string `json:"before_blank"`
			AfterBlank  string `json:"after_blank"`
			Distractors string `json:"distractors"`
			Order       int    `json:"order"`
		}
		safe := make([]SafeExercise, len(exercises))
		for i, ex := range exercises {
			safe[i] = SafeExercise{ex.ID, ex.PassageID, ex.BeforeBlank, ex.AfterBlank, ex.Distractors, ex.Order}
		}
		c.JSON(http.StatusOK, safe)
		return
	}
	c.JSON(http.StatusOK, exercises)
}

// POST /api/dictation/exercises/:id/check
func (h *DictationHandler) CheckAnswer(c *gin.Context) {
	id := c.Param("id")
	idInt, _ := strconv.Atoi(id)

	var body struct {
		UserAnswer string `json:"answer"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid body"})
		return
	}

	var ex models.DictationExercise
	if err := h.DB.First(&ex, idInt).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	correct := NormalizeAnswer(body.UserAnswer) == NormalizeAnswer(ex.Answer)
	c.JSON(http.StatusOK, gin.H{
		"correct":    correct,
		"answer":     ex.Answer,
		"sentence":   ex.Sentence,
		"vietnamese": ex.Vietnamese,
	})
}
