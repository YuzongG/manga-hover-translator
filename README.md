# Manga Hover Translator (MVP)

最简版本：在网页中找到第一张大图，发送到本地后端，后端做 OCR（日文）+ 翻译（中文），最后在原图上悬浮显示。

## Project Structure

- `extension/` Chrome extension (Manifest v3)
- `server/` Node.js API (OCR + ja->zh translation)

## Quick Start

### 1) Start backend

```bash
cd server
npm install
npm start
```

Server runs on `http://localhost:8787`.

> 首次运行 OCR 会下载语言模型，可能稍慢。

### 2) Load extension

1. Open Chrome: `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** and select `extension/`

### 3) Test

1. Open any page with a large image (manga page)
2. Click extension icon
3. Hover cyan boxes to view Chinese text

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

## Notes

- 当前是最小实现，重点是“能跑通”而不是“最高识别率”。
- 漫画竖排字、拟声词、花体字会影响 OCR 效果。
- 下一步可做：行合并、气泡分组、缓存。
