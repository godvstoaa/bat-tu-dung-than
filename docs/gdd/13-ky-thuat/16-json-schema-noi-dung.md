# 13.16 · Phụ lục A — JSON Schema chuẩn (nhân vật, nhiệm vụ, công đức, persona)

> Các phần 02–05 mô tả từng SCHEMA bằng ví dụ có chú thích. Phụ lục này cho bản **JSON Schema (draft 2020-12)** chính thức để đặt vào `docs/schema-game/<tên>.schema.json` và cho `validate-content.mjs` dùng. Khi ví dụ trong các phần khác và schema ở đây lệch nhau, **schema ở đây là chuẩn**.
>
> Trình kiểm: đề xuất thêm `ajv` (phụ thuộc phát triển, TD duyệt) cho `validate-content`; nếu không thêm phụ thuộc, `scripts/lib/mini-schema.mjs` cài tập con: `type`, `enum`, `const`, `required`, `properties`, `additionalProperties`, `items`, `minItems`, `maxItems`, `minimum`, `maximum`, `exclusiveMinimum`, `pattern`, `minLength`, `maxLength`, `minProperties`, `maxProperties`, `propertyNames`, `allOf`, `oneOf`, `anyOf`, `$ref` (nội bộ `#/$defs/…` và chéo tệp theo `$id`, vd `common#/$defs/wx`). Mọi schema dưới đây chỉ dùng tập con đó.

## A.1 Định nghĩa dùng chung (`common.schema.json`)

```json
{
  "$id": "hq/common",
  "$defs": {
    "wx": { "enum": ["木", "火", "土", "金", "水"] },
    "regionId": { "enum": ["thanh", "tubinh", "manh", "trichthien", "cungthong", "thulau", "phongthuy", "lichduong",
                           "longho", "vodang", "chungnam", "maoshan", "yentu", "buttap", "tangdia", "vanmieu",
                           "phongdo", "mieucuong", "conlon", "vancoc"] },
    "npcId": { "type": "string", "pattern": "^([a-z][a-z0-9_]{1,30}|NPC-[A-Za-z0-9_-]{1,40})$" },
    "questId": { "type": "string", "pattern": "^(MQ-(P|[1-4]|E)-[0-9]{2}|BR-(TT|DC|NT|DK)-[0-9]{2}|SQ-[a-z]+-[0-9]{2}|TL-[0-9]{2}|DQ-[0-9]{2}|EV-[a-z]+-[0-9]{2}|CQ-[a-z]+-[0-9]{2})$" },
    "deedId": { "type": "string", "pattern": "^DEED-[0-9]{3}$" },
    "perkId": { "type": "string", "pattern": "^PERK-[A-Za-z]+$" },
    "mgId": { "type": "string", "pattern": "^MG-[0-9]{2}$" },
    "cutId": { "type": "string", "pattern": "^CUT-[0-9]{3}$" },
    "uiId": { "type": "string", "pattern": "^UI-[0-9]{2}$" },
    "personaId": { "type": "string", "pattern": "^PERSONA-[a-z_]+$" },
    "bldId": { "type": "string", "pattern": "^BLD-[a-z]+-[0-9]{2}$" },
    "poiId": { "type": "string", "pattern": "^POI-[a-z]+-[0-9]{2}$" },
    "modId": { "type": "string", "pattern": "^MOD-[a-z]+-[0-9]{2}[a-z]?$" },
    "textKey": { "type": "string", "pattern": "^t:[A-Za-z0-9_.\\-]{1,80}$" },
    "flagName": { "type": "string", "pattern": "^[a-z0-9_.]{1,48}$" },
    "shichen": { "enum": ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] },
    "mmdd": { "type": "string", "pattern": "^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$" },
    "epochMs": { "type": "integer", "minimum": 1700000000000 },
    "xz": { "type": "array", "items": { "type": "number" }, "minItems": 2, "maxItems": 2 },
    "xyz": { "type": "array", "items": { "type": "number" }, "minItems": 3, "maxItems": 3 },
    "poly2": { "type": "array", "items": { "$ref": "#/$defs/xz" }, "minItems": 3, "maxItems": 16 }
  }
}
```

Ghi chú: danh sách `regionId` gồm 8 vùng có sẵn (`terrain.js › REGIONS`) và 12 vùng canon §3. Thêm vùng mới phải sửa schema (cố ý: vùng là quyết định canon).

## A.2 SCHEMA-MENHBAN

```json
{
  "$id": "hq/menhban",
  "type": "object",
  "required": ["v", "engineV", "key", "hash", "at", "refYear", "tiemLuc", "phamCan", "phucPhan", "nguHanh", "thanLuc",
               "thienMenh", "nguDuy", "menhCach", "menhCap", "nguyenKhi", "dacTinh", "tucNghiep", "tinhKhi", "thoiVan", "warnings"],
  "additionalProperties": false,
  "properties": {
    "v": { "const": 1 },
    "engineV": { "type": "string", "pattern": "^[0-9]{4}\\.[0-9]{1,2}\\.[0-9]+$" },
    "key": { "type": "string", "pattern": "^[0-9a-f]{12}$" },
    "hash": { "type": "string", "pattern": "^[0-9a-f]{8}$" },
    "at": { "$ref": "common#/$defs/epochMs" },
    "refYear": { "type": "integer", "minimum": 1900, "maximum": 2200 },
    "uncertain": { "type": "array", "items": { "enum": ["hour"] } },
    "tiemLuc": { "type": "object", "required": ["value", "percentile", "src"], "additionalProperties": false,
      "properties": { "value": { "type": "integer", "minimum": 0, "maximum": 100 },
                      "percentile": { "type": "integer", "minimum": 1, "maximum": 99 }, "src": { "const": "synthesis.score" } } },
    "phamCan": { "type": "object", "required": ["idx", "name", "gradeVi", "grade", "src"], "additionalProperties": false,
      "properties": { "idx": { "type": "integer", "minimum": 0, "maximum": 9 }, "name": { "type": "string" },
                      "gradeVi": { "type": "string" }, "grade": { "enum": ["上", "中上", "中", "中下", "下"] }, "src": { "type": "string" } } },
    "phucPhan": { "type": "object", "required": ["key", "vi", "src"], "additionalProperties": false,
      "properties": { "key": { "enum": ["đại phú quý", "phú quý", "tiểu phú quý", "khá no", "bình", "tiềm năng ẩn"] },
                      "vi": { "type": "string" }, "src": { "type": "string" } } },
    "nguHanh": { "type": "object", "required": ["pct", "eff", "names", "src"], "additionalProperties": false,
      "properties": {
        "pct": { "$ref": "#/$defs/wxNum" }, "eff": { "$ref": "#/$defs/wxNum" },
        "names": { "type": "object" }, "src": { "type": "string" } } },
    "thanLuc": { "type": "object", "required": ["value", "level", "strong", "src"], "additionalProperties": false,
      "properties": { "value": { "type": "integer", "minimum": 0, "maximum": 100 }, "level": { "type": "string" },
                      "strong": { "type": "boolean" }, "src": { "type": "string" } } },
    "thienMenh": { "type": "object", "required": ["dung", "hy", "ky", "cuu", "src"], "additionalProperties": false,
      "properties": { "dung": { "$ref": "common#/$defs/wx" }, "hy": { "$ref": "common#/$defs/wx" },
                      "ky": { "$ref": "common#/$defs/wx" }, "cuu": { "$ref": "common#/$defs/wx" }, "src": { "type": "string" } } },
    "nguDuy": { "type": "object", "required": ["dims", "dominant", "weakest", "src"], "additionalProperties": false,
      "properties": {
        "dims": { "type": "object", "required": ["cai", "guan", "yin", "shi", "ti"], "additionalProperties": false,
          "properties": { "cai": { "$ref": "#/$defs/pct100" }, "guan": { "$ref": "#/$defs/pct100" }, "yin": { "$ref": "#/$defs/pct100" },
                          "shi": { "$ref": "#/$defs/pct100" }, "ti": { "$ref": "#/$defs/pct100" } } },
        "dominant": { "enum": ["cai", "guan", "yin", "shi", "ti"] }, "weakest": { "enum": ["cai", "guan", "yin", "shi", "ti"] },
        "src": { "type": "string" } } },
    "menhCach": { "type": "object", "required": ["quality", "lop", "pattern", "src"], "additionalProperties": false,
      "properties": { "quality": { "enum": ["成格", "有救", "败格", "特殊", "未知"] },
                      "lop": { "enum": ["TT", "DC", "NT", "DK", null] }, "pattern": { "type": "string" }, "patternVi": { "type": "string" },
                      "diseases": { "type": "array", "items": { "type": "string", "maxLength": 160 } },
                      "rescues": { "type": "array", "items": { "type": "string", "maxLength": 160 } }, "src": { "type": "string" } } },
    "menhCap": { "oneOf": [ { "type": "null" }, { "type": "object", "required": ["level"], "properties": {
                      "level": { "enum": ["极品", "贵格", "富格", "清贵", "常格", "下格"] }, "levelVi": { "type": "string" }, "src": { "type": "string" } } } ] },
    "nguyenKhi": { "oneOf": [ { "type": "null" }, { "type": "object", "required": ["value"], "properties": {
                      "value": { "type": "integer", "minimum": 0, "maximum": 100 }, "src": { "type": "string" } } } ] },
    "dacTinh": { "type": "array", "maxItems": 60, "items": { "type": "object", "required": ["key", "from"], "additionalProperties": false,
      "properties": { "key": { "type": "string", "pattern": "^[a-zA-Z]+$" }, "zh": { "type": "string" }, "from": { "enum": ["shensha", "noble"] } } } },
    "tucNghiep": { "oneOf": [ { "type": "null" }, { "type": "object", "required": ["realm", "poisons"], "properties": {
                      "realm": { "type": "string" },
                      "poisons": { "type": "object", "required": ["tham", "san", "si"], "properties": {
                        "tham": { "$ref": "#/$defs/pct100" }, "san": { "$ref": "#/$defs/pct100" }, "si": { "$ref": "#/$defs/pct100" } } },
                      "src": { "type": "string" } } } ] },
    "tinhKhi": { "oneOf": [ { "type": "null" }, { "type": "object", "properties": {
                      "dayGan": { "type": "string", "maxLength": 1 }, "nayin": { "type": "string" }, "nayinVi": { "type": "string" }, "src": { "type": "string" } } } ] },
    "thoiVan": { "type": "object", "required": ["dayun", "liunian", "mod"], "properties": {
      "dayun": { "oneOf": [ { "type": "null" }, { "type": "object", "required": ["idx", "ganZhi", "startYear", "score"], "properties": {
                   "idx": { "type": "integer", "minimum": 0 }, "ganZhi": { "type": "string", "minLength": 2, "maxLength": 2 },
                   "startYear": { "type": "integer" }, "score": { "type": "number" }, "rating": { "type": "string" } } } ] },
      "liunian": { "oneOf": [ { "type": "null" }, { "type": "object", "required": ["year", "ganZhi", "score"], "properties": {
                   "year": { "type": "integer" }, "ganZhi": { "type": "string" }, "score": { "type": "number" }, "rating": { "type": "string" } } } ] },
      "mod": { "type": "number", "minimum": -0.1, "maximum": 0.1 },
      "childhood": { "type": "boolean" }, "src": { "type": "string" } } },
    "warnings": { "type": "array", "items": { "type": "string", "maxLength": 120 } }
  },
  "$defs": {
    "pct100": { "type": "number", "minimum": 0, "maximum": 100 },
    "wxNum": { "type": "object", "required": ["木", "火", "土", "金", "水"], "additionalProperties": false,
      "properties": { "木": { "$ref": "#/$defs/pct100" }, "火": { "$ref": "#/$defs/pct100" }, "土": { "$ref": "#/$defs/pct100" },
                      "金": { "$ref": "#/$defs/pct100" }, "水": { "$ref": "#/$defs/pct100" } } }
  }
}
```

Ràng buộc chéo trường (không diễn đạt được bằng JSON Schema, kiểm trong `validateMenhBan`): bảng phần 02 §3.

## A.3 SCHEMA-PUBLIC-CARD

```json
{
  "$id": "hq/public-card",
  "type": "object",
  "required": ["name", "robe", "acc", "cos", "title", "realm", "dh", "school", "canCot"],
  "additionalProperties": false,
  "properties": {
    "name": { "type": "string", "minLength": 1, "maxLength": 24 },
    "robe": { "$ref": "common#/$defs/wx" },
    "acc": { "oneOf": [ { "$ref": "common#/$defs/wx" }, { "const": "" } ] },
    "cos": { "type": "string", "maxLength": 240 },
    "title": { "type": "string", "maxLength": 24 },
    "realm": { "type": "integer", "minimum": 1, "maximum": 6 },
    "dh": { "type": "integer", "minimum": 0 },
    "school": { "oneOf": [ { "type": "null" }, { "type": "string", "pattern": "^[a-z]+$" } ] },
    "canCot": { "oneOf": [ { "type": "null" }, { "type": "object", "required": ["tiemLuc", "phamCan"], "additionalProperties": false,
      "properties": { "tiemLuc": { "type": "integer", "minimum": 0, "maximum": 100 }, "phamCan": { "type": "string" } } } ] }
  }
}
```

## A.4 SCHEMA-SAVE (v2, mức khối)

```json
{
  "$id": "hq/save-v2",
  "type": "object",
  "required": ["v", "rev", "savedAt", "player", "profiles", "phucKhi", "daily", "xp", "menh", "dao", "ledger", "quests", "world", "persona", "consent", "ai"],
  "properties": {
    "v": { "const": 2 },
    "rev": { "type": "integer", "minimum": 0 },
    "savedAt": { "$ref": "common#/$defs/epochMs" },
    "player": { "oneOf": [ { "type": "null" }, { "$ref": "#/$defs/player" } ] },
    "profiles": { "type": "array", "maxItems": 5, "items": { "$ref": "#/$defs/profile" } },
    "phucKhi": { "type": "number" },
    "xp": { "type": "number", "minimum": 0 },
    "daily": { "type": "object", "required": ["date", "got"], "properties": { "date": { "type": "string", "pattern": "^[0-9]{4}-[0-9]{2}-[0-9]{2}$" } } },
    "menh": { "type": "object", "properties": {
      "key": { "oneOf": [ { "type": "null" }, { "type": "string", "pattern": "^[0-9a-f]{12}$" } ] },
      "engineV": { "oneOf": [ { "type": "null" }, { "type": "string" } ] },
      "hash": { "oneOf": [ { "type": "null" }, { "type": "string", "pattern": "^[0-9a-f]{8}$" } ] },
      "seenDiff": { "oneOf": [ { "type": "null" }, { "type": "string" } ] } } },
    "dao": { "type": "object", "required": ["daoHanh", "realmMax", "school", "schools", "today"], "properties": {
      "daoHanh": { "type": "number", "minimum": 0 },
      "realmMax": { "type": "integer", "minimum": 1, "maximum": 6 },
      "school": { "enum": ["dao", "phat", "nho"] },
      "schools": { "type": "object", "maxProperties": 3 },
      "today": { "type": "object", "required": ["date", "gained"] } } },
    "ledger": { "type": "object", "required": ["entries", "net", "thien", "ac", "milestones", "amNo"], "properties": {
      "entries": { "type": "array", "maxItems": 2100, "items": { "oneOf": [ { "$ref": "hq/ledger-entry" }, { "$ref": "#/$defs/rollup" } ] } },
      "net": { "type": "integer" }, "thien": { "type": "integer", "minimum": 0 }, "ac": { "type": "integer", "maximum": 0 },
      "milestones": { "type": "object" }, "amNo": { "type": "integer", "minimum": 0 }, "syncedRev": { "type": "integer" } } },
    "quests": { "$ref": "hq/quest-state" },
    "world": { "type": "object", "required": ["visited", "unlocked"], "properties": {
      "visited": { "type": "array", "items": { "$ref": "common#/$defs/regionId" } },
      "unlocked": { "type": "array", "items": { "$ref": "common#/$defs/regionId" } } } },
    "persona": { "type": "object", "properties": { "mem": { "type": "object" } } },
    "consent": { "type": "object", "required": ["analytics", "publicCanCot", "amta", "cloudBirth"], "properties": {
      "analytics": { "type": ["boolean", "null"] }, "publicCanCot": { "type": "boolean" }, "amta": { "type": "boolean" },
      "tl": { "type": "boolean" }, "cloudBirth": { "type": "boolean" }, "at": { "type": ["integer", "null"] } } },
    "ai": { "type": "object", "properties": { "date": { "type": ["string", "null"] }, "used": { "type": "integer", "minimum": 0 } } },
    "account": { "oneOf": [ { "type": "null" }, { "type": "object", "required": ["id"], "properties": { "id": { "type": "string", "pattern": "^acc_[0-9A-HJKMNP-TV-Z]{26}$" } } } ] },
    "_extra": { "type": "object" }
  },
  "$defs": {
    "player": { "type": "object", "required": ["name", "look", "robe"], "properties": {
      "name": { "type": "string", "maxLength": 24 }, "look": { "enum": ["hero_m", "hero_f"] }, "robe": { "$ref": "common#/$defs/wx" },
      "birth": { "type": "object", "required": ["y", "m", "d", "gender"], "properties": {
        "y": { "type": "integer", "minimum": 1900, "maximum": 2100 }, "m": { "type": "integer", "minimum": 1, "maximum": 12 },
        "d": { "type": "integer", "minimum": 1, "maximum": 31 }, "h": { "type": "integer", "minimum": 0, "maximum": 23 },
        "mi": { "type": "integer", "minimum": 0, "maximum": 59 }, "gender": { "enum": ["nam", "nữ"] }, "hourUnknown": { "type": "boolean" } } } } },
    "profile": { "type": "object", "required": ["id", "label", "year", "month", "day", "gender"] },
    "rollup": { "type": "object", "required": ["id", "kind", "month", "thien", "ac", "net", "count"], "properties": {
      "kind": { "const": "rollup" }, "month": { "type": "string", "pattern": "^[0-9]{4}-[0-9]{2}$" } } }
  }
}
```

Khối v1 giữ nguyên kiểu như `state.js › createState` (không liệt kê lại từng trường v1 ngoài các trường có bất biến).

## A.5 SCHEMA-QUEST, SCHEMA-QUEST-NODE, SCHEMA-WINDOW

```json
{
  "$id": "hq/quest",
  "type": "object",
  "required": ["id", "v", "kind", "title", "start", "nodes"],
  "additionalProperties": false,
  "properties": {
    "id": { "$ref": "common#/$defs/questId" },
    "v": { "type": "integer", "minimum": 1 },
    "kind": { "enum": ["main", "branch", "side", "tl", "daily", "event", "school"] },
    "title": { "$ref": "common#/$defs/textKey" },
    "summary": { "$ref": "common#/$defs/textKey" },
    "giver": { "$ref": "common#/$defs/npcId" },
    "region": { "$ref": "common#/$defs/regionId" },
    "tags": { "type": "array", "items": { "type": "string", "pattern": "^[a-z0-9-]{1,32}$" }, "maxItems": 12 },
    "prereq": { "$ref": "hq/cond" },
    "window": { "oneOf": [ { "type": "null" }, { "$ref": "#/$defs/window" } ] },
    "repeat": { "enum": ["none", "daily", "weekly", "lunarMonthly", "yearly"] },
    "ios": { "enum": ["same", "alt", "off"] },
    "sensitive": { "enum": [null, "amta", "tl"] },
    "start": { "$ref": "#/$defs/nodeId" },
    "nodes": { "type": "object", "minProperties": 2, "maxProperties": 200,
      "propertyNames": { "$ref": "#/$defs/nodeId" }, "additionalProperties": { "$ref": "#/$defs/node" } },
    "iosNodes": { "type": "object", "propertyNames": { "$ref": "#/$defs/nodeId" }, "additionalProperties": { "$ref": "#/$defs/node" } },
    "rewards": { "type": "array", "items": { "$ref": "hq/effect" }, "maxItems": 12 },
    "migrate": { "type": "object", "additionalProperties": { "$ref": "#/$defs/nodeId" } },
    "checkpoints": { "type": "array", "items": { "$ref": "#/$defs/nodeId" } }
  },
  "$defs": {
    "nodeId": { "type": "string", "pattern": "^[a-z][a-z0-9_]{0,23}$" },
    "edge": { "type": "object", "required": ["to"], "additionalProperties": false,
      "properties": { "to": { "$ref": "#/$defs/nodeId" }, "when": { "$ref": "hq/cond" } } },
    "window": { "type": "object", "additionalProperties": false, "minProperties": 1, "properties": {
      "solar": { "type": "object", "required": ["from", "to"], "properties": { "from": { "$ref": "common#/$defs/mmdd" }, "to": { "$ref": "common#/$defs/mmdd" } } },
      "lunar": { "type": "object", "required": ["month"], "properties": { "month": { "type": "integer", "minimum": 1, "maximum": 12 },
                 "dayFrom": { "type": "integer", "minimum": 1, "maximum": 30 }, "dayTo": { "type": "integer", "minimum": 1, "maximum": 30 } } },
      "term": { "type": "string", "minLength": 2, "maxLength": 2 },
      "shichen": { "type": "array", "items": { "$ref": "common#/$defs/shichen" }, "minItems": 1, "maxItems": 12 },
      "weekday": { "type": "array", "items": { "type": "integer", "minimum": 0, "maximum": 6 } } } },
    "nodeBase": { "type": "object", "properties": {
      "title": { "$ref": "common#/$defs/textKey" },
      "guard": { "$ref": "hq/cond" },
      "onEnter": { "type": "array", "items": { "$ref": "hq/effect" }, "maxItems": 12 },
      "onDone": { "type": "array", "items": { "$ref": "hq/effect" }, "maxItems": 12 },
      "next": { "type": "array", "items": { "$ref": "#/$defs/edge" }, "maxItems": 8 },
      "checkpoint": { "type": "boolean" },
      "divination": { "type": "boolean" },
      "stableAid": { "type": "boolean" },
      "marker": { "type": "object", "required": ["kind"], "properties": { "kind": { "enum": ["npc", "region", "poi", "bld", "station", "point"] } } } } },
    "node": { "allOf": [ { "$ref": "#/$defs/nodeBase" } ], "oneOf": [
      { "properties": { "type": { "const": "talk" }, "npc": { "$ref": "common#/$defs/npcId" }, "dialogue": { "type": "string" }, "entry": { "type": "string" } }, "required": ["type", "npc", "dialogue"] },
      { "properties": { "type": { "const": "goto" }, "target": { "type": "object", "minProperties": 1, "maxProperties": 3 } }, "required": ["type", "target"] },
      { "properties": { "type": { "const": "station" }, "station": { "type": "string" }, "result": { "$ref": "hq/cond" } }, "required": ["type", "station"] },
      { "properties": { "type": { "const": "case" }, "caseKind": { "enum": ["npc", "classical", "desk", "quest"] }, "caseId": { "type": "string" },
                        "minScore": { "type": "number", "minimum": 0, "maximum": 1 } }, "required": ["type", "caseKind"] },
      { "properties": { "type": { "const": "deed" }, "deed": { "$ref": "common#/$defs/deedId" }, "count": { "type": "integer", "minimum": 1, "maximum": 50 } }, "required": ["type", "deed"] },
      { "properties": { "type": { "const": "minigame" }, "mg": { "$ref": "common#/$defs/mgId" }, "minGrade": { "type": "number", "minimum": 0, "maximum": 1 } }, "required": ["type", "mg"] },
      { "properties": { "type": { "const": "wait" }, "ms": { "type": "integer", "minimum": 1000, "maximum": 2592000000 }, "until": { "$ref": "#/$defs/window" } }, "required": ["type"] },
      { "properties": { "type": { "const": "choice" }, "options": { "type": "array", "minItems": 2, "maxItems": 6, "items": {
          "type": "object", "required": ["id", "label", "to"], "properties": { "id": { "type": "string", "pattern": "^[a-z0-9]{1,8}$" },
            "label": { "$ref": "common#/$defs/textKey" }, "guard": { "$ref": "hq/cond" },
            "effects": { "type": "array", "items": { "$ref": "hq/effect" } }, "to": { "$ref": "#/$defs/nodeId" } } } } }, "required": ["type", "options"] },
      { "properties": { "type": { "const": "branch" } }, "required": ["type", "next"] },
      { "properties": { "type": { "const": "parallel" }, "need": { "oneOf": [ { "const": "all" }, { "type": "integer", "minimum": 1 } ] },
                        "goals": { "type": "array", "minItems": 2, "maxItems": 8, "items": { "type": "object", "required": ["id", "node"] } } }, "required": ["type", "goals"] },
      { "properties": { "type": { "const": "cutscene" }, "cut": { "$ref": "common#/$defs/cutId" }, "skippable": { "type": "boolean" } }, "required": ["type", "cut"] },
      { "properties": { "type": { "const": "aiTalk" }, "npc": { "$ref": "common#/$defs/npcId" }, "persona": { "$ref": "common#/$defs/personaId" },
                        "minTurns": { "type": "integer", "minimum": 1, "maximum": 10 }, "topic": { "type": "string" },
                        "fallbackDialogue": { "type": "string" } }, "required": ["type", "npc", "persona", "fallbackDialogue"] },
      { "properties": { "type": { "const": "end" }, "outcome": { "enum": ["success", "fail", "abandon"] } }, "required": ["type", "outcome"] }
    ] }
  }
}
```

## A.6 SCHEMA-COND

```json
{
  "$id": "hq/cond",
  "oneOf": [
    { "type": "null" },
    { "type": "object", "required": ["all"], "additionalProperties": false, "properties": { "all": { "type": "array", "items": { "$ref": "#" }, "minItems": 1, "maxItems": 16 }, "label": { "$ref": "common#/$defs/textKey" } } },
    { "type": "object", "required": ["any"], "additionalProperties": false, "properties": { "any": { "type": "array", "items": { "$ref": "#" }, "minItems": 1, "maxItems": 16 }, "label": { "$ref": "common#/$defs/textKey" } } },
    { "type": "object", "required": ["not"], "additionalProperties": false, "properties": { "not": { "$ref": "#" }, "label": { "$ref": "common#/$defs/textKey" } } },
    { "type": "object", "required": ["stat"], "additionalProperties": false, "properties": {
        "stat": { "type": "object", "required": ["path", "op", "v"], "additionalProperties": false, "properties": {
          "path": { "$ref": "#/$defs/statPath" }, "op": { "$ref": "#/$defs/op" }, "v": { "type": ["number", "string", "array"] } } },
        "label": { "$ref": "common#/$defs/textKey" } } },
    { "type": "object", "required": ["flag"], "additionalProperties": false, "properties": { "flag": { "$ref": "common#/$defs/flagName" }, "label": { "$ref": "common#/$defs/textKey" } } },
    { "type": "object", "required": ["var"], "additionalProperties": false, "properties": {
        "var": { "type": "object", "required": ["name", "op", "v"], "properties": { "name": { "$ref": "common#/$defs/flagName" }, "op": { "$ref": "#/$defs/op" }, "v": { "type": ["number", "string"] } } },
        "label": { "$ref": "common#/$defs/textKey" } } },
    { "type": "object", "required": ["quest"], "additionalProperties": false, "properties": {
        "quest": { "type": "object", "required": ["id", "is"], "properties": { "id": { "$ref": "common#/$defs/questId" },
                   "is": { "enum": ["active", "done", "failed", "none"] }, "node": { "type": "string" } } },
        "label": { "$ref": "common#/$defs/textKey" } } },
    { "type": "object", "required": ["realm"], "additionalProperties": false, "properties": { "realm": { "$ref": "#/$defs/range16" }, "label": { "$ref": "common#/$defs/textKey" } } },
    { "type": "object", "required": ["merit"], "additionalProperties": false, "properties": { "merit": { "$ref": "#/$defs/rangeInt" }, "label": { "$ref": "common#/$defs/textKey" } } },
    { "type": "object", "required": ["amNo"], "additionalProperties": false, "properties": { "amNo": { "$ref": "#/$defs/rangeInt" }, "label": { "$ref": "common#/$defs/textKey" } } },
    { "type": "object", "required": ["school"], "additionalProperties": false, "properties": {
        "school": { "type": "object", "required": ["id", "is"], "properties": { "id": { "type": "string" }, "is": { "enum": ["joined", "none"] },
                    "progressGte": { "type": "integer", "minimum": 0 } } }, "label": { "$ref": "common#/$defs/textKey" } } },
    { "type": "object", "required": ["schools"], "additionalProperties": false, "properties": {
        "schools": { "type": "object", "required": ["countGte"], "properties": { "countGte": { "type": "integer", "minimum": 0, "maximum": 3 } } } } },
    { "type": "object", "required": ["lop"], "additionalProperties": false, "properties": { "lop": { "enum": ["TT", "DC", "NT", "DK", null] }, "label": { "$ref": "common#/$defs/textKey" } } },
    { "type": "object", "required": ["perk"], "additionalProperties": false, "properties": { "perk": { "$ref": "common#/$defs/perkId" }, "label": { "$ref": "common#/$defs/textKey" } } },
    { "type": "object", "required": ["region"], "additionalProperties": false, "properties": {
        "region": { "type": "object", "required": ["in"], "properties": { "in": { "type": "array", "items": { "$ref": "common#/$defs/regionId" }, "minItems": 1 } } } } },
    { "type": "object", "required": ["visited"], "additionalProperties": false, "properties": { "visited": { "$ref": "common#/$defs/regionId" } } },
    { "type": "object", "required": ["time"], "additionalProperties": false, "properties": { "time": { "$ref": "hq/quest#/$defs/window" }, "label": { "$ref": "common#/$defs/textKey" } } },
    { "type": "object", "required": ["feature"], "additionalProperties": false, "properties": { "feature": { "enum": ["divination", "ai", "wishes"] } } },
    { "type": "object", "required": ["consent"], "additionalProperties": false, "properties": { "consent": { "enum": ["amta", "tl", "analytics", "publicCanCot"] } } },
    { "type": "object", "required": ["rand"], "additionalProperties": false, "properties": {
        "rand": { "type": "object", "required": ["p", "seed"], "properties": { "p": { "type": "number", "minimum": 0, "maximum": 1 }, "seed": { "enum": ["day", "quest"] } } } } }
  ],
  "$defs": {
    "op": { "enum": ["<", "<=", "==", "!=", ">=", ">", "in"] },
    "range16": { "type": "object", "minProperties": 1, "additionalProperties": false, "properties": {
      "gte": { "type": "integer", "minimum": 1, "maximum": 6 }, "lte": { "type": "integer", "minimum": 1, "maximum": 6 } } },
    "rangeInt": { "type": "object", "minProperties": 1, "additionalProperties": false, "properties": { "gte": { "type": "integer" }, "lte": { "type": "integer" } } },
    "statPath": { "type": "string", "pattern": "^(mb\\.(tiemLuc|phamCan\\.idx|thanLuc|menhCap|nguyenKhi|nguDuy\\.(cai|guan|yin|shi|ti|dominant|weakest)|nguHanh\\.(pct|eff)\\.(木|火|土|金|水)|thienMenh\\.(dung|hy|ky|cuu)|tucNghiep\\.(realm|poisons\\.(tham|san|si))|thoiVan\\.(liunian|dayun)\\.score)|dao\\.daoHanh|ledger\\.(net|thien|ac)|level|phucKhi|streak)$" }
  }
}
```

`mb.tiemLuc` trong `StatPath` ánh xạ tới `mb.tiemLuc.value` (bộ đánh giá tự lấy `.value` cho khối có trường `value`).

## A.7 SCHEMA-EFFECT

```json
{
  "$id": "hq/effect",
  "type": "object",
  "required": ["do"],
  "oneOf": [
    { "properties": { "do": { "enum": ["setFlag", "clearFlag"] }, "name": { "$ref": "common#/$defs/flagName" } }, "required": ["name"] },
    { "properties": { "do": { "enum": ["setVar", "incVar"] }, "name": { "$ref": "common#/$defs/flagName" }, "v": { "type": ["number", "string"] } }, "required": ["name", "v"] },
    { "properties": { "do": { "const": "grantPhuc" }, "n": { "type": "integer", "minimum": 1, "maximum": 200 } }, "required": ["n"] },
    { "properties": { "do": { "const": "grantDaoHanh" }, "base": { "type": "integer", "minimum": 1, "maximum": 500 },
                      "school": { "type": "string" }, "ky": { "type": "boolean" } }, "required": ["base"] },
    { "properties": { "do": { "const": "logDeed" }, "deed": { "$ref": "common#/$defs/deedId" }, "count": { "type": "integer", "minimum": 1, "maximum": 10 } }, "required": ["deed"] },
    { "properties": { "do": { "const": "logFault" }, "deed": { "$ref": "common#/$defs/deedId" }, "cause": { "type": "string", "pattern": "^[a-z0-9-]{1,32}$" } }, "required": ["deed", "cause"] },
    { "properties": { "do": { "enum": ["startQuest", "failQuest", "abandonQuest"] }, "id": { "$ref": "common#/$defs/questId" } }, "required": ["id"] },
    { "properties": { "do": { "const": "unlockRegion" }, "region": { "$ref": "common#/$defs/regionId" } }, "required": ["region"] },
    { "properties": { "do": { "const": "unlockStation" }, "station": { "type": "string" } }, "required": ["station"] },
    { "properties": { "do": { "const": "giveCosmetic" }, "item": { "type": "string", "pattern": "^[a-z0-9_]{2,32}$" } }, "required": ["item"] },
    { "properties": { "do": { "enum": ["joinSchool", "leaveSchool"] }, "school": { "type": "string", "pattern": "^[a-z]+$" } }, "required": ["school"] },
    { "properties": { "do": { "const": "setTitle" }, "title": { "$ref": "common#/$defs/textKey" } }, "required": ["title"] },
    { "properties": { "do": { "const": "notify" }, "text": { "$ref": "common#/$defs/textKey" } }, "required": ["text"] },
    { "properties": { "do": { "const": "openUi" }, "ui": { "$ref": "common#/$defs/uiId" }, "args": { "type": "object" } }, "required": ["ui"] },
    { "properties": { "do": { "const": "playCut" }, "cut": { "$ref": "common#/$defs/cutId" } }, "required": ["cut"] },
    { "properties": { "do": { "const": "personaMemo" }, "npc": { "$ref": "common#/$defs/npcId" }, "note": { "$ref": "common#/$defs/textKey" } }, "required": ["npc", "note"] },
    { "properties": { "do": { "const": "amNo" }, "delta": { "type": "integer", "minimum": -1000, "maximum": 1000 } }, "required": ["delta"] }
  ]
}
```

Luật vị trí (`grantDaoHanh` chỉ ở `onDone`/`rewards`, `logFault` chỉ ở `options[].effects`, `amNo` chỉ ở `kind: 'tl'`) kiểm ở validator V8, không ở schema.

## A.8 SCHEMA-QUEST-STATE

```json
{
  "$id": "hq/quest-state",
  "type": "object",
  "required": ["active", "done", "failed", "vars", "rev"],
  "properties": {
    "active": { "type": "object", "propertyNames": { "$ref": "common#/$defs/questId" }, "maxProperties": 60,
      "additionalProperties": { "type": "object", "required": ["v", "node", "since", "started", "applied", "hist"], "properties": {
        "v": { "type": "integer", "minimum": 1 }, "node": { "type": "string" },
        "goals": { "type": "object", "additionalProperties": { "type": "boolean" } },
        "vars": { "type": "object" },
        "since": { "$ref": "common#/$defs/epochMs" }, "started": { "$ref": "common#/$defs/epochMs" },
        "applied": { "type": "array", "items": { "type": "string", "maxLength": 96 }, "maxItems": 400 },
        "hist": { "type": "array", "maxItems": 32, "items": { "type": "array", "minItems": 2, "maxItems": 2 } },
        "stuck": { "type": "boolean" } } } },
    "done": { "type": "object", "additionalProperties": { "type": "object", "required": ["at", "outcome"], "properties": {
      "at": { "$ref": "common#/$defs/epochMs" }, "outcome": { "enum": ["success", "fail"] }, "v": { "type": "integer" }, "aid": { "type": "string" } } } },
    "failed": { "type": "object" },
    "vars": { "type": "object" },
    "orphan": { "type": "object" },
    "rev": { "type": "integer", "minimum": 0 }
  }
}
```

## A.9 SCHEMA-DIALOGUE

```json
{
  "$id": "hq/dialogue",
  "type": "object",
  "required": ["id", "scenes"],
  "additionalProperties": false,
  "properties": {
    "id": { "type": "string", "pattern": "^[A-Za-z0-9_.-]{2,48}$" },
    "scenes": { "type": "object", "minProperties": 1, "propertyNames": { "type": "string", "pattern": "^[A-Za-z0-9_.-]{2,48}$" },
      "additionalProperties": { "type": "object", "required": ["lines"], "properties": {
        "place": { "type": "string", "maxLength": 60 }, "time": { "type": "string", "maxLength": 40 }, "weather": { "type": "string", "maxLength": 30 },
        "lines": { "type": "array", "minItems": 1, "maxItems": 80, "items": { "oneOf": [
          { "type": "object", "required": ["who", "text"], "additionalProperties": false, "properties": {
              "who": { "$ref": "common#/$defs/npcId" }, "text": { "$ref": "common#/$defs/textKey" }, "stage": { "type": "string", "maxLength": 60 },
              "bind": { "type": "object", "additionalProperties": { "type": "string", "pattern": "^mb\\." } },
              "end": { "type": "boolean" }, "effects": { "type": "array", "items": { "$ref": "hq/effect" } } } },
          { "type": "object", "required": ["choice"], "additionalProperties": false, "properties": {
              "choice": { "type": "array", "minItems": 2, "maxItems": 6, "items": { "type": "object", "required": ["id", "text", "to"], "properties": {
                "id": { "type": "string", "pattern": "^[a-z0-9]{1,8}$" }, "text": { "$ref": "common#/$defs/textKey" },
                "to": { "type": "string" }, "guard": { "$ref": "hq/cond" }, "showLocked": { "type": "boolean" },
                "effects": { "type": "array", "items": { "$ref": "hq/effect" } } } } } } }
        ] } } } } }
  }
}
```

`who` dùng `npcId`; người chơi nói thì dùng giá trị đặc biệt `"player"` (thêm vào mẫu `npcId` ở bản cài đặt: `^(player|[a-z][a-z0-9_]{1,30}|NPC-…)$`).

## A.10 SCHEMA-DEED-TABLE và SCHEMA-LEDGER-ENTRY

```json
{
  "$id": "hq/deed-table",
  "type": "object",
  "required": ["v", "scale", "milestones", "deeds"],
  "properties": {
    "v": { "type": "integer", "minimum": 1 },
    "scale": { "const": 10 },
    "milestones": { "const": [300, 600, 1000] },
    "deeds": { "type": "array", "minItems": 1, "items": { "type": "object", "required": ["id", "kind", "points", "congQua", "sources", "trust", "dailyCap", "ios", "desc"],
      "additionalProperties": false, "properties": {
        "id": { "$ref": "common#/$defs/deedId" },
        "kind": { "enum": ["thien", "ac"] },
        "points": { "type": "integer", "minimum": 1, "maximum": 3 },
        "congQua": { "type": "string", "minLength": 3 },
        "override": { "type": "object", "required": ["points", "why"], "properties": { "points": { "type": "integer", "minimum": 1, "maximum": 3 }, "why": { "type": "string", "minLength": 10 } } },
        "sources": { "type": "array", "minItems": 1, "items": { "enum": ["quest", "station", "case", "mmo", "event", "server"] } },
        "trust": { "enum": ["local", "server-able"] },
        "dailyCap": { "type": "integer", "minimum": 1, "maximum": 20 },
        "ios": { "type": "boolean" },
        "desc": { "$ref": "common#/$defs/textKey" } } } }
  }
}
```

```json
{
  "$id": "hq/ledger-entry",
  "type": "object",
  "required": ["id", "deed", "kind", "pts", "n", "at", "src", "trust", "dev"],
  "additionalProperties": false,
  "properties": {
    "id": { "type": "string", "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$" },
    "deed": { "$ref": "common#/$defs/deedId" },
    "kind": { "enum": ["thien", "ac"] },
    "pts": { "type": "integer", "minimum": -30, "maximum": 30 },
    "ptsServer": { "type": "integer" },
    "n": { "type": "integer", "minimum": 1, "maximum": 10 },
    "at": { "$ref": "common#/$defs/epochMs" },
    "src": { "type": "object", "required": ["t"], "properties": {
      "t": { "enum": ["quest", "station", "case", "mmo", "event", "server", "migrate"] },
      "q": { "$ref": "common#/$defs/questId" }, "node": { "type": "string" }, "aid": { "type": "string", "maxLength": 96 } } },
    "trust": { "enum": ["local", "receipt", "server"] },
    "rcpt": { "oneOf": [ { "type": "null" }, { "$ref": "hq/receipt" } ] },
    "rejected": { "enum": ["clock"] },
    "dev": { "type": "string", "pattern": "^[0-9a-f]{8}$" }
  }
}
```

## A.11 SCHEMA-RECEIPT, SCHEMA-TB-ROW

```json
{
  "$id": "hq/receipt",
  "type": "object",
  "required": ["k", "acc", "ref", "pts", "iat", "sig"],
  "additionalProperties": false,
  "properties": {
    "k": { "enum": ["case", "mg", "presence", "mentor"] },
    "acc": { "type": "string", "pattern": "^acc_[0-9A-HJKMNP-TV-Z]{26}$" },
    "ref": { "type": "string", "maxLength": 64 },
    "score": { "type": "number", "minimum": 0, "maximum": 1 },
    "pts": { "type": "integer", "minimum": 0, "maximum": 30 },
    "dh": { "type": "integer", "minimum": 0, "maximum": 500 },
    "iat": { "type": "integer", "minimum": 1700000000 },
    "sig": { "type": "string", "pattern": "^[A-Za-z0-9_-]{43}$" }
  }
}
```

```json
{
  "$id": "hq/tb-row",
  "type": "object",
  "required": ["acc", "name", "realm", "dh", "merit", "upd"],
  "additionalProperties": false,
  "properties": {
    "acc": { "type": "string" }, "name": { "type": "string", "maxLength": 24 },
    "realm": { "type": "integer", "minimum": 1, "maximum": 6 }, "school": { "type": ["string", "null"] },
    "dh": { "type": "integer", "minimum": 0 }, "merit": { "type": "integer" },
    "tt": { "type": ["integer", "null"], "minimum": 0, "maximum": 100 },
    "title": { "type": ["string", "null"], "maxLength": 24 },
    "upd": { "type": "integer" }
  }
}
```

## A.12 SCHEMA-PERSONA

```json
{
  "$id": "hq/persona",
  "type": "object",
  "required": ["id", "npc", "v", "status", "baseline", "name", "selfRef", "userRef", "voice", "scope", "forbid", "forbidReplace",
               "opening", "voiceReminder", "briefMode", "toolsAllow", "maxChars", "fallbackDialogue"],
  "additionalProperties": false,
  "properties": {
    "id": { "$ref": "common#/$defs/personaId" },
    "npc": { "$ref": "common#/$defs/npcId" },
    "v": { "type": "integer", "minimum": 1 },
    "status": { "enum": ["draft", "review", "approved"] },
    "reviewer": { "type": "string" },
    "baseline": { "enum": ["master", "guide"] },
    "name": { "type": "string", "maxLength": 40 }, "school": { "type": "string", "maxLength": 60 },
    "selfRef": { "type": "string", "maxLength": 16 }, "userRef": { "type": "string", "maxLength": 16 },
    "voice": { "type": "string", "minLength": 20, "maxLength": 600 },
    "scope": { "type": "array", "items": { "type": "string" }, "minItems": 1, "maxItems": 12 },
    "forbid": { "type": "array", "items": { "type": "string", "maxLength": 120 }, "maxItems": 40 },
    "forbidReplace": { "type": "string", "maxLength": 200 },
    "opening": { "type": "array", "items": { "$ref": "common#/$defs/textKey" }, "minItems": 1, "maxItems": 6 },
    "voiceReminder": { "type": "string", "maxLength": 240 },
    "briefMode": { "enum": ["full", "rag", "lite", "none"] },
    "briefSections": { "type": "array", "items": { "type": "string" }, "maxItems": 20 },
    "toolsAllow": { "type": "array", "items": { "type": "string", "pattern": "^[a-z_]{3,40}$" }, "maxItems": 40 },
    "maxChars": { "type": "integer", "minimum": 200, "maximum": 4000 },
    "temperature": { "type": "number", "minimum": 0, "maximum": 0.7 },
    "sensitive": { "enum": [null, "amta"] },
    "relatedQuestTags": { "type": "array", "items": { "type": "string" } },
    "cacheableQuestions": { "type": "array", "items": { "type": "string", "maxLength": 200 }, "maxItems": 30 },
    "fallbackDialogue": { "type": "string" },
    "memory": { "type": "object", "properties": { "maxNotes": { "type": "integer", "minimum": 0, "maximum": 5 } } }
  }
}
```

Kiểm thêm ngoài schema: `toolsAllow` ⊆ tên trong `AI_TOOLS` thật; `briefSections` ⊆ `brief-sections.json`; `status = 'approved'` bắt buộc có `reviewer` với persona tôn giáo (danh sách npc trong canon §4 trừ `gac_cong`, `tho_may`).

## A.13 SCHEMA-PERK-TABLE, SCHEMA-MAU-CHART

```json
{
  "$id": "hq/perk-table",
  "type": "object",
  "required": ["v", "perks"],
  "properties": {
    "v": { "type": "integer" },
    "perks": { "type": "array", "items": { "type": "object", "required": ["id", "engineKey", "name", "effects", "ios", "desc"],
      "additionalProperties": false, "properties": {
        "id": { "$ref": "common#/$defs/perkId" }, "engineKey": { "type": "string", "pattern": "^[a-zA-Z]+$" },
        "name": { "type": "string", "maxLength": 40 }, "ios": { "type": "boolean" }, "desc": { "type": "string" },
        "effects": { "type": "array", "maxItems": 4, "items": { "type": "object", "required": ["kind"], "oneOf": [
          { "properties": { "kind": { "const": "statMod" }, "stat": { "enum": ["examScore", "readSpeed", "walkSpeed", "npcAffinity", "socialGain"] },
                            "mul": { "type": "number", "minimum": 0.5, "maximum": 1.5 } }, "required": ["stat", "mul"] },
          { "properties": { "kind": { "const": "schoolMod" }, "mul": { "type": "number", "minimum": 0.8, "maximum": 1.2 } }, "required": ["mul"] },
          { "properties": { "kind": { "const": "dailyGift" }, "npcPool": { "type": "string" }, "chance": { "type": "number", "minimum": 0, "maximum": 1 } }, "required": ["chance"] },
          { "properties": { "kind": { "const": "hintFree" }, "when": { "enum": ["questStuck"] } }, "required": ["when"] },
          { "properties": { "kind": { "const": "dialogueBranch" }, "tag": { "type": "string" } }, "required": ["tag"] },
          { "properties": { "kind": { "const": "extraTrial" }, "questTag": { "type": "string" } }, "required": ["questTag"] },
          { "properties": { "kind": { "const": "karmaSoften" }, "mul": { "type": "number", "minimum": 0.3, "maximum": 1 } }, "required": ["mul"] }
        ] } } } } }
  }
}
```

```json
{
  "$id": "hq/mau-chart",
  "type": "object",
  "required": ["generatedAt", "engineV", "charts"],
  "properties": {
    "generatedAt": { "type": "string" }, "engineV": { "type": "string" },
    "charts": { "type": "array", "minItems": 6, "items": { "type": "object", "required": ["id", "input", "expect"], "properties": {
      "id": { "type": "string", "pattern": "^MAU-[A-Z]$" },
      "input": { "type": "object", "required": ["year", "month", "day", "hour", "minute", "gender", "refYear"] },
      "expect": { "type": "object", "required": ["tiemLuc", "phamCanIdx", "lop", "dung"] } } } }
  }
}
```

`id` dạng `MAU-x` là mã của canon §11 (không thuộc không gian tên riêng của tài liệu nào).
