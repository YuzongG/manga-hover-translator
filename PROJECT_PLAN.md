# Manga Hover Translator — Task List & Daily Plan

目标：逐步接近 Immersive Translate 的“可用体验”，但严格控制每日 token 消耗，按小步提交（small commits）推进。

## Working Rules

1. 每天只做一个明确主题（不跨太多模块）。
2. 每天 1~3 个小 commit，避免大改。
3. 每天都要有可复现测试结果（命令 + 结果摘要）。
4. 如果当天 token 紧张，优先：测试与修 bug > 新功能。
5. 不做“看起来高级但不可验证”的改动。

---

## Milestone Breakdown

### M0 (已完成)
- [x] Chrome 扩展骨架（点击翻译）
- [x] 后端接口 `/translate-image`
- [x] 悬浮框基础显示

### M1 识别质量基线（本周重点）
- [ ] T1: 日文文本过滤（仅保留日文字符占比高的框）
- [ ] T2: OCR 结果清洗（去噪、去超短乱码）
- [ ] T3: 相邻文本框合并（行/气泡级）
- [ ] T4: 翻译前后日志统计（框数、过滤率、耗时）

### M2 可读性与交互
- [ ] T5: 右侧译文列表面板（不依赖 hover）
- [ ] T6: 点击框高亮并定位对应译文
- [ ] T7: 一键清除覆盖层

### M3 站点适配（先 1~2 个站）
- [ ] T8: 阅读器主图定位器（替代“第一张大图”）
- [ ] T9: MangaDex 适配（示例）
- [ ] T10: Pixiv Manga 适配（示例）

### M4 性能与稳定
- [ ] T11: 图片 hash 缓存（服务端）
- [ ] T12: 超时与重试策略
- [ ] T13: 失败回退（仅显示原文/部分框）

---

## Daily Token Budget Strategy

建议每天按 3 段配额：
- 40%: 实现
- 40%: 测试与修复
- 20%: 文档和计划更新

如果当日接近预算上限：
- 停止加新功能
- 只完成“测试 + 记录 + 收尾 commit”

---

## Testing Plan (必须执行)

## A. Smoke Test
- 启动后端成功
- `/health` 返回 `{ok:true}`
- 扩展点击后有响应

## B. API Contract Test
- `POST /translate-image` 返回 `items[]`
- 每个 item 包含 `box + jp + zh`

## C. Quality Snapshot（固定样本）
使用固定公开样本图，记录：
- OCR框总数
- 过滤后框数
- 可读日文占比
- 平均响应时间

样本：
- `test-assets/sample-manga-ja.jpg`

## D. Regression Notes
每次改动在 PR/commit note 记录：
- 改了什么
- 指标是否变好
- 是否引入新问题

---

## Day-by-Day (第一周)

### Day 1
- 任务：T1 日文文本过滤
- 交付：新增过滤函数 + 单元化脚本测试
- 验收：噪声框显著减少

### Day 2
- 任务：T2 OCR 清洗
- 交付：文本清洗规则（长度、字符集、置信度）
- 验收：乱码行减少

### Day 3
- 任务：T3 相邻框合并
- 交付：merge 算法 + 参数可调
- 验收：碎片框数量下降，句子完整性提升

### Day 4
- 任务：T4 统计日志
- 交付：后端返回 debug stats（可开关）
- 验收：能量化比较每次改动效果

### Day 5
- 任务：回归测试 + 修复
- 交付：稳定版 tag（v0.2.0）
- 验收：完整链路稳定可演示

---

## Current Next Action

Next commit: **T1 日文文本过滤**
