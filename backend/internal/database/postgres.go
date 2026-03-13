package database

import (
	"fmt"
	"log"

	"learn-english-backend/internal/config"
	"learn-english-backend/internal/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func Connect(cfg *config.Config) *gorm.DB {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Ho_Chi_Minh",
		cfg.DBHost, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBPort,
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	log.Println("Database connected successfully")
	return db
}

func Migrate(db *gorm.DB) {
	err := db.AutoMigrate(
		&models.User{},
		&models.Course{},
		&models.Lesson{},
		&models.Vocabulary{},
		&models.Topic{},
		&models.UserProgress{},
		&models.Sentence{},
		&models.DictationCollection{},
		&models.DictationPassage{},
		&models.DictationExercise{},
		&models.GrammarUnit{},
		&models.GrammarLesson{},
		&models.GrammarExercise{},
	)
	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}
	log.Println("Database migrated successfully")
}
