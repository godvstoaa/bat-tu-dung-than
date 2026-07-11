# Phân tích lỗi AI — 7 loại + fix status

## Lỗi đã phát hiện (từ user feedback thực tế):

### L1. BỎ SÓT TÀNG CAN (nghiêm trọng)
- **Biểu hiện**: AI nói "Ấn mỏng" khi Đinh (Chính Ấn) ở 3/4 trụ (gồm tàng can Ngọ).
- **Root cause**: AI chỉ đọc lộ can, không đếm tàng can trong địa chi.
- **Fix**: ✅ THẬP THẦN ĐẾM pre-compute trong brief (commit 77abd3d) + SYSTEM_PROMPT 17A.
- **Rủi ro còn**: tàng can INTERACTIONS (vd: 2 tàng can hợp nhau) chưa pre-compute.

### L2. QUÁ NẶNG 1 HÀNH (tunnel vision)
- **Biểu hiện**: AI nói "cứng, góc cạnh" (Thổ vượng) nhưng bỏ quên Hỏa (Đinh) định hình vẻ dịu dàng.
- **Root cause**: AI chỉ nhìn hành dominant ( highest %), bỏ sót các hành khác có impact lớn (vd Hỏa cho ngoại hình).
- **Fix**: ✅ SYSTEM_PROMPT 17B — xét TẤT CẢ ngũ hành khi luận ngoại hình/tính cách.
- **Rủi ro còn**: brief chỉ show % ngũ hành, không FLAG "hành nào định hình ngoại hình/tính cách/sức khỏe" — AI phải tự kết nối.

### L3. BỎ SÓT TỔ HỢP KINH ĐIỂN
- **Biểu hiện**: AI nói "Thương Quan khắc Quan → khó lấy bằng" nhưng BỎ SÓT "Thương Quan phối Ấn = học vấn cao".
- **Root cause**: AI phân tích từng sao RIÊNG LẺ, không check tổ hợp cổ điển.
- **Fix**: ✅ SYSTEM_PROMPT 17C — kiểm tra tổ hợp kinh điển trước khi kết luận.
- **Rủi ro còn**: brief có PATTERN_DEEP/CHENG_BAI data nhưng KHÔNG DETECT tự động cho từng lá số — AI phải tự identify.

### L4. TỰ ĐỘNG XIN LỖI (sycophancy)
- **Biểu hiện**: Khi user vặn → AI xin lỗi ngay, kể cả khi AI đang ĐÚNG.
- **Root cause**: Model training bias (helpful/polite) + thiếu directive defend.
- **Fix**: ✅ SYSTEM_PROMPT 17E — kiểm tra data trước, DEFEND nếu đúng.
- **Rủi ro còn**: systemic model behavior, prompt không đảm bảo 100%.

### L5. KẾT LUẬN KHÔNG NEO DATA
- **Biểu hiện**: AI nói "Ấn mỏng" mà không nói dựa vào đâu (trụ nào? lộ hay tàng?).
- **Fix**: ✅ SYSTEM_PROMPT 17D — mọi kết luận NEO vào data cụ thể.
- **Rủi ro còn**: AI có thể vẫn nói chung nếu brief không đủ structured.

### L6. DỤNG THẦN LUẬN SAI CƠ SỞ (chưa gặp nhưng risk cao)
- **Biểu hiện (dự đoán)**: AI luận "thân nhược cần Ấn" nhưng thực ra Dụng Thần là 调候 (cần Hỏa vì mùa đông hàn) → override Phù Ức.
- **Root cause**: AI không đọc override flags (调候/从格/病药) trong brief.
- **Fix**: ✅ Đã có SYSTEM_PROMPT point 15 (Dụng thần cơ sở). NHƯNG cần verify AI thực sự đọc.
- **Rủi ro còn**: 3 loại override (调候/从格/病药) cần AI hiểu priority.

### L7. TIMING SAI (đại vận/lưu niên)
- **Biểu hiện (dự đoán)**: AI nói "năm nay tốt" nhưng đại vận hiện tại là Kỵ → sai.
- **Root cause**: AI không đọc đúng đại vận/lưu niên hiện tại trong brief.
- **Fix**: ✅ Đã có SYSTEM_PROMPT point 8 (năm/tháng hiện tại) + point 13 (timing data).
- **Rủi ro còn**: nhiều tầng timing (đại vận + lưu niên + lưu nguyệt) → AI dễ nhầm.

## Priority fix tiếp theo:
1. DETECT tổ hợp kinh điển TỰ ĐỘNG trong brief (Thương Quan phối Ấn / Sát Ấn tương sinh...) → pre-compute như THẬP THẦN ĐẾM.
2. FLAG "hành nào định hình ngoại hình" trong brief (Mộc=cao, Hỏa=sáng, Thổ=chắc, Kim=thanh, Thủy=uyen chuyển).
3. Error logging (xem phần 2).
