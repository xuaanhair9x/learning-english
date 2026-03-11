package models

import (
	"time"

	"gorm.io/gorm"
)

// DictationCollection groups passages (e.g. "Short Stories", "Conversations")
type DictationCollection struct {
	ID          uint               `json:"id" gorm:"primaryKey"`
	Title       string             `json:"title"`
	Description string             `json:"description"`
	Icon        string             `json:"icon"`
	Color       string             `json:"color"`
	Order       int                `json:"order"`
	Passages    []DictationPassage `json:"passages,omitempty" gorm:"foreignKey:CollectionID"`
	CreatedAt   time.Time          `json:"created_at"`
	UpdatedAt   time.Time          `json:"updated_at"`
	DeletedAt   gorm.DeletedAt     `json:"-" gorm:"index"`
}

// DictationPassage is a story/passage inside a collection
type DictationPassage struct {
	ID             uint                `json:"id" gorm:"primaryKey"`
	CollectionID   uint                `json:"collection_id"`
	Title          string              `json:"title"`
	Duration       string              `json:"duration"` // e.g. "10 Phút"
	TotalSentences int                 `json:"total_sentences"`
	Order          int                 `json:"order"`
	Exercises      []DictationExercise `json:"exercises,omitempty" gorm:"foreignKey:PassageID"`
	CreatedAt      time.Time           `json:"created_at"`
	UpdatedAt      time.Time           `json:"updated_at"`
	DeletedAt      gorm.DeletedAt      `json:"-" gorm:"index"`
}

// DictationExercise is a single fill-in-the-blank sentence
type DictationExercise struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	PassageID   uint           `json:"passage_id"`
	Sentence    string         `json:"sentence"`     // Full sentence (answer included)
	BeforeBlank string         `json:"before_blank"` // Text before the blank
	AfterBlank  string         `json:"after_blank"`  // Text after the blank
	Answer      string         `json:"answer"`       // The masked word(s)
	Vietnamese  string         `json:"vietnamese"`   // Translation of full sentence
	Distractors string         `json:"distractors"`  // Comma-separated wrong options
	Order       int            `json:"order"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}
