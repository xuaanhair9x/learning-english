package handlers

import (
	"net/http"

	"learn-english-backend/internal/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type CourseHandler struct {
	DB *gorm.DB
}

func (h *CourseHandler) List(c *gin.Context) {
	var courses []models.Course
	result := h.DB.Find(&courses)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch courses"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": courses, "total": len(courses)})
}

func (h *CourseHandler) Get(c *gin.Context) {
	id := c.Param("id")
	var course models.Course
	result := h.DB.Preload("Lessons").First(&course, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Course not found"})
		return
	}
	c.JSON(http.StatusOK, course)
}

type LessonHandler struct {
	DB *gorm.DB
}

func (h *LessonHandler) Get(c *gin.Context) {
	id := c.Param("id")
	var lesson models.Lesson
	result := h.DB.Preload("Vocabulary").First(&lesson, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Lesson not found"})
		return
	}
	c.JSON(http.StatusOK, lesson)
}

func (h *LessonHandler) ListByCourse(c *gin.Context) {
	courseID := c.Param("courseId")
	var lessons []models.Lesson
	result := h.DB.Where("course_id = ?", courseID).Order("order asc").Find(&lessons)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch lessons"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": lessons, "total": len(lessons)})
}
