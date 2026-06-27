// ============================================================================
//  DAILY PHƯƠNG VỊ 方位 — Toàn bộ daily deity directions + đối chiếu Dụng Thần
//  财神/喜神/福神/阳贵 → hôm nay hướng nào tốt cho việc gì.
//  + hướng Dụng Thần cá nhân → tổng hợp "hướng tốt nhất hôm nay cho bạn".
//  Nguồn: 通胜 方位, 协纪辨方.
// ============================================================================
import { Solar } from 'lunar-javascript';

// Hướng Dụng Thần theo ngũ hành. [cycle 46 sửa C4] mỗi hành có thể NHIỀU hướng → dùng MẢNG
//   (trước đây là chuỗi "Đông, Đông Nam" → so `===` từng hướng không bao giờ khớp → bestDirection
//    rơi về mostCommon, cho user Dụng Thổ hay ra "Bắc" = hướng 三煞 năm → mâu thuẫn).
// [loop 555 FIX] Thổ bỏ «Trung cung» (không phải hướng 8-phương có thể «đi/hướng về») —
//   đồng bộ space-fs.js loop 31. Trước đây leak «Trung cung» vào userDungDir hiển thị.
const WX_DIR = { 木: ['Đông', 'Đông Nam'], 火: ['Nam'], 土: ['Đông Bắc', 'Tây Nam'], 金: ['Tây', 'Tây Bắc'], 水: ['Bắc'] };

const DIR_VI = {
  '正北': 'Bắc', '正南': 'Nam', '正东': 'Đông', '正西': 'Tây',
  '东北': 'Đông Bắc', '东南': 'Đông Nam', '西北': 'Tây Bắc', '西南': 'Tây Nam',
  '中宫': 'Trung cung',
};

/**
 * @returns {{ date, directions:{caiShen,xiShen,fuShen,yangGui}, userDungDir,
 *            bestDirection, advice }}
 */
export function dailyDirections(year, month, day, userYong) {
  const lunar = Solar.fromYmdHms(year, month, day, 12, 0, 0).getLunar();

  const get = (m) => { try { return DIR_VI[lunar[m]()] || lunar[m](); } catch (e) { return '?'; } };
  const directions = {
    caiShen: get('getDayPositionCaiDesc'),   // 财神
    xiShen: get('getDayPositionXiDesc'),       // 喜神
    fuShen: get('getDayPositionFuDesc'),       // 福神
    yangGui: get('getDayPositionYangGuiDesc'), // 阳贵
  };

  // Hướng Dụng Thần cá nhân (mảng cho matching + chuỗi join cho hiển thị)
  const dungDirs = userYong ? (WX_DIR[userYong] || []) : [];
  const userDungDir = dungDirs.length ? dungDirs.join(', ') : '?';

  // Tổng hợp: hướng nào trùng nhau → tốt nhất
  const allDirs = Object.values(directions).filter((d) => d && d !== '?');
  const dirCount = {};
  allDirs.forEach((d) => { dirCount[d] = (dirCount[d] || 0) + 1; });
  const sortedDirs = Object.entries(dirCount).sort((a, b) => b[1] - a[1]);
  const mostCommon = sortedDirs[0]?.[0] || '?';

  // Best: trùng Dụng Thần + trùng deity → tối ưu (dùng mảng .includes thay vì === chuỗi)
  const matchingDung = allDirs.filter((d) => dungDirs.includes(d));
  let bestDirection;
  if (matchingDung.length >= 1) {
    // trong các hướng Dụng trùng deity, lấy hướng phổ biến nhất
    const mc = {}; matchingDung.forEach((d) => { mc[d] = (mc[d] || 0) + 1; });
    bestDirection = Object.entries(mc).sort((a, b) => b[1] - a[1])[0][0];
  } else {
    bestDirection = mostCommon;
  }

  const advice = [
    `💰 Cầu tài/hợp đồng: hướng **${directions.caiShen}** (财神).`,
    `💕 Hẹn hò/cưới hỏi: hướng **${directions.xiShen}** (喜神).`,
    `🙏 Cầu phúc/tế tự: hướng **${directions.fuShen}** (福神).`,
    `🤝 Gặp quý nhân/cấp trên: hướng **${directions.yangGui}** (阳贵).`,
    userYong ? `⭐ Hướng Dụng Thần cá nhân: **${userDungDir}** (hành ${userYong}).` : '',
    `🏆 Hướng TỐT NHẤT hôm nay (cho bạn): **${bestDirection}**${matchingDung.length >= 1 ? ' (trùng Dụng Thần + deity!)' : ' (phổ biến nhất).'}`,
  ].filter(Boolean);

  return { date: `${year}-${month}-${day}`, directions, userDungDir, bestDirection, advice };
}

export { DIR_VI };
