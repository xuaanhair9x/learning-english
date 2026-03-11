package models

import (
	"time"

	"gorm.io/gorm"
)

// Course represents a vocabulary set (Bộ từ vựng)
type Course struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	Title       string         `json:"title" gorm:"not null"`
	Description string         `json:"description"`
	CoverColor  string         `json:"cover_color"` // e.g. "#1e3a8a"
	CoverLabel  string         `json:"cover_label"` // e.g. "TOEIC 2025"
	SubLabel    string         `json:"sub_label"`   // e.g. "LC 800"
	Category    string         `json:"category"`    // e.g. "TOEIC", "IELTS"
	TotalWords  int            `json:"total_words"`
	Lessons     []Lesson       `json:"lessons,omitempty" gorm:"foreignKey:CourseID"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}

// Lesson is a chapter within a course
type Lesson struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	CourseID    uint           `json:"course_id" gorm:"not null"`
	Title       string         `json:"title" gorm:"not null"`
	Description string         `json:"description"`
	Order       int            `json:"order"`
	Vocabulary  []Vocabulary   `json:"vocabulary,omitempty" gorm:"foreignKey:LessonID"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}
