# 📄 ChequeEasy 支票易 | Enterprise-Grade Hong Kong Cheque Writer & Financial Utility Web App

[![Deployment](https://img.shields.io/badge/Deployment-GitHub%20Pages-brightgreen)](https://jackylawck.github.io/ChequeEasy/)
[![Security Standard](https://img.shields.io/badge/Security-ISO%2FIEC%2027001%20Compliant-blue)](https://www.iso.org/isoiec-27001-information-security.html)
[![Quality Standard](https://img.shields.io/badge/Quality-ISO%2FIEC%2025010%20Compliant-orange)](https://iso25000.com/index.php/en/iso-25000-standards/iso-25010)
[![PWA](https://img.shields.io/badge/PWA-Offline%20Ready-success)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![License](https://img.shields.io/badge/License-MIT-lightgrey.svg)](LICENSE)

**ChequeEasy 支票易** 是一款專為香港企業、財務人員（Finance/Accounting）及 HR 設計的**企業級中英文支票大寫轉換與銀行代碼速查工具**。系統採用 100% 用戶端（Client-side）運算架構，結合香港金管局 (HKMA) Open API，並全面支援 PWA 離線使用。

🔗 **線上即時體驗（Live Demo）：** [https://jackylawck.github.io/ChequeEasy/](https://jackylawck.github.io/ChequeEasy/)

---

## ✨ 核心功能（Key Features）

* **📄 雙語支票大寫精確轉換 (Bilingual Amount Converter)**
  * **中文大寫**：嚴格遵循香港商業與銀行標準（億、萬、仟、佰、拾、元正/角/分）。
  * **英文大寫**：採用現代銀行規範（*Dollars and Cents ... Only*），自動移除過時前綴（如 Say），並保留結尾防篡改格式。
* **🌐 一鍵切換 UI 語言 (Instant Language Toggle)**
  * 支援全中文（繁體中文）與全英文（English）介面一鍵即時切換，方便外籍管理層或雙語團隊使用。
* **🏦 香港認可銀行代碼速查 (HK Licensed Banks Directory)**
  * 內置香港主要銀行 3 位數清算代碼（Clearing Code / Bank Code，如 `[004]` 滙豐、`[012]` 中銀、`[003]` 渣打、`[387]` ZA Bank）。
  * 支援動態連線至**香港金融管理局 (HKMA) Open API**，自動更新與對照認可機構名單。
* **📱 PWA 離線支援 (Progressive Web App)**
  * 內置 Service Worker 機制，無網絡（Offline / 斷網）環境下依然能 100% 正常進行金額轉換與查詢內置銀行代碼。

---

## 🛡️ 合規性與資訊安全 (ISO Standard Compliance)

### 1. ISO/IEC 27001（資訊安全管理系統）
* **Zero-Data Retention Policy（零數據外洩）**：所有數字轉換與邏輯運算 100% 在用戶瀏覽器本地（Client-side）完成，完全無後端資料庫或任何 API 收集薪務/付款數據。
* **Strict Content Security Policy (CSP)**：限制外部資源載入，防止跨站腳本攻擊 (XSS) 與數據滲漏。
* **零第三方套件依賴 (Vanilla JS)**：不依賴任何外部 npm 套件或可疑 CDN，徹底避免供應鏈攻擊（Supply Chain Attacks）。

### 2. ISO/IEC 25010（軟件品質標準）
* **安全性 (Security)**：DOM 操作嚴格採用安全原生 API，杜絕 SQL 注入或代碼注入漏洞。
* **可靠性 (Reliability)**：提供 API 斷網自動降級（Fallback）機制，確保系統在網絡中斷時依然穩定可靠。
* **可用性 (Usability)**：支援響應式設計（RWD），適配桌面電腦、平板及手機端使用。

---

## 🛠️ 技術架構 (Tech Stack)

* **Frontend**: HTML5, CSS3 (Modern Flexbox & CSS Variables), JavaScript (ES6+ Vanilla JS)
* **PWA**: Service Worker (`sw.js`), Web App Manifest
* **API Integration**: HKMA Open API (`https://api.hkma.gov.hk`)
* **Security**: Content Security Policy (CSP) Headers
