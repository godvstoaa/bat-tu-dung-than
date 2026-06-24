// ============================================================================
//  TU DƯỠNG PHÁP MÔN 修行法门 — SPIRITUAL PRACTICES BY ELEMENT
//  Mỗi ngũ hành → pháp tu cụ thể (thiền/khí công/niệm/xã lợi/văn hóa).
//  Kết hợp 道家内丹 + 佛家禅修 + 儒家修身 + 中医养神.
//  Nguồn: 黄帝内经 上古天真, 道德经, 六祖坛经, 周易 参同契.
// ============================================================================
import { WX_VI } from './constants.js';

const WX_PRACTICES = {
  木: {
    primary: 'Thiền hành (walking meditation) trong rừng/công viên',
    meditation: 'thiền quán hơi thở — tập trung gan, cảm nhận sinh khí vạn vật đâm chồi',
    qigong: 'Bát Duan Cân ("Lưỡng thủ thác thiên lý tam tiêu" — giơ hai tay trời), Dịch Cân Kinh (kéo giãn gân cốt)',
    chanting: 'niệm "A Di Đà Phật" hoặc "Om" (âm A = Mộc sinh khí), đọc Kinh Địa Tạng (sinh khí từ đất)',
    charity: 'trồng cây, bảo vệ thiên nhiên, từ thiện môi trường, nuôi dưỡng sinh linh',
    virtue: 'nhân từ (仁) — yêu thương vạn vật, tha thứ, không nóng giận',
    ritual: 'mở cửa sổ sáng sớm hít khí Mộc; chàu cây xanh; giã từ oán hận',
    time: 'sáng 5-7h (Mão — Mộc vượng) — khí Mộc thịnh, sinh khí mạnh',
    organ: 'Gan — khởi động từ cơn giận, chuyển hóa thành từ bi',
  },
  火: {
    primary: 'Thiền minh (light meditation) + cúng dường',
    meditation: 'quán ánh sáng tim — nhìn ngọn nến/đèn, cảm nhận ấm áp lan tỏa',
    qigong: 'Lục Tự Quyết (xuất "Hư" — âm Hỏa phát tâm), Thái Cực Quyền (động tác mở rộng, vươn tay)',
    chanting: 'niệm "Quán Thế Âm Bồ Tát" (từ bi hỏa), chú Đại Bi, đọc Kinh Pháp Hoa',
    charity: 'thắp đèn cúng dường (chùa/phật), giúp người nghèo mùa đông, truyền cảm hứng',
    virtue: 'lễ nghĩa (礼) — tôn trọng, lễ độ, khiêm cung',
    ritual: 'thắp nến/hương trầm chiều; cầu nguyện trước đèn; truyền lửa ấm cho người',
    time: 'trưa 11-13h (Ngọ — Hỏa vượng) — dương khí đỉnh, hoặc tối 19-21h (thắp đèn)',
    organ: 'Tim — mở tim, giảm lo âu, tăng vui vẻ/nhẫn nhịn',
  },
  土: {
    primary: 'Thiền tọa (sitting meditation) + kết nối đất',
    meditation: 'thiền tọa trên đất (không đệm cách điện), quán heavy ở bụng dưới (đan điền)',
    qigong: 'Khí công dưỡng sinh (chậm, ổn), Bát Duan Cân ("Lý tỳ vị cửu" — nâng tỳ vị), thở bụng',
    chanting: 'niệm "Địa Tạng Vương Bồ Tát" (đại địa), chú Lăng Nghiêm, đọc Kinh Địa Tạng',
    charity: 'bố thí thức ăn, xây chùa/trường, làm việc công ích, ổn định cộng đồng',
    virtue: 'tín thực (信) — giữ lời hứa, thành thật, đáng tin',
    ritual: 'đi chân đất buổi sáng; quỳ lạy đất/trời; châm đất/nhà mới',
    time: '7-9h sáng (Thìn) hoặc 15-17h chiều (Thân) — Thổ khí ổn định',
    organ: 'Tỳ — ổn định tâm, giảm lo nghĩ, nuôi dưỡng ý chí',
  },
  金: {
    primary: 'Khí công phế (breathwork) + kỷ luật thiền',
    meditation: 'thiền hơi thở (anapana) — tập trung luồng không khí vào-ra phổi',
    qigong: 'Lục Tự Quyết (xuất "Tỳ" — âm Kim thanh phế), Dịch Cân Kinh (sắc bén, dứt khoát)',
    chanting: 'niệm "Dược Sư Phật" (thanh khiết), chú Dược Sư, đọc Kinh Kim Cang (sắc bén)',
    charity: 'giúp người bệnh (y từ thiện), bảo vệ nghĩa trang, viếng người già/những người đã khuất',
    virtue: 'nghĩa khí (义) — chính nghĩa, công bằng, liêm khiết',
    ritual: 'sáng sớm 5h đứng trước cửa hít khí trong; thổi chuông đồng/thiết; dọn sạch phòng',
    time: '3-5h sáng (Dần) hoặc 5-7h (Mão) — Kim khí thanh khiết sáng sớm',
    organ: 'Phổi — buông bỏ bi ai, mạnh ý chí, sạch trong ngoài',
  },
  水: {
    primary: 'Thiền nước (flowing meditation) + thâm sâu',
    meditation: 'thiền sâu (vippassana) — chìm sâu vào nội tâm, cảm nhận như nước chảy',
    qigong: 'Lục Tự Quyết (xuất "Xuy" — âm Thủy dưỡng thận), nội đan (tu luyện đan điền sâu)',
    chanting: 'niệm "Chuẩn Đề Bồ Tát" (sâu kín), chú Chuẩn Đề, đọc Kinh Lăng Già (sâu)',
    charity: 'giúp người yếu thế/âm thầm (tích âm đức), viện mồ côi, thả sinh (phóng sinh)',
    virtue: 'trí tuệ (智) — sâu sắc, linh hoạt, thấu hiểu nhân quả',
    ritual: 'ngâm chân nước ấm tối; ngồi cạnh suối/biển; viết sớ mệnh (giao vật âm dương)',
    time: 'tối 21-23h (Hải) hoặc 23-1h (Tý) — Thủy khí tĩnh, sâu lắng',
    organ: 'Thận — vượt sợ hãi, tăng sinh lực bản nguyên, nuôi tủy',
  },
};

/**
 * @returns {{ dungPractice, dungMeditation, dungQigong, dungChanting,
 *            dungCharity, dungVirtue, dungRitual, dungTime, dungOrgan, advice }}
 */
export function spiritualPractice(R) {
  const dungWx = R.yong.primary;
  const xiWx = R.yong.xi;
  const kyWx = R.yong.ji;
  const dmWx = R.chart.dayMaster.wx;

  const dung = WX_PRACTICES[dungWx];
  const xi = WX_PRACTICES[xiWx];

  const advice = `Tu Dụng Thần (${WX_VI[dungWx]}): ${dung.primary}. ` +
    `${dung.meditation}. Khí công: ${dung.qigong}. ` +
    `Niệm: ${dung.chanting}. Xã lợi: ${dung.charity}. ` +
    `Đức: ${dung.virtue}. Thời: ${dung.time}.`;

  return {
    dmWx, dmVi: WX_VI[dmWx], dungWx, dungVi: WX_VI[dungWx],
    dungPractice: dung.primary, dungMeditation: dung.meditation,
    dungQigong: dung.qigong, dungChanting: dung.chanting,
    dungCharity: dung.charity, dungVirtue: dung.virtue,
    dungRitual: dung.ritual, dungTime: dung.time, dungOrgan: dung.organ,
    xiPractice: xi.primary, xiVi: WX_VI[xiWx],
    advice, allPractices: WX_PRACTICES,
  };
}

export { WX_PRACTICES };
