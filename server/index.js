import express from "express";
import cors from "cors";
import { createWorker } from "tesseract.js";
import { translate } from "@vitalets/google-translate-api";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

async function ocrJapaneseFromImageUrl(imageUrl) {
  const worker = await createWorker("jpn+eng");
  try {
    const {
      data: { lines }
    } = await worker.recognize(imageUrl);

    // map OCR lines to API response shape
    return (lines || [])
      .map((line) => {
        const text = (line.text || "").trim();
        if (!text) return null;
        const { x0, y0, x1, y1 } = line.bbox || {};
        if ([x0, y0, x1, y1].some((v) => typeof v !== "number")) return null;
        return {
          jp: text,
          box: [x0, y0, x1, y1]
        };
      })
      .filter(Boolean);
  } finally {
    await worker.terminate();
  }
}

async function translateJaToZh(text) {
  if (!text) return "";
  try {
    const result = await translate(text, { from: "ja", to: "zh-CN" });
    return result.text || "";
  } catch {
    // fallback: keep original text when translation fails
    return text;
  }
}

app.post("/translate-image", async (req, res) => {
  try {
    const { imageUrl } = req.body || {};
    if (!imageUrl) {
      return res.status(400).json({ error: "missing imageUrl" });
    }

    const ocrItems = await ocrJapaneseFromImageUrl(imageUrl);

    const items = [];
    for (const it of ocrItems) {
      const zh = await translateJaToZh(it.jp);
      items.push({ ...it, zh });
    }

    return res.json({ imageUrl, items });
  } catch (error) {
    console.error("translate-image error:", error);
    return res.status(500).json({ error: "translate failed" });
  }
});

const port = process.env.PORT || 8787;
app.listen(port, () => {
  console.log(`server listening on http://localhost:${port}`);
});
