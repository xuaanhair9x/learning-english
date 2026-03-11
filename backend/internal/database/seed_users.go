package database

import (
	"log"

	"learn-english-backend/internal/models"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func hashPassword(pw string) string {
	b, err := bcrypt.GenerateFromPassword([]byte(pw), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("Failed to hash password: %v", err)
	}
	return string(b)
}

func SeedUsers(db *gorm.DB) {
	seedUsers := []models.User{
		{
			Name:     "Admin",
			Email:    "admin@admin.com",
			Password: hashPassword("admin123"),
			Avatar:   "👑",
		},
		{
			Name:     "Test User",
			Email:    "test@test.com",
			Password: hashPassword("test123"),
		},
	}
	for _, u := range seedUsers {
		var existing models.User
		if db.Where("email = ?", u.Email).First(&existing).Error != nil {
			db.Create(&u)
			log.Printf("Created user: %s", u.Email)
		}
	}
}
