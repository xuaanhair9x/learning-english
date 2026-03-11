package database

import (
	"log"

	"gorm.io/gorm"
)

// Seed orchestrates all seeders. Each seeder checks its own data independently.
func Seed(db *gorm.DB) {
	log.Println("Running seeders...")

	SeedUsers(db)
	SeedCourses(db)
	SeedSentences(db)
	SeedDictation(db)

	log.Println("All seeders complete.")
}
