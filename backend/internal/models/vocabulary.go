package models

import (
	"time"

	"gorm.io/gorm"
)

// Vocabulary represents a single word in a lesson
type Vocabulary struct {
	ID           uint           `json:"id" gorm:"primaryKey"`
	LessonID     uint           `json:"lesson_id" gorm:"not null"`
	Word         string         `json:"word" gorm:"not null"`
	Phonetic     string         `json:"phonetic"`
	PartOfSpeech string         `json:"part_of_speech"` // noun, verb, adj...
	Definition   string         `json:"definition"`
	Vietnamese   string         `json:"vietnamese"`
	ExampleEn    string         `json:"example_en"`
	ExampleVi    string         `json:"example_vi"`
	AudioURL     string         `json:"audio_url"`
	ImageURL     string         `json:"image_url"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `json:"-" gorm:"index"`
}

// Topic represents a thematic category (Luyện theo Chủ đề)
type Topic struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	Title       string         `json:"title" gorm:"not null"`
	Description string         `json:"description"`
	Icon        string         `json:"icon"`  // emoji or icon name
	Color       string         `json:"color"` // theme color
	TotalWords  int            `json:"total_words"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}
