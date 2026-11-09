# 13.17 · Phụ lục B — JSON Schema chuẩn (thế giới, máy chủ, tài sản, vận hành)

> Tiếp phụ lục A (phần 16), cùng quy ước: draft 2020-12, tập con của `mini-schema`, `common#/$defs/*` ở A.1. Schema ở đây là chuẩn khi lệch với ví dụ trong phần 04, 06, 07, 08, 09, 10, 11, 15.

## B.1 SCHEMA-BUILDING, SCHEMA-CELL, SCHEMA-PORTAL, SCHEMA-DOOR

```json
{
  "$id": "hq/building",
  "type": "object",
  "required": ["id", "name", "class", "region", "shell", "cells", "portals", "floors", "loadRadius", "unloadRadius", "budget"],
  "additionalProperties": false,
  "properties": {
    "id": { "$ref": "common#/$defs/bldId" },
    "name": { "type": "string", "maxLength": 60 },
    "class": { "enum": ["A", "B", "C", "D", "E"] },
    "region": { "$ref": "common#/$defs/regionId" },
    "shell": { "type": "object", "required": ["model", "fit", "at"], "properties": {
      "model": { "type": "string", "pattern": "^[a-z0-9_]{2,48}$" },
      "fit": { "type": "object", "minProperties": 1, "maxProperties": 1, "properties": {
        "height": { "type": "number", "exclusiveMinimum": 0 }, "width": { "type": "number", "exclusiveMinimum": 0 },
        "depth": { "type": "number", "exclusiveMinimum": 0 }, "max": { "type": "number", "exclusiveMinimum": 0 } } },
      "at": { "type": "object", "required": ["x", "y", "z"], "properties": { "x": { "type": "number" }, "y": { "type": "number" }, "z": { "type": "number" }, "ry": { "type": "number" } } },
      "instanced": { "type": "boolean" } } },
    "interior": { "type": ["string", "null"], "pattern": "^INT-BLD-[a-z]+-[0-9]{2}$" },
    "collision": { "type": ["string", "null"], "pattern": "^col/BLD-[a-z]+-[0-9]{2}\\.(json|bin)$" },
    "cells": { "type": "array", "maxItems": 24, "items": { "$ref": "#/$defs/cell" } },
    "portals": { "type": "array", "maxItems": 48, "items": { "$ref": "#/$defs/portal" } },
    "doors": { "type": "array", "maxItems": 16, "items": { "$ref": "#/$defs/door" } },
    "floors": { "type": "array", "minItems": 1, "maxItems": 6, "items": { "type": "object", "required": ["n", "y"], "properties": {
      "n": { "type": "integer", "minimum": 1, "maximum": 6 }, "y": { "type": "number" } } } },
    "stairs": { "type": "array", "items": { "type": "object", "required": ["id", "from", "to", "poly", "axis"], "properties": {
      "id": { "type": "string" }, "from": { "type": "integer" }, "to": { "type": "integer" },
      "poly": { "$ref": "common#/$defs/poly2" }, "axis": { "enum": ["x+", "x-", "z+", "z-"] } } } },
    "stations": { "type": "array", "items": { "type": "string" } },
    "npcs": { "type": "array", "items": { "type": "object", "required": ["npc", "cell", "at"], "properties": {
      "npc": { "$ref": "common#/$defs/npcId" }, "cell": { "type": "string" }, "at": { "$ref": "common#/$defs/xz" },
      "schedule": { "enum": ["day", "night", "always", "ritual"] } } } },
    "lights": { "type": "array", "maxItems": 64, "items": { "type": "object", "required": ["cell", "at", "power", "kind"], "properties": {
      "cell": { "type": "string" }, "at": { "$ref": "common#/$defs/xyz" }, "color": { "type": "string", "pattern": "^#[0-9a-fA-F]{6}$" },
      "power": { "type": "number", "minimum": 0.1, "maximum": 3 }, "kind": { "enum": ["candle", "butterlamp", "lantern", "brazier", "window"] } } } },
    "loadRadius": { "type": "number", "minimum": 20, "maximum": 150 },
    "unloadRadius": { "type": "number", "minimum": 30, "maximum": 200 },
    "budget": { "type": "object", "required": ["drawCalls", "tris", "lights"], "properties": {
      "drawCalls": { "type": "integer", "minimum": 0, "maximum": 120 }, "tris": { "type": "integer", "minimum": 0, "maximum": 400000 },
      "lights": { "type": "integer", "minimum": 0, "maximum": 6 } } },
    "dod": { "type": "object", "properties": { "photos": { "type": "string" }, "status": { "enum": ["todo", "wip", "review", "done"] } } }
  },
  "$defs": {
    "cell": { "type": "object", "required": ["id", "floor", "poly", "yMin", "yMax"], "additionalProperties": false, "properties": {
      "id": { "type": "string", "pattern": "^c[0-9a-z_]{1,8}$" }, "name": { "type": "string", "maxLength": 40 },
      "floor": { "type": "integer", "minimum": 1, "maximum": 6 }, "poly": { "$ref": "common#/$defs/poly2" },
      "yMin": { "type": "number" }, "yMax": { "type": "number" },
      "ambient": { "type": "number", "minimum": 0, "maximum": 1 },
      "camera": { "type": "object", "properties": { "maxDist": { "type": "number", "minimum": 2, "maximum": 30 },
        "pitch": { "type": "array", "items": { "type": "number" }, "minItems": 2, "maxItems": 2 } } } } },
    "portal": { "type": "object", "required": ["id", "a", "b", "quad"], "additionalProperties": false, "properties": {
      "id": { "type": "string" }, "a": { "type": "string" }, "b": { "type": "string" },
      "quad": { "type": "array", "items": { "$ref": "common#/$defs/xyz" }, "minItems": 4, "maxItems": 4 },
      "door": { "type": ["string", "null"] }, "virtual": { "type": "boolean" }, "glass": { "type": "boolean" } } },
    "door": { "type": "object", "required": ["id", "hinge", "openAngle", "trigger"], "additionalProperties": false, "properties": {
      "id": { "type": "string" }, "mesh": { "type": ["string", "null"], "pattern": "^__door_[a-z0-9]+$" },
      "hinge": { "type": "array", "items": { "$ref": "common#/$defs/xz" }, "minItems": 1, "maxItems": 2 },
      "openAngle": { "type": "number", "minimum": 0.3, "maximum": 3.1 },
      "trigger": { "type": "number", "minimum": 1, "maximum": 8 },
      "schedule": { "oneOf": [ { "type": "null" }, { "type": "object", "required": ["open", "close"], "properties": {
        "open": { "$ref": "common#/$defs/shichen" }, "close": { "$ref": "common#/$defs/shichen" } } } ] },
      "sideDoor": { "type": ["string", "null"] }, "locked": { "$ref": "hq/cond" } } }
  }
}
```

Kiểm ngoài schema (`validate-buildings`): ô lồi và ngược chiều kim đồng hồ; `unloadRadius > loadRadius`; cổng nằm trên cạnh chung hai ô (≤ 0,2 m); `stations` có trong `STATIONS`; mỗi `lights[].cell` là id ô có thật; hạng A có ≥ 3 tương tác.

## B.2 SCHEMA-INTERIOR-KIT, SCHEMA-INTERIOR-LAYOUT

```json
{
  "$id": "hq/interior-kit",
  "type": "object",
  "required": ["kit", "grid", "palette", "modules"],
  "properties": {
    "kit": { "enum": ["dao-bac", "dao-giangnam", "chua-viet", "tang", "nho", "mieu", "amty"] },
    "grid": { "const": 3.2 },
    "palette": { "type": "string" },
    "atlas": { "type": "string" },
    "modules": { "type": "array", "minItems": 1, "items": { "type": "object", "required": ["id", "name", "asset", "snap", "size", "col", "tris"],
      "additionalProperties": false, "properties": {
        "id": { "$ref": "common#/$defs/modId" }, "name": { "type": "string", "maxLength": 60 },
        "asset": { "type": "string", "pattern": "^mod_[a-z]+_[0-9]{2}[a-z]?$" },
        "snap": { "enum": ["corner", "bay", "edge", "free"] },
        "size": { "$ref": "common#/$defs/xyz" },
        "col": { "type": "string", "pattern": "^(none|bake|circle:[0-9.]+|rect:[0-9.]+,[0-9.]+)$" },
        "lights": { "type": "array", "items": { "type": "object" } },
        "tris": { "type": "integer", "minimum": 1, "maximum": 6000 },
        "variants": { "type": "array", "items": { "$ref": "common#/$defs/modId" } },
        "required": { "type": "array", "items": { "enum": ["A", "B", "C"] } } } } }
  }
}
```

`required` liệt kê hạng công trình bắt buộc phải có mô-đun này (vd bàn thờ cho hạng A ở bộ `chua-viet`).

```json
{
  "$id": "hq/interior-layout",
  "type": "object",
  "required": ["id", "building", "kit", "origin", "items"],
  "additionalProperties": false,
  "properties": {
    "id": { "type": "string", "pattern": "^INT-BLD-[a-z]+-[0-9]{2}$" },
    "building": { "$ref": "common#/$defs/bldId" },
    "kit": { "type": "string" },
    "origin": { "$ref": "common#/$defs/xz" },
    "items": { "type": "array", "maxItems": 600, "items": { "oneOf": [
      { "type": "object", "required": ["mod", "g", "floor", "rot"], "additionalProperties": false, "properties": {
          "mod": { "$ref": "common#/$defs/modId" }, "g": { "type": "array", "items": { "type": "integer", "minimum": -40, "maximum": 40 }, "minItems": 2, "maxItems": 2 },
          "floor": { "type": "integer", "minimum": 1, "maximum": 6 }, "rot": { "enum": [0, 1, 2, 3] }, "cell": { "type": "string" } } },
      { "type": "object", "required": ["prop", "at", "floor"], "additionalProperties": false, "properties": {
          "prop": { "type": "string", "pattern": "^prop_[a-z0-9_]{2,40}$" }, "at": { "$ref": "common#/$defs/xz" },
          "floor": { "type": "integer", "minimum": 1, "maximum": 6 }, "rot": { "type": "number" },
          "station": { "type": "string" }, "cell": { "type": "string" } } }
    ] } }
  }
}
```

## B.3 SCHEMA-COLLISION-BAKE

```json
{
  "$id": "hq/collision-bake",
  "type": "object",
  "required": ["id", "v", "srcHash", "cell", "origin", "w", "h", "layers"],
  "additionalProperties": false,
  "properties": {
    "id": { "type": "string" },
    "v": { "type": "integer", "minimum": 1 },
    "srcHash": { "type": "string", "pattern": "^[0-9a-f]{8,64}$" },
    "cell": { "const": 0.5 },
    "origin": { "$ref": "common#/$defs/xz" },
    "w": { "type": "integer", "minimum": 1, "maximum": 4096 },
    "h": { "type": "integer", "minimum": 1, "maximum": 4096 },
    "layers": { "type": "array", "minItems": 1, "maxItems": 6, "items": { "type": "object", "required": ["layer", "y0", "rle"], "properties": {
      "layer": { "type": "integer", "minimum": 0, "maximum": 5 }, "y0": { "type": "number" },
      "rle": { "type": "string", "pattern": "^[A-Za-z0-9+/=]*$" } } } },
    "platforms": { "type": "array", "items": { "type": "object", "required": ["x", "z", "w", "d", "ry", "top", "layer"] } },
    "ramps": { "type": "array", "items": { "type": "object", "required": ["x", "z", "w", "d", "ry", "top0", "top1", "from", "to"] } },
    "doors": { "type": "object", "additionalProperties": { "type": "object", "required": ["layer", "cells"] } }
  }
}
```

**Mã hóa `rle`:** duyệt lưới theo hàng (z tăng), trong hàng theo x tăng; chuỗi số nguyên không âm xen kẽ «số ô trống», «số ô đặc», bắt đầu bằng ô trống (có thể 0); mỗi số ghi dạng varint LEB128 không dấu; mảng byte rồi base64. Giải mã O(w × h). Lưới 104 × 96 của Chính Đường (phần 06 §7.2) với ~30% ô đặc dạng tường liền ước tính ≤ 4 KB sau mã hóa.

## B.4 SCHEMA-REGION-MANIFEST, SCHEMA-STREAM-CELL, SCHEMA-NAVGRAPH

```json
{
  "$id": "hq/region-manifest",
  "type": "object",
  "required": ["id", "name", "center", "radius", "buildings", "roads", "budget"],
  "additionalProperties": false,
  "properties": {
    "id": { "$ref": "common#/$defs/regionId" },
    "name": { "type": "string", "maxLength": 80 },
    "center": { "$ref": "common#/$defs/xz" },
    "radius": { "type": "number", "minimum": 40, "maximum": 400 },
    "unlock": { "$ref": "hq/cond" },
    "buildings": { "type": "array", "items": { "$ref": "common#/$defs/bldId" } },
    "pois": { "type": "array", "items": { "$ref": "common#/$defs/poiId" } },
    "props": { "type": "string" },
    "roads": { "type": "array", "items": { "type": "array", "items": { "$ref": "common#/$defs/xz" }, "minItems": 2 } },
    "audio": { "type": "string", "pattern": "^BGM-[a-z]+$" },
    "palette": { "type": "string" },
    "skyline": { "type": "string", "pattern": "^far/[a-z]+\\.glb$" },
    "budget": { "type": "object", "required": ["drawCalls", "tris", "texMB"], "properties": {
      "drawCalls": { "type": "integer", "maximum": 250 }, "tris": { "type": "integer", "maximum": 600000 }, "texMB": { "type": "number", "maximum": 180 } } }
  }
}
```

`budget` của vùng bị chặn trên bởi ngân sách mid toàn khung (phần 09 §2.1).

```json
{
  "$id": "hq/stream-cell",
  "type": "object",
  "required": ["c", "v", "bytes", "buildings", "col", "nav"],
  "additionalProperties": false,
  "properties": {
    "c": { "type": "array", "items": { "type": "integer", "minimum": 0, "maximum": 17 }, "minItems": 2, "maxItems": 2 },
    "v": { "type": "integer", "minimum": 1 },
    "region": { "oneOf": [ { "type": "null" }, { "$ref": "common#/$defs/regionId" } ] },
    "bytes": { "type": "object", "required": ["near", "mid", "far"], "properties": {
      "near": { "type": "integer", "minimum": 0 }, "mid": { "type": "integer", "minimum": 0 }, "far": { "type": "integer", "minimum": 0 } } },
    "buildings": { "type": "array", "items": { "$ref": "common#/$defs/bldId" } },
    "spots": { "type": "array", "items": { "type": "object", "required": ["id", "fn"] } },
    "props": { "type": "array", "items": { "type": "object", "required": ["asset", "n"] } },
    "col": { "type": "array", "items": { "type": "string" } },
    "nav": { "type": "string", "pattern": "^nav/[0-9]{1,2}_[0-9]{1,2}\\.json$" },
    "npc": { "type": "array", "items": { "$ref": "common#/$defs/npcId" } },
    "audioZones": { "type": "array", "items": { "type": "object", "required": ["poly", "bgm"] } }
  }
}
```

```json
{
  "$id": "hq/navgraph",
  "type": "object",
  "required": ["c", "nodes", "edges", "links"],
  "properties": {
    "c": { "type": "array", "items": { "type": "integer" }, "minItems": 2, "maxItems": 2 },
    "nodes": { "type": "array", "maxItems": 400, "items": { "type": "object", "required": ["id", "x", "z", "tag"], "properties": {
      "id": { "type": "string", "pattern": "^n[0-9]{1,2}_[0-9]{1,2}_[0-9]{1,4}$" }, "x": { "type": "number" }, "z": { "type": "number" },
      "tag": { "enum": ["road", "gate", "ferry", "portal", "stair"] }, "bld": { "$ref": "common#/$defs/bldId" } } } },
    "edges": { "type": "array", "items": { "type": "object", "required": ["a", "b", "len", "kind"], "properties": {
      "a": { "type": "string" }, "b": { "type": "string" }, "len": { "type": "number", "exclusiveMinimum": 0 },
      "kind": { "enum": ["road", "path", "bridge", "stairs", "ferry"] } } } },
    "links": { "type": "array", "items": { "type": "object", "required": ["a", "cell", "b"] } }
  }
}
```

## B.5 SCHEMA-TOKEN (payload), SCHEMA-CLOUDSAVE

```json
{
  "$id": "hq/token-payload",
  "type": "object",
  "required": ["sub", "dev", "iat", "exp", "scp", "kv"],
  "additionalProperties": false,
  "properties": {
    "sub": { "type": "string", "pattern": "^acc_[0-9A-HJKMNP-TV-Z]{26}$" },
    "dev": { "type": "string", "pattern": "^[0-9a-f]{8}$" },
    "iat": { "type": "integer" }, "exp": { "type": "integer" },
    "scp": { "type": "array", "items": { "enum": ["vault", "ai", "mmo", "tb", "sect", "pay"] }, "minItems": 1 },
    "kv": { "type": "integer", "minimum": 1 }
  }
}
```

```json
{
  "$id": "hq/cloudsave",
  "type": "object",
  "required": ["v", "rev", "baseRev", "dev", "savedAt", "contentV", "engineV", "birth", "data", "hash"],
  "additionalProperties": false,
  "properties": {
    "v": { "const": 2 },
    "rev": { "type": "integer", "minimum": 1 }, "baseRev": { "type": "integer", "minimum": 0 },
    "dev": { "type": "string", "pattern": "^[0-9a-f]{8}$" },
    "savedAt": { "$ref": "common#/$defs/epochMs" },
    "contentV": { "type": "string", "pattern": "^q:[0-9]{4}\\.[0-9]{1,2}\\.[0-9]+$" },
    "engineV": { "type": "string" },
    "birth": { "enum": ["excluded", "included"] },
    "data": { "$ref": "hq/save-v2" },
    "hash": { "type": "string", "pattern": "^[0-9a-f]{64}$" }
  }
}
```

Kiểm ngoài schema (máy chủ): `birth = 'excluded'` ⇒ `data.player.birth` vắng và mọi `data.profiles[]` không có `year/month/day/hour/minute`; kích thước thân ≤ 300 KB; `hash` khớp.

## B.6 SCHEMA-ENTITLEMENT, SCHEMA-SKU-SERVER

```json
{
  "$id": "hq/entitlement",
  "type": "object",
  "required": ["id", "sku", "kind", "src", "tx", "granted", "revoked"],
  "additionalProperties": false,
  "properties": {
    "id": { "type": "string", "pattern": "^ent_[0-9A-HJKMNP-TV-Z]{26}$" },
    "sku": { "type": "string", "pattern": "^SKU-[A-Za-z0-9-]{1,40}$" },
    "kind": { "enum": ["cosmetic", "vip", "utility", "season", "ngoc"] },
    "src": { "enum": ["apple", "stripe", "vnpay", "grant", "earn"] },
    "tx": { "type": "string", "maxLength": 100 },
    "granted": { "type": "integer" },
    "expires": { "type": ["integer", "null"] },
    "revoked": { "enum": [0, 1] },
    "meta": { "type": "object" }
  }
}
```

```json
{
  "$id": "hq/sku-server",
  "type": "object",
  "required": ["id", "kind", "price", "store", "grants"],
  "additionalProperties": false,
  "properties": {
    "id": { "type": "string", "pattern": "^SKU-[A-Za-z0-9-]{1,40}$" },
    "kind": { "enum": ["cosmetic", "vip", "utility", "season", "ngoc"] },
    "price": { "type": "object", "properties": { "vnd": { "type": "integer", "minimum": 1000 }, "usd": { "type": "number", "minimum": 0.49 } } },
    "store": { "type": "object", "properties": {
      "apple": { "type": "string", "pattern": "^[a-z0-9.]{3,100}$" }, "stripe": { "type": "string" }, "vnpay": { "type": "boolean" } } },
    "grants": { "type": "object", "additionalProperties": false, "minProperties": 1, "properties": {
      "items": { "type": "array", "items": { "type": "string", "pattern": "^[a-z0-9_]{2,32}$" } },
      "ngoc": { "type": "integer", "minimum": 0, "maximum": 100000 },
      "vipDays": { "type": "integer", "minimum": 0, "maximum": 366 },
      "aiTurns": { "type": "integer", "minimum": 0, "maximum": 1000 },
      "profileSlots": { "type": "integer", "minimum": 0, "maximum": 20 },
      "seasonPass": { "type": ["string", "null"], "pattern": "^SEASON-[0-9]{2}$" },
      "homeDecor": { "type": "array", "items": { "type": "string" } } } }
  }
}
```

`grants` dùng `additionalProperties: false`: không thể thêm khóa «daoHanh», «realm», «merit», «quest» mà không sửa schema — chính là hàng rào trụ cột T6 ở mức dữ liệu.

## B.7 SCHEMA-MSG-V2 (giao thức MMO v2)

Mỗi gói là một object JSON có `t`. Bảng tóm tắt; schema đầy đủ của từng gói nằm trong `src/game/protocol.js › parseClient` (client → máy chủ) và kiểm bằng `test-quan-v2`.

| Hướng | `t` | Trường (kiểu, giới hạn) | Ghi chú |
|---|---|---|---|
| C→S | `hello` | `name` (≤ 24), `robe` (wx), `acc` (wx \| ''), `cos` (≤ 240), `look` (`hero_m`\|`hero_f`), `title` (≤ 24), `pid` (`[a-z0-9-]{8,40}`), `tok` (token, ≤ 600), `region` (regionId), `cv` (contentV), `phai` (tùy chọn) | gói đầu tiên; thiếu `cv` → `err upgrade` |
| C→S | `mv` | `x`, `y` (ô, trong `WORLD_TILES` mới), `h` (rad), `s` (0/1), `a` (0–420) | ≤ 10/s |
| C→S | `cos` | `c` (≤ 240, `cleanCos`) | ≤ 1/5 s |
| C→S | `emo` | `e` (khóa `EMOTES`), `to` (id ≤ 16, tùy chọn) | ≤ 1/2 s |
| C→S | `say` | `k` (khóa `PHRASES`) | ≤ 1/2 s |
| C→S | `sit` / `stand` | — | |
| C→S | `report` | `id` (≤ 16), `why` (khóa `REPORT_REASONS`) | ≤ 5/phút |
| C→S | `solve` | `slot` (0–2), `date` (`YYYY-MM-DD`), `ans` (object ≤ 1 KB) | cần `tok` |
| C→S | `inv` / `inv_ok` / `inv_no` | `to` / `coop` (≤ 16) | |
| C→S | `coop_start` / `coop_leave` | — | |
| C→S | `coop_ans` | `step` (0–5), `ans`, `hints` (int) | |
| S→C | `welcome` | `v` (2), `you`, `room`, `region`, `now` (ms), `aoi` (120), `players[]` (trong AOI), `seats[]`, `renamed?` | |
| S→C | `join` / `leave` | `p` (pub) / `id` | theo AOI |
| S→C | `mvb` | `p: [[id, x, y, h, s, a], …]` | 8 Hz, chỉ người trong AOI đã đổi |
| S→C | `cos`, `emo`, `say` | như v1, chỉ trong AOI (trừ `count`) | |
| S→C | `count` | `n` (cả phòng) | |
| S→C | `seat` / `seats` | `i` / `taken[]` | |
| S→C | `graded` | `slot`, `total`, `results`, `points`, `rcpt` (SCHEMA-RECEIPT) | trả lời `solve` |
| S→C | `rite` | `id`, `phase` (`open`\|`close`), `rcpt?` | lễ tập thể |
| S→C | `bell` | `kind` (`chuong`\|`trong`), `at` | cả vùng nghe |
| S→C | `coop`, `coop_step`, `coop_done`, `coop_end` | như khai báo P3 trong `protocol.js` | |
| S→C | `err` | `m` (`upgrade`\|`auth`\|`bad`) | |
| S→C | `full` | `room` | đóng 4001 |

## B.8 SCHEMA-EVENT

```json
{
  "$id": "hq/event-batch",
  "type": "object",
  "required": ["s", "p", "av", "cv", "q", "e"],
  "additionalProperties": false,
  "properties": {
    "s": { "type": "string", "pattern": "^sess_[0-9a-z]{4,16}$" },
    "p": { "enum": ["web", "ios"] },
    "av": { "type": "string", "maxLength": 40 },
    "cv": { "type": "string", "maxLength": 24 },
    "q": { "enum": ["low", "mid", "high"] },
    "e": { "type": "array", "minItems": 1, "maxItems": 50, "items": { "type": "object", "required": ["n", "t"], "additionalProperties": false, "properties": {
      "n": { "enum": ["session_start", "session_end", "gate_done", "quest_start", "quest_end", "node_stuck", "deed", "milestone", "realm_up",
                      "menhdo_layer", "ai_turn", "ai_quota", "ai_filter", "crisis_shown", "case_graded", "perf", "stream_stall", "err", "purchase",
                      "consent", "mmo", "tb_view"] },
      "t": { "$ref": "common#/$defs/epochMs" },
      "k": { "type": "object", "maxProperties": 6, "additionalProperties": { "type": "string", "maxLength": 48, "pattern": "^[A-Za-z0-9_:.+-]*$" } },
      "v": { "type": "array", "maxItems": 5, "items": { "type": "number" } } } } }
  }
}
```

`k` chỉ nhận chuỗi ngắn theo mẫu không có khoảng trắng và dấu tiếng Việt → không chứa được câu văn người chơi nhập (rào chắn quyền riêng tư ở mức schema). Máy chủ bổ sung `band`/`lop` từ dữ liệu đồng ý (không tin client) — client gửi `band`/`lop` trong `k` của `gate_done` chỉ khi `consent.analytics = true`, máy chủ kiểm lại đồng ý trong `PlayerVault` trước khi ghi.

## B.9 SCHEMA-REMOTE-CONFIG

```json
{
  "$id": "hq/remote-config",
  "type": "object",
  "required": ["v", "minClient", "features"],
  "additionalProperties": false,
  "properties": {
    "v": { "type": "integer", "minimum": 1 },
    "minClient": { "type": "string", "maxLength": 40 },
    "features": { "type": "object", "additionalProperties": false, "properties": {
      "mmo": { "type": "boolean" }, "ai": { "type": "boolean" }, "cloudSave": { "type": "boolean" },
      "tb": { "type": "boolean" }, "sect": { "type": "boolean" }, "pay": { "type": "boolean" } } },
    "quests": { "type": "object", "properties": { "off": { "type": "array", "items": { "$ref": "common#/$defs/questId" }, "maxItems": 200 } } },
    "personas": { "type": "object", "properties": { "off": { "type": "array", "items": { "$ref": "common#/$defs/personaId" } } } },
    "aiQuota": { "type": "object", "properties": { "free": { "type": "integer", "minimum": 0, "maximum": 10 }, "vip": { "type": "integer", "minimum": 0, "maximum": 30 } } },
    "notice": { "oneOf": [ { "type": "null" }, { "type": "object", "required": ["key", "until"], "properties": {
      "key": { "$ref": "common#/$defs/textKey" }, "until": { "$ref": "common#/$defs/epochMs" } } } ] }
  }
}
```

`aiQuota` có `maximum` bằng giá trị gốc (10/30): cấu hình từ xa chỉ được **giảm** (phần 15 §6.3). Client áp `features[k] && localFeature[k]` (không bật được thứ bản build không có).

## B.10 SCHEMA-PERF-REPORT

```json
{
  "$id": "hq/perf-report",
  "type": "object",
  "required": ["scene", "quality", "at", "build", "device", "frames", "render"],
  "properties": {
    "scene": { "type": "string", "pattern": "^S[0-9]{1,2}(-[a-z]+)?$" },
    "quality": { "enum": ["low", "mid", "high"] },
    "at": { "type": "string" },
    "build": { "type": "object", "required": ["app", "git"] },
    "device": { "type": "object", "required": ["ua", "dpr", "w", "h", "class"], "properties": { "class": { "enum": ["low", "mid", "high", "ci"] } } },
    "frames": { "type": "object", "required": ["n", "fpsP50", "msP95"], "properties": {
      "n": { "type": "integer", "minimum": 1 }, "fpsP50": { "type": "number" }, "fpsP05": { "type": "number" },
      "msP95": { "type": "number" }, "msMax": { "type": "number" }, "longTasks": { "type": "integer" } } },
    "render": { "type": "object", "required": ["calls", "triangles", "textures", "programs"], "properties": {
      "calls": { "type": "integer" }, "triangles": { "type": "integer" }, "geometries": { "type": "integer" },
      "textures": { "type": "integer" }, "programs": { "type": "integer" } } },
    "memory": { "type": "object" },
    "stream": { "type": "object" },
    "notes": { "type": "string" }
  }
}
```

Với `device.class = 'ci'` (SwiftShader), `frames` được ghi nhưng **không** dùng để so mốc (phần 09 §6.1).

## B.11 SCHEMA-ASSET, SCHEMA-LICENSE

```json
{
  "$id": "hq/asset",
  "type": "object",
  "required": ["id", "kind", "layer", "source", "status"],
  "properties": {
    "id": { "type": "string", "pattern": "^[a-z0-9_]{2,48}$" },
    "kind": { "enum": ["static", "character"] },
    "layer": { "enum": ["shell", "module", "prop", "character", "deity", "nature", "far", "legacy"] },
    "bld": { "$ref": "common#/$defs/bldId" },
    "region": { "$ref": "common#/$defs/regionId" },
    "source": { "enum": ["meshy", "library-cc0", "handmade"] },
    "model": { "type": "string" },
    "poly": { "type": "integer", "minimum": 100, "maximum": 300000 },
    "hd": { "type": "boolean" },
    "prompt": { "type": "string", "maxLength": 800 },
    "style": { "type": "boolean" },
    "anims": { "type": "array", "items": { "type": "integer", "minimum": 0 } },
    "height": { "type": "number" },
    "sizeTarget": { "type": "object", "minProperties": 1, "maxProperties": 1 },
    "status": { "enum": ["draft", "preview", "approved", "rejected", "packed"] },
    "review": { "type": "object", "properties": { "art": { "type": ["string", "null"] }, "advisor": { "type": ["string", "null"] }, "noText": { "type": "boolean" } } },
    "credits": { "type": "object", "properties": { "preview": { "type": "integer" }, "refine": { "type": "integer" }, "rig": { "type": "integer" },
      "anim": { "type": "integer" }, "remesh": { "type": "integer" } } },
    "notes": { "type": "string" }
  }
}
```

Tương thích ngược: 31 mục hiện có trong `assets-meshy/manifest.json` chưa có `layer`, `source`, `status` → TASK-147/TASK-146 thêm (`layer: 'legacy'` cho mô hình cũ không thuộc lớp mới).

```json
{
  "$id": "hq/license",
  "type": "object",
  "additionalProperties": { "type": "object", "required": ["source", "license", "derived"], "properties": {
    "source": { "enum": ["meshy", "library-cc0", "handmade"] },
    "title": { "type": "string" }, "page": { "type": "string" },
    "license": { "enum": ["CC0-1.0", "meshy-output", "inhouse"] },
    "retrieved": { "type": "string" }, "created": { "type": "string" }, "account": { "type": "string" },
    "plan": { "type": "string" }, "evidence": { "type": "string" },
    "taskIds": { "type": "object" },
    "derived": { "type": "array", "items": { "type": "string" }, "minItems": 1 } } }
}
```

## B.12 SCHEMA-CONTENT-INDEX, SCHEMA-EXPLAIN, SCHEMA-GAMECTX

```json
{
  "$id": "hq/content-index",
  "type": "object",
  "required": ["generatedAt", "ids", "errors", "warnings"],
  "properties": {
    "generatedAt": { "type": "string" },
    "ids": { "type": "object", "additionalProperties": { "type": "object", "required": ["ns", "owner", "defined", "referenced", "data"], "properties": {
      "ns": { "type": "string" }, "owner": { "type": "string", "pattern": "^[0-9]{2}$" },
      "defined": { "type": "array", "items": { "type": "string" } }, "referenced": { "type": "array", "items": { "type": "string" } },
      "data": { "type": "array", "items": { "type": "string" } }, "milestone": { "type": ["string", "null"], "pattern": "^M[0-6]$" } } } },
    "errors": { "type": "array", "items": { "type": "object", "required": ["code", "id"], "properties": {
      "code": { "enum": ["UNDEFINED", "DUP_DEF", "WRONG_NS", "NO_DATA_AT_MILESTONE"] } } } },
    "warnings": { "type": "array" }
  }
}
```

```json
{
  "$id": "hq/explain",
  "type": "object",
  "required": ["stat", "title", "lines", "src"],
  "additionalProperties": false,
  "properties": {
    "stat": { "enum": ["tiemLuc", "phamCan", "phucPhan", "nguHanh", "thanLuc", "thienMenh", "nguDuy", "menhCach", "menhCap", "nguyenKhi", "tucNghiep", "thoiVan"] },
    "title": { "type": "string", "maxLength": 80 },
    "lines": { "type": "array", "minItems": 1, "maxItems": 30, "items": { "type": "object", "required": ["sign", "text"], "properties": {
      "sign": { "enum": [-1, 0, 1] }, "text": { "type": "string", "maxLength": 240 } } } },
    "src": { "type": "string" },
    "note": { "type": "string" }
  }
}
```

SCHEMA-GAMECTX là **chuỗi** ≤ 600 ký tự (không có schema JSON); phần đi kèm là đối tượng `allow`:

```json
{
  "$id": "hq/gamectx-allow",
  "type": "object",
  "required": ["quests", "items", "places", "titles"],
  "additionalProperties": false,
  "properties": {
    "quests": { "type": "array", "items": { "type": "string", "maxLength": 80 }, "maxItems": 200 },
    "items": { "type": "array", "items": { "type": "string", "maxLength": 60 }, "maxItems": 200 },
    "places": { "type": "array", "items": { "type": "string", "maxLength": 80 }, "maxItems": 100 },
    "titles": { "type": "array", "items": { "type": "string", "maxLength": 40 }, "maxItems": 50 }
  }
}
```
