package models

import (
	"time"

	"gorm.io/gorm"
)

// UserProgress tracks which lessons/courses a user has studied
type UserProgress struct {
	ID            uint           `json:"id" gorm:"primaryKey"`
	UserID        uint           `json:"user_id" gorm:"not null;index"`
	CourseID      uint           `json:"course_id" gorm:"not null;index"`
	LessonID      *uint          `json:"lesson_id"`
	WordsLearned  int            `json:"words_learned"`
	TotalWords    int            `json:"total_words"`
	PercentDone   float64        `json:"percent_done"`
	LastStudiedAt *time.Time     `json:"last_studied_at"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `json:"-" gorm:"index"`
}
