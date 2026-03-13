package models

import (
	"time"

	"gorm.io/gorm"
)

// GrammarUnit represents a top-level grammar category, like "UNIT 1: CÁC THÌ ĐƠN"
type GrammarUnit struct {
	ID          uint            `json:"id" gorm:"primaryKey"`
	Title       string          `json:"title" gorm:"not null"`
	Description string          `json:"description"`
	Order       int             `json:"order"` // Used for sorting units sequentially
	Lessons     []GrammarLesson `json:"lessons,omitempty" gorm:"foreignKey:UnitID"`
	CreatedAt   time.Time       `json:"created_at"`
	UpdatedAt   time.Time       `json:"updated_at"`
	DeletedAt   gorm.DeletedAt  `json:"-" gorm:"index"`
}

// GrammarLesson represents a specific lesson or exercise within a unit
type GrammarLesson struct {
	ID        uint              `json:"id" gorm:"primaryKey"`
	UnitID    uint              `json:"unit_id" gorm:"not null;index"`
	Title     string            `json:"title" gorm:"not null"`
	Type      string            `json:"type"`    // e.g., "theory" (Tổng quan) or "exercise" (Bài tập)
	Content   string            `json:"content"` // Markdown or HTML content for the grammar explanation/exercise
	Order     int               `json:"order"`   // Used for sorting lessons inside a unit
	Exercises []GrammarExercise `json:"exercises,omitempty" gorm:"foreignKey:LessonID"`
	CreatedAt time.Time         `json:"created_at"`
	UpdatedAt time.Time         `json:"updated_at"`
	DeletedAt gorm.DeletedAt    `json:"-" gorm:"index"`
}

// GrammarExercise represents an individual question/exercise for a GrammarLesson
type GrammarExercise struct {
	ID            uint           `json:"id" gorm:"primaryKey"`
	LessonID      uint           `json:"lesson_id" gorm:"not null;index"`
	Question      string         `json:"question" gorm:"not null"`
	CorrectAnswer string         `json:"correct_answer"`
	Explanation   string         `json:"explanation"`
	Order         int            `json:"order"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `json:"-" gorm:"index"`
}
