import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/translate-image", async (req, res) => {
  const { imageUrl } = req.body || {};
  if (!imageUrl) {
    return res.status(400).json({ error: "missing imageUrl" });
  }

  // TODO: replace this mock with real OCR + ja->zh translation
  return res.json({
    imageUrl,
    items: [
      { box: [100, 120, 280, 180], jp: "こんにちは", zh: "你好" },
      { box: [320, 220, 560, 300], jp: "行こう", zh: "走吧" }
    ]
  });
});

const port = process.env.PORT || 8787;
app.listen(port, () => {
  console.log(`server listening on http://localhost:${port}`);
});
