// ═══ [BRAIN COVERAGE] Đo khả năng tổng hợp: AI có bám SƠ ĐỒ NÃO không, có bỏ sót kiến thức không ═══
//   NÃO (brain.js think) xuất các nút ★ kết luận determinist (kèm conf% + evidence chain).
//   Phép đo: mỗi nút rút 3 từ khóa đặc trưng → đếm bao nhiêu từ khóa xuất hiện trong câu trả lời AI.
//   Coverage% = nút có dấu vết / tổng nút. Nút miss = BỎ SÓT kiến thức determinist.
//   KHÔNG đo văn phong — chỉ đo KHUNG SƯỜN TRI THỨC có được vận dụng.
// [GHI CHÚ TRUNG THỰC] matching theo từ khóa là xấp xỉ: AI diễn đạt lại vẫn bị trừ nhẹ
//   → coverage là LOWER BOUND của chất lượng tổng hợp.

// stopword tiếng Việt + từ chức năng (không phải thuật ngữ)
const _STOP = new Set(('của và là nên cho với các một những này đó khi thì sẽ bị được phải cần làm về từ trong ra vào đi đến hơn nhiều rất cũng nhưng mà hay thì phải coi như theo giữa trước sau trên dưới cơ bản có thể không giá trị chuyên gia hơn cả mức thận trọng điểm quan trọng'.split(/\s+/)));

function _norm(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
}

/**
 * Parse brain output thành các nút.
 * Input dạng: "[BRAIN GRAPH — career]\n★ dieu_hou_override: ĐIỀU HẬU override → ... (88%)\n  ↳ Evidence: ..."
 * @returns {{topic, nodes: [{label, keywords[], conf, evidence}]}}
 */
export function parseBrainNodes(brainOut) {
  const text = String(brainOut || '');
  const topicM = text.match(/\[BRAIN GRAPH\s*—\s*([^\]]+)\]/);
  const topic = topicM ? topicM[1].trim() : 'general';
  const nodes = [];
  const lines = text.split('\n');
  for (const line of lines) {
    const m = line.match(/^\s*★\s*([\w_]+):\s*(.+?)\s*\((\d{2,3})%\)\s*$/);
    if (!m) continue;
    const label = m[1];
    const conclusion = m[2];
    const conf = parseInt(m[3], 10);
    // Evidence line kế tiếp (nếu có)
    nodes.push({ label, conclusion, conf, keywords: _extractKeywords(conclusion + ' ' + label.replace(/_/g, ' ')) });
  }
  return { topic, nodes };
}

/**
 * Rút 3 từ khóa đặc trưng từ một nút: từ dài ≥5 ký tự, không stopword,
 * ưu tiên thuật ngữ Hán-Việt / ghép (Sát, Ấn, Thương, hầu, cứu ứng...).
 */
function _extractKeywords(text) {
  const words = _norm(text).split(/[^a-z0-9à-ỹà-ỹ]+/i).filter(Boolean);
  const scored = [];
  for (const w of words) {
    if (w.length < 5 || _STOP.has(w)) continue;
    // điểm: dài hơn = đặc trưng hơn; từ chứa thuật ngữHN thêm điểm
    let sc = w.length;
    if (/^(thuong|sat|an|dung|tai|cuc|cuu|hau|menh|van|quan|nhan|hoa|kim|mo|thuy|tho)/.test(w)) sc += 4;
    scored.push([w, sc]);
  }
  scored.sort((a, b) => b[1] - a[1]);
  // lấy 3 từ đặc trưng nhất
  return scored.slice(0, 3).map(([w]) => w);
}

/**
 * Đo Brain Coverage: mỗi nút PASS nếu ≥1 keyword xuất hiện trong response (đã norm).
 * @param {string} response — câu trả lời AI
 * @param {string} brainOut — output của brainThink (khung xương determinist)
 * @returns {{coverage, nodesTotal, nodesHit, missed[{label, keywords}], topic}}
 */
export function measureBrainCoverage(response, brainOut) {
  const { topic, nodes } = parseBrainNodes(brainOut);
  if (!nodes.length) return { coverage: null, nodesTotal: 0, nodesHit: 0, missed: [], topic };
  const respNorm = _norm(response);
  let hit = 0;
  const missed = [];
  for (const node of nodes) {
    const hitKw = node.keywords.find((kw) => respNorm.includes(kw));
    if (hitKw) hit++;
    else missed.push({ label: node.label, keywords: node.keywords, conf: node.conf });
  }
  return {
    coverage: Math.round((hit / nodes.length) * 100),
    nodesTotal: nodes.length,
    nodesHit: hit,
    missed: missed.slice(0, 8),
    topic,
  };
}
