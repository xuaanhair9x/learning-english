package database

import (
	"log"

	"learn-english-backend/internal/models"

	"gorm.io/gorm"
)

func SeedGrammar(db *gorm.DB) {
	var count int64
	db.Model(&models.GrammarUnit{}).Count(&count)
	if count > 0 {
		return
	}

	log.Println("Seeding Grammar content...")

	units := []models.GrammarUnit{
		{
			Title:       "UNIT 1: GIỚI THIỆU NGỮ PHÁP TRONG ĐIỂM TOEIC",
			Description: "Hoàn thành 0%",
			Order:       1,
			Lessons: []models.GrammarLesson{
				{Title: "Giới thiệu", Type: "theory", Content: "Giới thiệu các điểm ngữ pháp cần lưu ý trong bài thi TOEIC.", Order: 1},
			},
		},
		{
			Title:       "UNIT 2: CÁC THÌ ĐƠN",
			Description: "Hoàn thành 11%",
			Order:       2,
			Lessons: []models.GrammarLesson{
				{Title: "Tổng quan", Type: "theory", Content: "Chủ điểm ngữ pháp đầu tiên VOCA PREP muốn được giới thiệu đến với các bạn chính là các thì trong tiếng Anh (Tenses).\n\n### Để dễ dàng 'thu nạp' VOCA PREP sẽ chia các Thì theo 3 nhóm cơ bản:\n- Các thì đơn (Present Tenses)\n- Các thì tiếp diễn (Continuous Tenses)\n- Các thì hoàn thành (Perfect Tenses)", Order: 1},
				{Title: "Chia thì với động từ Tobe", Type: "theory", Content: "Hướng dẫn chia thì với động từ Tobe ở Hiện tại, Quá khứ, Tương lai.", Order: 2},
				{Title: "Chia thì với động từ Thường", Type: "theory", Content: "Hướng dẫn chia thì với động từ thường ở Hiện tại, Quá khứ, Tương lai.", Order: 3},
				{
					Title:   "Bài tập: Chia động từ trong ngoặc ở thì Hiện tại đơn",
					Type:    "exercise",
					Content: "Chia động từ trong ngoặc đúng dạng. Nhớ để ý số ít số nhiều nhé!",
					Order:   4,
					Exercises: []models.GrammarExercise{
						{Question: "He (be) ___ a student.", CorrectAnswer: "is", Explanation: "Chủ ngữ là 'He' (ngôi thứ ba số ít), động từ tobe ở hiện tại đơn là 'is'.", Order: 1},
						{Question: "They (play) ___ soccer every weekend.", CorrectAnswer: "play", Explanation: "Chủ ngữ là 'They' (ngôi thứ ba số nhiều), động từ thường chia nguyên mẫu.", Order: 2},
						{Question: "My aunt's house (lie) ___ downtown.", CorrectAnswer: "lies", Explanation: "Chủ ngữ là 'My aunt\\'s house' (Danh từ số ít) -> Động từ chia thêm s.", Order: 3},
					},
				},
				{Title: "Kiến thức cần nhớ", Type: "theory", Content: "Tóm gọn lại các quy tắc chia thì cơ bản.", Order: 5},
			},
		},
		{
			Title:       "UNIT 3: BẪY CÁC THÌ ĐƠN",
			Description: "Hoàn thành 0%",
			Order:       3,
			Lessons: []models.GrammarLesson{
				{Title: "Tổng quan", Type: "theory", Content: "Một số bẫy thường gặp về thì đơn trong TOEIC.", Order: 1},
				{Title: "Thì quá khứ đơn: Bẫy 1 - Trạng từ chỉ thời gian", Type: "theory", Content: "Cẩn thận với các trạng từ như yesterday, last week, ago...", Order: 2},
			},
		},
	}

	for _, unit := range units {
		db.Create(&unit)
	}

	log.Println("Grammar content seeded.")
}
