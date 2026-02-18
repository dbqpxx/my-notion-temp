# Notion 檔案管理範本建置指南

這份指南將協助您建立與玻璃態儀表板連動的 Notion 原生環境。

## 步驟 1：建立核心資料庫

您需要建立兩個主要的資料庫：

### 1. 🗂 檔案總管 (File Manager Database)
這是存放所有檔案與資料夾的地方。
- **屬性設定：**
  - `名稱` (Title): 檔案名稱
  - `類型` (Select): 選項包含 `📁 資料夾` / `📄 檔案` / `📝 日誌`
  - `上層資料夾` (Relation): **自我關聯**（Relation to this database），勾選「Separate properties」。將其中一個屬性命名為 `上層資料夾`，另一個命名為 `子項目`。
  - `資料夾顏色` (Select): 🔴🟠🟡🟢🔵🟣
  - `附件` (Files & Media): 此屬性用來上傳真實檔案。
  - `標籤` (Multi-select)

### 2. 📓 共作日誌 (Work Journal Database)
- **屬性設定：**
  - `標題` (Title)
  - `日期` (Date)
  - `關聯檔案` (Relation): 連結至「🗂 檔案總管」

---

## 步驟 2：嵌入玻璃態儀表板

1. 部署您的程式到 Netlify 後，獲取您的 **Netlify URL** (例如: `https://your-nfm.netlify.app`)。
2. 在 Notion 頁面中，輸入 `/embed`。
3. 貼上您的 Netlify URL。
4. 調整嵌入視窗的大小，建議寬度設為 Full Width，高度約 800px。

---

## 步驟 3：美化視覺 (Notion 內)

- 為您的導航頁面添加**封面圖**（建議搜尋 "Glassmorphism background" 或 "Purple gradient"）。
- 使用 **Gallery View** 呈現「檔案總管」，並在「Layout」設定中將「Card preview」設為「None」，僅顯示名稱與圖示。
- 在各資料夾頁面內建立「Linked View」，並使用「自我關聯」篩選器 (Self-referential filter)，讓資料夾自動顯示內含物。

---

## 步驟 4：分享範本

1. 點擊 Notion 頁面右上角的 **Share**。
2. 切換到 **Publish** 標籤。
3. 開啟 **Publish to web**。
4. **關鍵步驟：** 確認 **Allow duplicate as template** 有被開啟。
5. 複製連結，分享給他人！
