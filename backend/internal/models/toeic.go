package models

import (
	"time"

	"gorm.io/gorm"
)

// ToeicTest represents a full TOEIC test (e.g., "Test 1 ETS 2026")
type ToeicTest struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	Title     string         `json:"title" gorm:"not null"`
	Publisher string         `json:"publisher"`  // e.g., "ETS 2026"
	Duration  int            `json:"duration"`   // in minutes, default 120
	TotalHits int            `json:"total_hits"` // how many times this test was taken
	Parts     []ToeicPart    `json:"parts,omitempty" gorm:"foreignKey:TestID"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

// ToeicPart represents a part of the test (e.g., Part 1: Photographs)
type ToeicPart struct {
	ID          uint            `json:"id" gorm:"primaryKey"`
	TestID      uint            `json:"test_id" gorm:"not null;index"`
	PartNumber  int             `json:"part_number" gorm:"not null"` // 1-7
	Description string          `json:"description"`
	Questions   []ToeicQuestion `json:"questions,omitempty" gorm:"foreignKey:PartID"`
	CreatedAt   time.Time       `json:"created_at"`
	UpdatedAt   time.Time       `json:"updated_at"`
	DeletedAt   gorm.DeletedAt  `json:"-" gorm:"index"`
}

// ToeicQuestion represents a single question in a TOEIC part
type ToeicQuestion struct {
	ID            uint           `json:"id" gorm:"primaryKey"`
	PartID        uint           `json:"part_id" gorm:"not null;index"`
	QuestionNum   int            `json:"question_num" gorm:"not null"` // e.g., 1 to 200
	ImageUrl      string         `json:"image_url"`                    // For Part 1, 3, 4
	AudioUrl      string         `json:"audio_url"`                    // For Part 1, 2, 3, 4
	QuestionText  string         `json:"question_text"`                // For Part 3, 4, 5, 6, 7
	OptionA       string         `json:"option_a"`
	OptionB       string         `json:"option_b"`
	OptionC       string         `json:"option_c"`
	OptionD       string         `json:"option_d"`
	CorrectAnswer string         `json:"correct_answer" gorm:"not null"` // "A", "B", "C", "D"
	Transcript    string         `json:"transcript"`
	Explanation   string         `json:"explanation"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `json:"-" gorm:"index"`
}
