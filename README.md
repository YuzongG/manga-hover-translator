# Manga Hover Translator (MVP)

最简版本：在网页中找到第一张大图，发送到本地后端，返回文字框与中文翻译，并在原图上悬浮显示。

## Project Structure

- `extension/` Chrome extension (Manifest v3)
- `server/` Node.js API (currently mock translation)

## Quick Start

### 1) Start backend

```bash
cd server
npm install
npm start
```

Server runs on `http://localhost:8787`.

### 2) Load extension

1. Open Chrome: `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** and select `extension/`

### 3) Test

1. Open any page with a large image (manga page)
2. Click extension icon
3. Hover cyan boxes to view Chinese text

## Current Status

- ✅ End-to-end flow works
- ✅ Hover overlay works
- 🔜 OCR + real ja->zh translation (replace mock in `server/index.js`)

## API

### `POST /translate-image`

Request:

```json
{ "imageUrl": "https://..." }
```

Response:

```json
{
  "items": [
    { "box": [100, 120, 280, 180], "jp": "こんにちは", "zh": "你好" }
  ]
}
```
