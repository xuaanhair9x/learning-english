package database

import (
	"log"

	"learn-english-backend/internal/models"

	"gorm.io/gorm"
)

func SeedToeic(db *gorm.DB) {
	var count int64
	db.Model(&models.ToeicTest{}).Count(&count)
	if count > 0 {
		log.Println("TOEIC data already seeded, skipping...")
		return
	}

	// 1. Create a Test
	test := models.ToeicTest{
		Title:     "Test 1 ETS 2026",
		Publisher: "ETS 2026",
		Duration:  120,
		TotalHits: 15420,
	}
	if err := db.Create(&test).Error; err != nil {
		log.Printf("Error seeding TOEIC test: %v", err)
		return
	}

	// 2. Create Part 1
	part1 := models.ToeicPart{
		TestID:      test.ID,
		PartNumber:  1,
		Description: "Mô tả tranh",
	}
	if err := db.Create(&part1).Error; err != nil {
		log.Printf("Error seeding TOEIC part: %v", err)
		return
	}

	// 3. Create Questions for Part 1
	questions := []models.ToeicQuestion{
		{
			PartID:        part1.ID,
			QuestionNum:   1,
			ImageUrl:      "https://images.unsplash.com/photo-1544365558-3501acf3ff5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
			AudioUrl:      "https://www.soundhelix.com/architecture/AudioTest.mp3",
			OptionA:       "The woman is carrying a tray of food.",
			OptionB:       "The woman is wearing a jacket.",
			OptionC:       "The woman is tying up her hair.",
			OptionD:       "The woman is removing her hat.",
			CorrectAnswer: "B",
			Transcript:    "(A) The woman is carrying a tray of food.\n(B) The woman is wearing a jacket.\n(C) The woman is tying up her hair.\n(D) The woman is removing her hat.",
			Explanation:   "(A) Người phụ nữ đang bưng một khay thức ăn.\n(B) Người phụ nữ đang mặc một chiếc áo khoác.\n(C) Người phụ nữ đang buộc tóc.\n(D) Người phụ nữ đang tháo mũ của mình.",
		},
		{
			PartID:        part1.ID,
			QuestionNum:   2,
			ImageUrl:      "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
			AudioUrl:      "https://www.soundhelix.com/architecture/AudioTest.mp3",
			OptionA:       "The man is taking a picture.",
			OptionB:       "The man is holding a book.",
			OptionC:       "The man is driving a car.",
			OptionD:       "The man is eating a sandwich.",
			CorrectAnswer: "A",
			Transcript:    "(A) The man is taking a picture.\n(B) The man is holding a book.\n(C) The man is driving a car.\n(D) The man is eating a sandwich.",
			Explanation:   "Chọn A vì người đàn ông đang cầm máy ảnh chụp ảnh.",
		},
	}

	for _, q := range questions {
		if err := db.Create(&q).Error; err != nil {
			log.Printf("Error seeding TOEIC question: %v", err)
		}
	}

	log.Println("TOEIC data seeded successfully!")
}
