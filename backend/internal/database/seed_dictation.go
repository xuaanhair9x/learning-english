package database

import (
	"log"

	"learn-english-backend/internal/models"

	"gorm.io/gorm"
)

func SeedDictation(db *gorm.DB) {
	var count int64
	db.Model(&models.DictationCollection{}).Count(&count)
	if count > 0 {
		log.Println("Dictation data already seeded, skipping...")
		return
	}

	log.Println("Seeding dictation data...")

	// ─── COLLECTIONS ─────────────────────────────────────────────
	collections := []models.DictationCollection{
		{Title: "Short Stories", Description: "Nghe và điền từ vào chỗ trống qua các câu chuyện ngắn thú vị", Icon: "📖", Color: "#3b82f6", Order: 1},
		{Title: "Conversations", Description: "Luyện nghe các đoạn hội thoại thực tế hàng ngày", Icon: "💬", Color: "#8b5cf6", Order: 2},
	}
	db.Create(&collections)

	// ─── PASSAGES ────────────────────────────────────────────────
	passages := []models.DictationPassage{
		// Short Stories passages
		{CollectionID: collections[0].ID, Title: "Christmas Eve", Duration: "5 Phút", TotalSentences: 5, Order: 1},
		{CollectionID: collections[0].ID, Title: "Gardening Apprentice", Duration: "6 Phút", TotalSentences: 6, Order: 2},
		{CollectionID: collections[0].ID, Title: "The New Job", Duration: "5 Phút", TotalSentences: 5, Order: 3},
		{CollectionID: collections[0].ID, Title: "A Rainy Day", Duration: "4 Phút", TotalSentences: 4, Order: 4},
		// Conversations passages
		{CollectionID: collections[1].ID, Title: "At the Coffee Shop", Duration: "4 Phút", TotalSentences: 4, Order: 1},
		{CollectionID: collections[1].ID, Title: "Making Plans", Duration: "5 Phút", TotalSentences: 5, Order: 2},
	}
	db.Create(&passages)

	// helper
	p := func(i int) uint { return passages[i].ID }

	// ─── EXERCISES ───────────────────────────────────────────────
	exercises := []models.DictationExercise{
		// Christmas Eve (passage 0)
		{PassageID: p(0), Sentence: "Ben and Melissa are getting ready for Christmas.", BeforeBlank: "Ben and Melissa are", AfterBlank: "for Christmas.", Answer: "getting ready", Vietnamese: "Ben và Melissa đang chuẩn bị đón lễ Giáng sinh.", Distractors: "making plans,getting better,feeling happy,getting ready", Order: 1},
		{PassageID: p(0), Sentence: "They are decorating the house with lights and ornaments.", BeforeBlank: "They are decorating the house with", AfterBlank: ".", Answer: "lights and ornaments", Vietnamese: "Họ đang trang trí nhà với đèn và đồ trang sức.", Distractors: "candles and stars,flowers and trees,lights and ornaments,ribbons and bows", Order: 2},
		{PassageID: p(0), Sentence: "Their children are excited about opening presents.", BeforeBlank: "Their children are", AfterBlank: "about opening presents.", Answer: "excited", Vietnamese: "Các con họ rất phấn khích về việc mở quà.", Distractors: "worried,excited,confused,disappointed", Order: 3},
		{PassageID: p(0), Sentence: "Melissa baked delicious cookies for the whole family.", BeforeBlank: "Melissa baked delicious cookies for", AfterBlank: ".", Answer: "the whole family", Vietnamese: "Melissa đã nướng bánh quy ngon cho cả gia đình.", Distractors: "her friends,the neighbors,the whole family,her coworkers", Order: 4},
		{PassageID: p(0), Sentence: "It was the most wonderful time of the year.", BeforeBlank: "It was the most wonderful", AfterBlank: "of the year.", Answer: "time", Vietnamese: "Đó là khoảng thời gian tuyệt vời nhất trong năm.", Distractors: "place,moment,time,occasion", Order: 5},

		// Gardening Apprentice (passage 1)
		{PassageID: p(1), Sentence: "Tom decided to start a garden in his backyard.", BeforeBlank: "Tom decided to start a garden in his", AfterBlank: ".", Answer: "backyard", Vietnamese: "Tom quyết định bắt đầu một khu vườn ở sân sau nhà.", Distractors: "garage,backyard,kitchen,bedroom", Order: 1},
		{PassageID: p(1), Sentence: "He planted tomatoes, carrots, and lettuce.", BeforeBlank: "He planted", AfterBlank: ", and lettuce.", Answer: "tomatoes, carrots", Vietnamese: "Anh ấy đã trồng cà chua, cà rốt và xà lách.", Distractors: "apples and pears,tomatoes, carrots,roses and tulips,corn and beans", Order: 2},
		{PassageID: p(1), Sentence: "Every morning, he watered the plants before going to work.", BeforeBlank: "Every morning, he watered the plants before", AfterBlank: ".", Answer: "going to work", Vietnamese: "Mỗi sáng, anh ấy tưới cây trước khi đi làm.", Distractors: "having breakfast,going to work,watching TV,taking a shower", Order: 3},
		{PassageID: p(1), Sentence: "After three months, the vegetables were ready to harvest.", BeforeBlank: "After three months, the vegetables were ready to", AfterBlank: ".", Answer: "harvest", Vietnamese: "Sau ba tháng, rau đã sẵn sàng để thu hoạch.", Distractors: "plant,water,harvest,sell", Order: 4},
		{PassageID: p(1), Sentence: "He shared the vegetables with his neighbors.", BeforeBlank: "He shared the vegetables with his", AfterBlank: ".", Answer: "neighbors", Vietnamese: "Anh ấy chia sẻ rau củ với hàng xóm.", Distractors: "parents,coworkers,friends,neighbors", Order: 5},
		{PassageID: p(1), Sentence: "Gardening became his favorite weekend hobby.", BeforeBlank: "Gardening became his favorite weekend", AfterBlank: ".", Answer: "hobby", Vietnamese: "Làm vườn trở thành sở thích cuối tuần yêu thích của anh ấy.", Distractors: "activity,project,hobby,sport", Order: 6},

		// The New Job (passage 2)
		{PassageID: p(2), Sentence: "Sarah started her new job at a tech company.", BeforeBlank: "Sarah started her new job at a", AfterBlank: ".", Answer: "tech company", Vietnamese: "Sarah bắt đầu công việc mới tại một công ty công nghệ.", Distractors: "law firm,tech company,hospital,bank", Order: 1},
		{PassageID: p(2), Sentence: "She was nervous on her first day.", BeforeBlank: "She was", AfterBlank: "on her first day.", Answer: "nervous", Vietnamese: "Cô ấy cảm thấy hồi hộp vào ngày đầu tiên.", Distractors: "excited,nervous,tired,happy", Order: 2},
		{PassageID: p(2), Sentence: "Her manager gave her a warm welcome.", BeforeBlank: "Her manager gave her a warm", AfterBlank: ".", Answer: "welcome", Vietnamese: "Người quản lý đã chào đón cô ấy nồng nhiệt.", Distractors: "greeting,meeting,welcome,introduction", Order: 3},
		{PassageID: p(2), Sentence: "She learned quickly and impressed everyone.", BeforeBlank: "She learned quickly and", AfterBlank: "everyone.", Answer: "impressed", Vietnamese: "Cô ấy học nhanh và gây ấn tượng với mọi người.", Distractors: "surprised,impressed,confused,helped", Order: 4},
		{PassageID: p(2), Sentence: "By the end of the week, she felt confident.", BeforeBlank: "By the end of the week, she felt", AfterBlank: ".", Answer: "confident", Vietnamese: "Cuối tuần, cô ấy cảm thấy tự tin.", Distractors: "tired,confident,bored,overwhelmed", Order: 5},

		// At the Coffee Shop (passage 4)
		{PassageID: p(4), Sentence: "Can I have a large cappuccino, please?", BeforeBlank: "Can I have a large", AfterBlank: ", please?", Answer: "cappuccino", Vietnamese: "Cho tôi một ly cappuccino cỡ lớn được không?", Distractors: "latte,espresso,cappuccino,mocha", Order: 1},
		{PassageID: p(4), Sentence: "Would you like anything to eat with that?", BeforeBlank: "Would you like anything to", AfterBlank: "with that?", Answer: "eat", Vietnamese: "Bạn có muốn ăn gì theo không?", Distractors: "drink,order,eat,have", Order: 2},
		{PassageID: p(4), Sentence: "I'll take a slice of chocolate cake.", BeforeBlank: "I'll take a slice of chocolate", AfterBlank: ".", Answer: "cake", Vietnamese: "Tôi sẽ lấy một lát bánh sô-cô-la.", Distractors: "pie,bread,cake,muffin", Order: 3},
		{PassageID: p(4), Sentence: "That comes to twelve dollars and fifty cents.", BeforeBlank: "That comes to twelve dollars and fifty", AfterBlank: ".", Answer: "cents", Vietnamese: "Tổng cộng là mười hai đô la và năm mươi xu.", Distractors: "cents,dollars,euros,pounds", Order: 4},

		// Making Plans (passage 5)
		{PassageID: p(5), Sentence: "Are you free this Saturday afternoon?", BeforeBlank: "Are you free this Saturday", AfterBlank: "?", Answer: "afternoon", Vietnamese: "Bạn có rảnh chiều thứ Bảy này không?", Distractors: "morning,evening,afternoon,night", Order: 1},
		{PassageID: p(5), Sentence: "I was thinking we could go to the new museum.", BeforeBlank: "I was thinking we could go to the new", AfterBlank: ".", Answer: "museum", Vietnamese: "Tôi đang nghĩ chúng ta có thể đến bảo tàng mới.", Distractors: "cinema,museum,restaurant,park", Order: 2},
		{PassageID: p(5), Sentence: "That sounds like a great idea!", BeforeBlank: "That sounds like a great", AfterBlank: "!", Answer: "idea", Vietnamese: "Nghe có vẻ là một ý tưởng tuyệt vời!", Distractors: "plan,idea,suggestion,option", Order: 3},
		{PassageID: p(5), Sentence: "Should we invite the others too?", BeforeBlank: "Should we invite the", AfterBlank: "too?", Answer: "others", Vietnamese: "Chúng ta có nên mời những người khác không?", Distractors: "family,others,team,neighbors", Order: 4},
		{PassageID: p(5), Sentence: "Let's meet at the entrance at two o'clock.", BeforeBlank: "Let's meet at the entrance at two", AfterBlank: ".", Answer: "o'clock", Vietnamese: "Hãy gặp nhau ở lối vào lúc hai giờ.", Distractors: "o'clock,in the afternoon,sharp,pm", Order: 5},
	}
	db.Create(&exercises)

	// update TotalSentences
	for _, p := range passages {
		var cnt int64
		db.Model(&models.DictationExercise{}).Where("passage_id = ?", p.ID).Count(&cnt)
		db.Model(&models.DictationPassage{}).Where("id = ?", p.ID).Update("total_sentences", cnt)
	}

	log.Println("Dictation data seeded successfully!")
}
