chrome.action.onClicked.addListener(async (tab) => {
  if (!tab?.id) return;

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: async () => {
      // clean previous overlays
      document.querySelectorAll(".__mht_overlay_root").forEach((el) => el.remove());

      const imgs = [...document.querySelectorAll("img")];
      const target = imgs.find((img) => img.naturalWidth > 300 && img.naturalHeight > 300);
      if (!target) {
        alert("没找到可翻译图片");
        return;
      }

      const imageUrl = target.currentSrc || target.src;
      if (!imageUrl) {
        alert("图片地址不可用");
        return;
      }

      const resp = await fetch("http://localhost:8787/translate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl })
      });

      if (!resp.ok) {
        alert("翻译失败");
        return;
      }

      const data = await resp.json();
      const items = data?.items || [];

      const rect = target.getBoundingClientRect();
      const overlay = document.createElement("div");
      overlay.className = "__mht_overlay_root";
      overlay.style.position = "fixed";
      overlay.style.left = `${rect.left}px`;
      overlay.style.top = `${rect.top}px`;
      overlay.style.width = `${rect.width}px`;
      overlay.style.height = `${rect.height}px`;
      overlay.style.zIndex = "2147483647";
      overlay.style.pointerEvents = "none";
      document.body.appendChild(overlay);

      const sx = rect.width / target.naturalWidth;
      const sy = rect.height / target.naturalHeight;

      for (const it of items) {
        const [x1, y1, x2, y2] = it.box || [];
        if ([x1, y1, x2, y2].some((v) => typeof v !== "number")) continue;

        const box = document.createElement("div");
        box.style.position = "absolute";
        box.style.left = `${x1 * sx}px`;
        box.style.top = `${y1 * sy}px`;
        box.style.width = `${(x2 - x1) * sx}px`;
        box.style.height = `${(y2 - y1) * sy}px`;
        box.style.border = "1px solid #00e5ff";
        box.style.background = "rgba(0, 229, 255, 0.14)";
        box.style.pointerEvents = "auto";
        box.title = it.zh || "";
        overlay.appendChild(box);
      }

      alert(`翻译完成：${items.length} 个文本框（悬停蓝框查看中文）`);
    }
  });
});
