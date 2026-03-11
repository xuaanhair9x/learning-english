package database

import (
	"log"

	"learn-english-backend/internal/models"

	"gorm.io/gorm"
)

func SeedSentences(db *gorm.DB) {
	var count int64
	db.Model(&models.Sentence{}).Count(&count)
	if count > 0 {
		log.Println("Sentences already seeded, skipping...")
		return
	}

	log.Println("Seeding sentences...")

	sentences := []models.Sentence{
		{Content: "I go to work at 8 a.m.", Vietnamese: "Tôi đi làm lúc 8 giờ sáng.", Level: "basic", Topic: "daily", Order: 1},
		{Content: "She drinks coffee to stay awake.", Vietnamese: "Cô ấy uống cà phê để tỉnh táo.", Level: "basic", Topic: "daily", Order: 2},
		{Content: "He reads books almost every day.", Vietnamese: "Anh ấy đọc sách gần như mỗi ngày.", Level: "basic", Topic: "daily", Order: 3},
		{Content: "We all need to communicate with others.", Vietnamese: "Tất cả chúng ta đều cần giao tiếp với người khác.", Level: "basic", Topic: "daily", Order: 4},
		{Content: "I check my phone every morning.", Vietnamese: "Tôi kiểm tra điện thoại mỗi buổi sáng.", Level: "basic", Topic: "daily", Order: 5},
		{Content: "He likes to watch sports on TV.", Vietnamese: "Anh ấy thích xem thể thao trên tivi.", Level: "basic", Topic: "daily", Order: 6},
		{Content: "I'd drive her to work to save time.", Vietnamese: "Tôi sẽ đưa cô ấy đến chỗ làm để tiết kiệm thời gian.", Level: "basic", Topic: "daily", Order: 7},
		{Content: "They enjoyed their vacation together.", Vietnamese: "Họ đã tận hưởng kỳ nghỉ cùng nhau.", Level: "basic", Topic: "daily", Order: 8},
		{Content: "It is better to arrive early than late.", Vietnamese: "Đến sớm còn hơn là đến muộn.", Level: "basic", Topic: "daily", Order: 9},
		{Content: "You should make a list before shopping.", Vietnamese: "Bạn nên lập danh sách trước khi đi mua sắm.", Level: "basic", Topic: "daily", Order: 10},
		{Content: "She listens to music to relax.", Vietnamese: "Cô ấy nghe nhạc để thư giãn.", Level: "basic", Topic: "daily", Order: 11},
		{Content: "I call my parents every weekend.", Vietnamese: "Tôi gọi điện cho bố mẹ mỗi cuối tuần.", Level: "basic", Topic: "daily", Order: 12},
		{Content: "The meeting was postponed until next Monday.", Vietnamese: "Cuộc họp đã bị hoãn đến thứ Hai tuần sau.", Level: "intermediate", Topic: "business", Order: 13},
		{Content: "We go shopping on Sundays.", Vietnamese: "Chúng tôi đi mua sắm vào các ngày Chủ Nhật.", Level: "basic", Topic: "daily", Order: 14},
		{Content: "I cook dinner for my family.", Vietnamese: "Tôi nấu bữa tối cho gia đình.", Level: "basic", Topic: "daily", Order: 15},
		{Content: "He always comes home before midnight.", Vietnamese: "Anh ấy luôn về nhà trước nửa đêm.", Level: "basic", Topic: "daily", Order: 16},
		{Content: "I use my laptop for work.", Vietnamese: "Tôi dùng laptop để làm việc.", Level: "basic", Topic: "daily", Order: 17},
		{Content: "I often play football with my friends on weekends.", Vietnamese: "Tôi thường chơi bóng đá với bạn bè vào cuối tuần.", Level: "basic", Topic: "daily", Order: 18},
		{Content: "I read the news to stay informed every day.", Vietnamese: "Tôi đọc tin tức để cập nhật thông tin mỗi ngày.", Level: "basic", Topic: "daily", Order: 19},
		{Content: "She writes emails to her manager.", Vietnamese: "Cô ấy viết email cho quản lý của mình.", Level: "intermediate", Topic: "business", Order: 20},
		{Content: "The conference will be held in the main hall.", Vietnamese: "Hội nghị sẽ được tổ chức tại hội trường chính.", Level: "intermediate", Topic: "business", Order: 21},
		{Content: "Could you please send me the report by Friday?", Vietnamese: "Bạn có thể gửi cho tôi báo cáo trước thứ Sáu không?", Level: "intermediate", Topic: "business", Order: 22},
		{Content: "I would like to book a flight to Tokyo.", Vietnamese: "Tôi muốn đặt vé máy bay đến Tokyo.", Level: "intermediate", Topic: "travel", Order: 23},
		{Content: "The airport is about thirty minutes from here.", Vietnamese: "Sân bay cách đây khoảng ba mươi phút.", Level: "intermediate", Topic: "travel", Order: 24},
		{Content: "Technology has changed the way we communicate.", Vietnamese: "Công nghệ đã thay đổi cách chúng ta giao tiếp.", Level: "advanced", Topic: "technology", Order: 25},
	}
	db.Create(&sentences)
	log.Println("Sentences seeded successfully!")
}
