package database

import (
	"log"
	"time"

	"learn-english-backend/internal/models"

	"gorm.io/gorm"
)

func SeedCourses(db *gorm.DB) {
	var count int64
	db.Model(&models.Course{}).Count(&count)
	if count > 0 {
		log.Println("Courses already seeded, skipping...")
		return
	}

	log.Println("Seeding courses, lessons, vocabulary, topics...")

	// ─── COURSES ────────────────────────────────────────────────
	courses := []models.Course{
		{
			Title:       "800 Voca TOEIC 2025 - Listening",
			Description: "Luyện từ vựng TOEIC Listening với 800 từ quan trọng nhất",
			CoverColor:  "#1e3a8a",
			CoverLabel:  "TOEIC 2025",
			SubLabel:    "LC 800",
			Category:    "TOEIC",
			TotalWords:  800,
		},
		{
			Title:       "800 Voca TOEIC 2025 - Reading",
			Description: "Luyện từ vựng TOEIC Reading với 800 từ quan trọng nhất",
			CoverColor:  "#065f46",
			CoverLabel:  "TOEIC 2025",
			SubLabel:    "RC 800",
			Category:    "TOEIC",
			TotalWords:  800,
		},
		{
			Title:       "600 TOEIC Essential Words",
			Description: "600 từ vựng TOEIC thiết yếu cho người mới bắt đầu",
			CoverColor:  "#7c3aed",
			CoverLabel:  "TOEIC",
			SubLabel:    "600 ESSENTIAL WORDS",
			Category:    "TOEIC",
			TotalWords:  600,
		},
		{
			Title:       "IELTS Academic Vocabulary",
			Description: "Từ vựng học thuật cho kỳ thi IELTS",
			CoverColor:  "#dc2626",
			CoverLabel:  "IELTS",
			SubLabel:    "ACADEMIC",
			Category:    "IELTS",
			TotalWords:  500,
		},
	}
	db.Create(&courses)

	// ─── LESSONS ────────────────────────────────────────────────
	lessons := []models.Lesson{
		{CourseID: courses[0].ID, Title: "Short Silence 01", Description: "Bài 1: Từ vựng cơ bản phần Listening", Order: 1},
		{CourseID: courses[0].ID, Title: "Short Silence 02", Description: "Bài 2: Từ vựng phần hội thoại", Order: 2},
		{CourseID: courses[0].ID, Title: "Short Silence 03", Description: "Bài 3: Từ vựng mô tả hình ảnh", Order: 3},
		{CourseID: courses[1].ID, Title: "Unit 01 - Business", Description: "Từ vựng kinh doanh cơ bản", Order: 1},
		{CourseID: courses[1].ID, Title: "Unit 02 - Office", Description: "Từ vựng môi trường văn phòng", Order: 2},
		{CourseID: courses[2].ID, Title: "Part 1 - Essential", Description: "600 từ thiết yếu - Phần 1", Order: 1},
	}
	db.Create(&lessons)

	// ─── VOCABULARY ─────────────────────────────────────────────
	_ = time.Now()
	vocabularies := []models.Vocabulary{
		{LessonID: lessons[0].ID, Word: "accommodate", Phonetic: "/əˈkɒmədeɪt/", PartOfSpeech: "verb", Definition: "to provide lodging or a room for", Vietnamese: "đáp ứng, phục vụ", ExampleEn: "The hotel can accommodate 200 guests.", ExampleVi: "Khách sạn có thể phục vụ 200 khách."},
		{LessonID: lessons[0].ID, Word: "allocate", Phonetic: "/ˈæləkeɪt/", PartOfSpeech: "verb", Definition: "to distribute for a special purpose", Vietnamese: "phân bổ, phân phối", ExampleEn: "They allocated funds for the project.", ExampleVi: "Họ đã phân bổ ngân quỹ cho dự án."},
		{LessonID: lessons[0].ID, Word: "annual", Phonetic: "/ˈænjuəl/", PartOfSpeech: "adjective", Definition: "happening once a year", Vietnamese: "hàng năm", ExampleEn: "The annual report was released today.", ExampleVi: "Báo cáo hàng năm được phát hành hôm nay."},
		{LessonID: lessons[0].ID, Word: "approximately", Phonetic: "/əˈprɒksɪmətli/", PartOfSpeech: "adverb", Definition: "close to a particular number", Vietnamese: "xấp xỉ, khoảng", ExampleEn: "The project costs approximately $5,000.", ExampleVi: "Dự án có chi phí khoảng 5,000 đô."},
		{LessonID: lessons[0].ID, Word: "authorize", Phonetic: "/ˈɔːθəraɪz/", PartOfSpeech: "verb", Definition: "to give official permission", Vietnamese: "ủy quyền, cho phép", ExampleEn: "The manager authorized the purchase.", ExampleVi: "Quản lý đã ủy quyền cho việc mua hàng."},
		{LessonID: lessons[1].ID, Word: "candidate", Phonetic: "/ˈkændɪdeɪt/", PartOfSpeech: "noun", Definition: "a person applying for a job", Vietnamese: "ứng viên", ExampleEn: "We interviewed five candidates today.", ExampleVi: "Chúng tôi đã phỏng vấn 5 ứng viên hôm nay."},
		{LessonID: lessons[1].ID, Word: "collaborate", Phonetic: "/kəˈlæbəreɪt/", PartOfSpeech: "verb", Definition: "to work jointly with others", Vietnamese: "cộng tác, hợp tác", ExampleEn: "The teams collaborated on the project.", ExampleVi: "Các nhóm đã hợp tác trong dự án."},
		{LessonID: lessons[3].ID, Word: "conference", Phonetic: "/ˈkɒnfərəns/", PartOfSpeech: "noun", Definition: "a formal meeting for discussion", Vietnamese: "hội nghị, hội thảo", ExampleEn: "She attended the annual conference.", ExampleVi: "Cô ấy đã tham dự hội nghị thường niên."},
		{LessonID: lessons[3].ID, Word: "corporate", Phonetic: "/ˈkɔːrpərət/", PartOfSpeech: "adjective", Definition: "relating to a large company", Vietnamese: "thuộc công ty, doanh nghiệp", ExampleEn: "He works in corporate finance.", ExampleVi: "Anh ấy làm trong lĩnh vực tài chính doanh nghiệp."},
		{LessonID: lessons[4].ID, Word: "deadline", Phonetic: "/ˈdedlaɪn/", PartOfSpeech: "noun", Definition: "the latest time or date to complete something", Vietnamese: "hạn chót", ExampleEn: "The deadline is Friday at 5 PM.", ExampleVi: "Hạn chót là thứ Sáu lúc 5 giờ chiều."},
	}
	db.Create(&vocabularies)

	// ─── TOPICS ─────────────────────────────────────────────────
	topics := []models.Topic{
		{Title: "Dislikes", Description: "Bày tỏ sự không thích bằng Tiếng Anh với cấu trúc đơn giản, áp dụng mọi hoàn cảnh trong cuộc sống", Icon: "😤", Color: "#f59e0b", TotalWords: 45},
		{Title: "Từ Vựng", Description: "Luyện tập từ vựng theo Chủ Đề và phương pháp lặp từ ngữ cảnh", Icon: "📚", Color: "#3b82f6", TotalWords: 120},
		{Title: "Giao tiếp hàng ngày", Description: "Các mẫu câu giao tiếp cơ bản trong cuộc sống hàng ngày", Icon: "💬", Color: "#10b981", TotalWords: 80},
		{Title: "Công việc - Văn phòng", Description: "Từ vựng và cụm từ thông dụng trong môi trường làm việc", Icon: "💼", Color: "#6366f1", TotalWords: 95},
		{Title: "Du lịch", Description: "Từ vựng hữu ích khi đi du lịch trong và ngoài nước", Icon: "✈️", Color: "#ec4899", TotalWords: 60},
		{Title: "Công nghệ", Description: "Từ vựng về công nghệ, máy tính và internet", Icon: "💻", Color: "#14b8a6", TotalWords: 75},
	}
	db.Create(&topics)

	log.Println("Courses, lessons, vocabulary, topics seeded successfully!")
}
