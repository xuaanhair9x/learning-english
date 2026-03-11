package handlers

import (
	"net/http"
	"strconv"

	"learn-english-backend/internal/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type SentenceHandler struct {
	DB *gorm.DB
}

func (h *SentenceHandler) List(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	level := c.Query("level")
	topic := c.Query("topic")

	if page < 1 {
		page = 1
	}
	offset := (page - 1) * limit

	query := h.DB.Model(&models.Sentence{})
	if level != "" {
		query = query.Where("level = ?", level)
	}
	if topic != "" {
		query = query.Where("topic = ?", topic)
	}

	var total int64
	query.Count(&total)

	var sentences []models.Sentence
	query.Order("\"order\" asc").Offset(offset).Limit(limit).Find(&sentences)

	c.JSON(http.StatusOK, gin.H{
		"data":  sentences,
		"total": total,
		"page":  page,
		"limit": limit,
		"pages": (int(total) + limit - 1) / limit,
	})
}

func (h *SentenceHandler) Get(c *gin.Context) {
	id := c.Param("id")
	var sentence models.Sentence
	if result := h.DB.First(&sentence, id); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Sentence not found"})
		return
	}
	c.JSON(http.StatusOK, sentence)
}
