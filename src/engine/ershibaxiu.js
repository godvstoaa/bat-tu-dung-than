// ============================================================================
//  NHỊ THẬP BÁT TÚ 二十八宿 (28 lunar mansions — 通胜 daily 值宿)
//  Mỗi ngày có 1 túc trực (28 ngày tuần hoàn). Mỗi túc: phương/thú + cát/hung +
//  宜/忌 + bài ca cổ (getXiuSong từ lunar-javascript). Nguồn: 通胜/百度百科.
// ============================================================================
import { Solar } from 'lunar-javascript';

// 28 túc: vi + thú (4 tượng) + tone + 宜/忌 ngắn
export const XIU_TABLE = {
  角: { vi: 'Giác', beast: 'Thanh Long (Đông)', tone: 'cat', yi: 'lập wedding, tạo tác, nhập trạch', ji: 'an táng' },
  亢: { vi: 'Cang', beast: 'Thanh Long (Đông)', tone: 'hung', yi: 'gieo trồng', ji: 'wedding, tạo tác, an táng' },
  氐: { vi: 'Đê', beast: 'Thanh Long (Đông)', tone: 'hung', yi: 'gieo trồng', ji: 'wedding, an táng' },
  房: { vi: 'Phòng', beast: 'Thanh Long (Đông)', tone: 'cat', yi: 'wedding, tạo tác, tế tự', ji: 'an táng' },
  心: { vi: 'Tâm', beast: 'Thanh Long (Đông)', tone: 'hung', yi: 'tế tự,祈福', ji: 'wedding, an táng' },
  尾: { vi: 'Vĩ', beast: 'Thanh Long (Đông)', tone: 'cat', yi: 'wedding, tạo tác', ji: 'an táng' },
  箕: { vi: 'Cơ', beast: 'Thanh Long (Đông)', tone: 'cat', yi: 'tạo thương, đào giếng', ji: 'an táng, wedding' },
  斗: { vi: 'Đẩu', beast: 'Huyền Vũ (Bắc)', tone: 'cat', yi: 'tạo tác, đào giếng', ji: 'an táng' },
  牛: { vi: 'Ngưu', beast: 'Huyền Vũ (Bắc)', tone: 'hung', yi: 'tế tự', ji: 'tạo tác, wedding' },
  女: { vi: 'Nữ', beast: 'Huyền Vũ (Bắc)', tone: 'cat', yi: 'wedding, tạo tác', ji: 'an táng' },
  虚: { vi: 'Hư', beast: 'Huyền Vũ (Bắc)', tone: 'hung', yi: 'tế tự', ji: 'wedding, tạo tác, an táng' },
  危: { vi: 'Nguy', beast: 'Huyền Vũ (Bắc)', tone: 'hung', yi: 'tế tự', ji: 'xuất hành, tạo tác' },
  室: { vi: 'Thất', beast: 'Huyền Vũ (Bắc)', tone: 'cat', yi: 'wedding, tạo tác, tế tự', ji: 'an táng' },
  壁: { vi: 'Bích', beast: 'Huyền Vũ (Bắc)', tone: 'cat', yi: 'wedding, tạo tác', ji: 'an táng' },
  奎: { vi: 'Khuê', beast: 'Bạch Hổ (Tây)', tone: 'cat', yi: 'wedding, tạo tác, xuất hành', ji: 'an táng' },
  娄: { vi: 'Lâu', beast: 'Bạch Hổ (Tây)', tone: 'cat', yi: 'wedding, tạo tác', ji: 'an táng' },
  胃: { vi: 'Vị', beast: 'Bạch Hổ (Tây)', tone: 'hung', yi: 'tế tự, tạo tác', ji: 'wedding, an táng' },
  昴: { vi: 'Mão', beast: 'Bạch Hổ (Tây)', tone: 'cat', yi: 'wedding, tạo tác', ji: 'an táng' },
  毕: { vi: 'Tất', beast: 'Bạch Hổ (Tây)', tone: 'cat', yi: 'wedding, tạo tác, tế tự', ji: 'an táng' },
  觜: { vi: 'Chu', beast: 'Bạch Hổ (Tây)', tone: 'hung', yi: 'tế tự', ji: 'wedding, tạo tác' },
  参: { vi: 'Sâm', beast: 'Bạch Hổ (Tây)', tone: 'cat', yi: 'wedding, tạo tác', ji: 'an táng' },
  井: { vi: 'Tỉnh', beast: 'Chu Tước (Nam)', tone: 'cat', yi: 'wedding, tạo tác, tế tự', ji: 'an táng' },
  鬼: { vi: 'Quỷ', beast: 'Chu Tước (Nam)', tone: 'hung', yi: 'tế tự', ji: 'wedding, tạo tác, an táng' },
  柳: { vi: 'Liễu', beast: 'Chu Tước (Nam)', tone: 'hung', yi: 'tế tự', ji: 'wedding, an táng' },
  星: { vi: 'Tinh', beast: 'Chu Tước (Nam)', tone: 'cat', yi: 'tạo新房, tiến chức', ji: 'an táng, phóng thuỷ' },
  张: { vi: 'Trương', beast: 'Chu Tước (Nam)', tone: 'cat', yi: 'wedding, tạo tác', ji: 'an táng' },
  翼: { vi: 'Dực', beast: 'Chu Tước (Nam)', tone: 'hung', yi: 'tế tự', ji: 'wedding, tạo tác' },
  轸: { vi: 'Chẩn', beast: 'Chu Tước (Nam)', tone: 'cat', yi: 'wedding, tạo tác, tế tự', ji: 'an táng' },
};

/**
 * @returns {{ solar, xiu, vi, beast, zheng, animal, tone, yi, ji, song, advice }}
 */
export function xiuDay(year, month, day) {
  const solar = Solar.fromYmdHms(year, month, day, 12, 0, 0);
  const lunar = solar.getLunar();
  const xiu = lunar.getXiu();
  const song = lunar.getXiuSong() || '';
  const info = XIU_TABLE[xiu] || { vi: xiu, beast: '?', tone: 'mid', yi: '(xem bài ca)', ji: '(xem bài ca)' };
  const advice = info.tone === 'cat'
    ? `Túc ${xiu} (${info.vi}) — cát túc ${info.beast}: 宜 ${info.yi}; kỵ ${info.ji}.`
    : info.tone === 'hung'
      ? `Túc ${xiu} (${info.vi}) — hung túc ${info.beast}: kỵ ${info.ji}; chỉ nên ${info.yi}.`
      : `Túc ${xiu} (${info.vi}) — trung.`;
  return {
    solar: solar.toYmd(), xiu, vi: info.vi, beast: info.beast,
    zheng: lunar.getZheng(), animal: lunar.getAnimal(),
    tone: info.tone, yi: info.yi, ji: info.ji, song, advice,
  };
}
