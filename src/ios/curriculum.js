// ============================================================================
//  curriculum.js — lộ trình học; mọi mã phải tồn tại trong DAOZANG id
// ============================================================================
export const PATHS = [
  {
    id: 'daode',
    title: 'Đạo Đức & chú giải',
    steps: [
      'DZ_道德经',
      'DZ_老子河上公章句道德真经注',
      'DZ_老子道德经注王弼本',
      'DZ_道德真经取善集',
    ],
  },
  {
    id: 'neidan',
    title: 'Nội đan căn bản',
    steps: [
      'DZ_紫陽真人悟真篇註疏',
      'DZ_悟真篇註釋',
      'DZ_周易参同契发挥',
      'DZ_周易参同契解',
    ],
  },
  {
    id: 'huangting',
    title: 'Hoàng Đình',
    steps: [
      'DZ_黄庭内景经',
      'DZ_黃庭內景玉經注',
      'DZ_黄庭内景五脏六腑补泻图',
    ],
  },
  {
    id: 'yinfu',
    title: 'Âm Phù kinh',
    steps: [
      'DZ_黄帝阴符经',
      'DZ_黃帝陰符經註張果',
      'DZ_黃帝陰符經集解',
      'DZ_黄帝阴符经解蹇昌辰',
    ],
  },
  {
    id: 'qingjing',
    title: 'Thanh Tĩnh',
    steps: [
      'DZ_太上老君说常清静经注王元晖',
      'DZ_太上老君说常清静经颂注刘通微',
      'DZ_洞玄灵宝定观经',
    ],
  },
  {
    id: 'lingbao',
    title: 'Linh Bảo / Độ Nhân',
    steps: [
      'DZ_度人经元始无量度人上品妙经',
      'DZ_元始无量度人上品妙经四注',
      'DZ_元始無量度人上品妙經通義',
    ],
  },
  {
    id: 'bazi',
    title: 'Mệnh lý tham chiếu',
    steps: [
      'DZ_穷通宝鉴',
      'DZ_三命通会',
      'DZ_渊海子平',
      'DZ_滴天髓',
    ],
  },
  {
    id: 'wuzhen-extra',
    title: 'Ngộ Chân mở rộng',
    steps: [
      'DZ_紫陽真人悟真篇三註',
      'DZ_紫陽真人悟真篇註疏',
      'DZ_悟真篇註釋',
    ],
  },
];

export function resolvePaths(indexItems) {
  const byId = new Map((indexItems || []).map((i) => [i.id, i]));
  return PATHS.map((p) => {
    const steps = p.steps.map((code) => {
      const hit = byId.get(code) || null;
      return hit
        ? { code, ok: true, sid: hit.sid, name_han: hit.name_han, name_vi: hit.name_vi }
        : { code, ok: false, sid: null, name_han: code, name_vi: '' };
    });
    return { ...p, steps, okCount: steps.filter((s) => s.ok).length, broken: steps.filter((s) => !s.ok).length };
  });
}
