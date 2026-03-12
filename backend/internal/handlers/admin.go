package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// RegisterCRUD registers generic CRUD endpoints for any GORM model
func RegisterCRUD[T any](router *gin.RouterGroup, db *gorm.DB, path string) {
	group := router.Group(path)

	// List
	group.GET("", func(c *gin.Context) {
		var items []T
		if err := db.Find(&items).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, items)
	})

	// Get
	group.GET("/:id", func(c *gin.Context) {
		id := c.Param("id")
		var item T
		if err := db.First(&item, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
			return
		}
		c.JSON(http.StatusOK, item)
	})

	// Create
	group.POST("", func(c *gin.Context) {
		var item T
		if err := c.ShouldBindJSON(&item); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := db.Create(&item).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusCreated, item)
	})

	// Update
	group.PUT("/:id", func(c *gin.Context) {
		id := c.Param("id")
		var item T
		if err := db.First(&item, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
			return
		}

		var updateData map[string]interface{}
		if err := c.ShouldBindJSON(&updateData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Prevent updating protected fields implicitly through generic map
		delete(updateData, "id")
		delete(updateData, "ID")
		delete(updateData, "created_at")
		delete(updateData, "updated_at")

		if err := db.Model(&item).Updates(updateData).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Fetch the updated item
		db.First(&item, id)
		c.JSON(http.StatusOK, item)
	})

	// Delete
	group.DELETE("/:id", func(c *gin.Context) {
		id := c.Param("id")
		var item T
		if err := db.Delete(&item, id).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
	})
}
