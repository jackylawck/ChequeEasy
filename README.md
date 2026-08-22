# 📄 ChequeEasy 支票易 | Enterprise-Grade Hong Kong Cheque Writer & Financial Utility Web App

[![Deployment](https://img.shields.io/badge/Deployment-GitHub%20Pages-brightgreen)](https://jackylawck.github.io/ChequeEasy/)
[![Security Standard](https://img.shields.io/badge/Security-ISO%2FIEC%2027001%20Compliant-blue)](https://www.iso.org/isoiec-27001-information-security.html)
[![Quality Standard](https://img.shields.io/badge/Quality-ISO%2FIEC%2025010%20Compliant-orange)](https://iso25000.com/index.php/en/iso-25000-standards/iso-25010)
[![Accessibility](https://img.shields.io/badge/A11y-WCAG%202.1%20AA%20%2F%20WAI--ARIA-purple)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![PWA](https://img.shields.io/badge/PWA-Offline%20Ready-success)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![License](https://img.shields.io/badge/License-MIT-lightgrey.svg)](LICENSE)

**ChequeEasy 支票易** 是一款專為香港企業、財務人員（Finance/Accounting）及 HR 設計的**企業級中英文支票大寫轉換與銀行代碼速查工具**。系統採用 100% 用戶端（Client-side）純前端本地運算架構，結合香港金管局 (HKMA) Open API，全面支援 PWA 離線使用與無障礙（A11y）標準。

🔗 **線上即時體驗（Live Demo）：** [https://jackylawck.github.io/ChequeEasy/](https://jackylawck.github.io/ChequeEasy/)

---

## ✨ 核心功能（Key Features）

* **📄 雙語支票大寫精確轉換 (Bilingual Amount Converter)**
  * **中文大寫**：嚴格遵循香港商業與銀行標準（零旗標精確補位、大寫「叁」、開頭「壹拾」規範、萬/億/兆分組支援）。
  * **英文大寫**：採用國際銀行標準格式（*Dollars and Cents ... Only*），支援合法連字符與大小寫規範，不含多餘逗號干擾。
  * **輸入防護**：自動防禦負數、科學記號與超長溢位輸入，支援精準兩位小數（角、分）。
* **🌐 智慧國際化與即時切換 (Smart I18n & Instant Toggle)**
  * 支援全中文（繁體中文）與全英文（English）一鍵切換，並具備瀏覽器系統語系自動偵測適配。
* **🏦 香港認可銀行代碼速查 (HK Licensed Banks Directory)**
  * 內置香港主要銀行 3 位數清算代碼（Clearing Code / Bank Code，如 `[004]` 滙豐、`[012]` 中銀、`[003]` 渣打、`[388]` 眾安銀行）。
  * 支援動態連線至**香港金融管理局 (HKMA) Open API**，自動更新對照認可機構名單並支援 24 小時安全快取。
  * **即時搜尋過濾**：支援輸入銀行名稱或代碼快速定位。
* **📱 PWA 離線完整支援 (Progressive Web App)**
  * 具備完整 Service Worker (`sw.js`) 快取優先策略，在完全無網路（斷網 / 飛行模式）環境下依然可 100% 離線運算與查詢。

---

## 🛡️ 合規性與資訊安全 (ISO & Compliance Standards)

### 1. ISO/IEC 27001 & GDPR（資訊安全與隱私管理）
* **Zero-Data Retention Policy（零資料留存）**：所有數字轉換與邏輯運算 100% 在用戶瀏覽器本地（Client-side）完成，完全無後端伺服器與資料庫，杜絕財務數據外洩風險。
* **Strict Content Security Policy (CSP)**：嚴格限制外部資源載入，完全移除 `unsafe-inline`，杜絕跨站腳本攻擊 (XSS)。
* **零第三方套件依賴 (Vanilla JS)**：不依賴任何外部 npm 套件或可疑 CDN，徹底避免供應鏈攻擊（Supply Chain Attacks）。

### 2. 演算法確定性與 AI 法規合規 (EU AI Act Aligned)
* 本工具全面採用**確定性金融演算法（Deterministic Algorithms）**，不使用生成式 AI 模型，輸出結果具備 100% 可驗證性、可審計性，絕無 AI 幻覺偏差風險。

### 3. ISO/IEC 25010 & WCAG 2.1 AA（軟體品質與無障礙）
* **無障礙支援 (A11y)**：完整導入 WAI-ARIA 屬性（`role="tablist"`、`aria-live`、焦點高亮），支援純鍵盤操作與螢幕閱讀器。
* **可靠性 (Reliability)**：提供金管局 API 斷網自動降級（Fallback）機制，確保任何情況下功能皆可用。
* **可用性 (Usability)**：提供浮動 Toast 輕提示、輸入格式化適配（`inputmode="decimal"`）與財務報表列印樣式（Print Stylesheet）。

詳細合規聲明請參閱：[🔒 Privacy, AI Compliance & Legal Statement](./PRIVACY.md)

---

## 🛠️ 技術架構 (Tech Stack)

* **Frontend**: HTML5 (Semantic & ARIA), CSS3 (Modern Variables & Responsive Grid), JavaScript (ES6+ Vanilla Modules)
* **Offline Engine**: Service Worker (`sw.js`), Web App Manifest
* **API Integration**: HKMA Open API (`https://api.hkma.gov.hk`)
* **Security & Testing**: Strict CSP Headers, BigInt Financial Safe Precision
