package handlers

import (
	"net/http"

	"learn-english-backend/internal/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type TopicHandler struct {
	DB *gorm.DB
}

func (h *TopicHandler) List(c *gin.Context) {
	var topics []models.Topic
	result := h.DB.Find(&topics)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch topics"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": topics, "total": len(topics)})
}

func (h *TopicHandler) Get(c *gin.Context) {
	id := c.Param("id")
	var topic models.Topic
	result := h.DB.First(&topic, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Topic not found"})
		return
	}
	c.JSON(http.StatusOK, topic)
}
