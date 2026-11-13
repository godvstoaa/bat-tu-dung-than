// Tạo giọng lồng tiếng cho từng cảnh bằng edge-tts, ghi thời lượng ra public/vo/durations.json.
// Chạy trong video-studio:  node scripts/voiceover.mjs  [VOICE=vi-VN-HoaiMyNeural]
import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync, statSync, writeFileSync} from 'node:fs';

export const LINES = [
	'Bát Tự Dụng Thần. Luận mệnh Tử Bình, phong thủy huyền học phương Đông.',
	'Trọn bộ Ngũ Thuật: Mệnh, Bốc, Tướng, Sơn, Trạch Nhật, gói gọn trong một ứng dụng.',
	'Chỉ cần nhập ngày giờ sinh. App tự đổi âm lịch, tiết khí, và giờ mặt trời thật theo nơi sinh.',
	'Lá số Tứ Trụ hiện ra trong tích tắc: can chi, tàng can, nạp âm, thập thần, và cách cục theo Tử Bình chính thống.',
	'Ngũ hành vượng suy tính theo tỉ lệ thật. Định đủ bốn tầng Dụng, Hỷ, Kỵ, Thù, cùng đại vận, lưu niên, và vận từng ngày.',
	'Mọi lời luận bám sát một nghìn năm trăm hai mươi ba bộ kinh điển cổ, một trăm tám mươi hai module engine, và thầy AI giải đáp mọi câu hỏi.',
	'Và hơn thế nữa: Huyền Quán Online, thế giới ba chiều để bạn sống cùng lá số của mình.',
	'Bát tự của bạn quyết định phẩm phục. Dụng thần là màu áo, Hỷ thần là màu đai.',
	'Bước vào sân Đạo quán: lư hương, đèn đá, hoa đào, ngày đêm theo giờ thật.',
	'Giải án, xem nhà, gieo quẻ. Mọi việc đều chạy bằng engine luận giải thật.',
	'Gặp gỡ đạo hữu khắp nơi, cùng vào điện, cùng giải án.',
	'Bát Tự Dụng Thần, và Huyền Quán Online. Hiểu mệnh, để cải vận.',
];

const voice = process.env.VOICE || 'vi-VN-NamMinhNeural';
mkdirSync('public/vo', {recursive: true});
const durations = [];
LINES.forEach((text, i) => {
	const file = `public/vo/vo-${String(i).padStart(2, '0')}.mp3`;
	const done = existsSync(file) && statSync(file).size > 1000; // chạy tiếp được
	for (let k = 1; !done; k++) {
		try {
			execFileSync('python', ['-m', 'edge_tts', '--voice', voice, '--text', text, '--write-media', file], {stdio: 'pipe'});
			execFileSync('powershell', ['-NoProfile', '-Command', 'Start-Sleep -Seconds 5']);
			break;
		} catch (e) {
			if (k >= 20) throw e;
			console.log(`  thử lại ${k} (mạng)…`);
			execFileSync('powershell', ['-NoProfile', '-Command', `Start-Sleep -Seconds ${Math.min(30 * k, 180)}`]);
		}
	}
	const d = parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).toString());
	durations.push(d);
	console.log(i, d.toFixed(2) + 's', text);
});
writeFileSync('public/vo/durations.json', JSON.stringify({voice, durations}, null, 2));
