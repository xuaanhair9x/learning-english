package models

import (
	"time"

	"gorm.io/gorm"
)

// Sentence is a sentence used in the Read Aloud feature
type Sentence struct {
	ID         uint           `json:"id" gorm:"primaryKey"`
	Content    string         `json:"content" gorm:"not null"`
	Vietnamese string         `json:"vietnamese"`
	Level      string         `json:"level"` // basic, intermediate, advanced
	Topic      string         `json:"topic"` // daily, business, travel, etc.
	AudioURL   string         `json:"audio_url"`
	Order      int            `json:"order"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `json:"-" gorm:"index"`
}
