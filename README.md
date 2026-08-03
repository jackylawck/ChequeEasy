# ChequeEasy 支票易 🇭🇰

> **Enterprise-Grade Hong Kong Cheque Writer & Financial Utilities Web App**  
> 100% Client-Side Operation | ISO/IEC 27001 Compliant | Zero Data Leakage | PWA Offline Support

[![GitHub Pages](https://img.shields.io/badge/Deployment-GitHub%20Pages-brightgreen)](https://jackylawck.github.io/ChequeEasy/)
[![Compliance](https://img.shields.io/badge/Security-ISO%2FIEC%2027001-blue)](#data-privacy--iso-compliance)
[![PWA](https://img.shields.io/badge/PWA-Offline%20Ready-orange)](#key-features)

**ChequeEasy (支票易)** is a lightweight, privacy-focused web application designed specifically for HR, Finance, and Administrative professionals in Hong Kong. It seamlessly converts numeric currency amounts into standard Hong Kong bank-compliant Chinese capitalized characters (中文大寫) and English words ( Say... Only format) with zero security risks.

---

## 🌟 Key Features

* **🔤 Dual-Language Capitalization**:
  * **Traditional Chinese (繁體中文)**: Converts numbers to standard legal formats (e.g., `壹億貳仟參佰肆拾伍萬...元正`).
  * **English Words**: Converts numbers to anti-tampering formats (e.g., `Say ... Dollars and Cents ... Only`).
* **🔒 100% Client-Side & Zero-Data Retention**: All conversions and code execution occur inside the user's browser memory. No server communication, no databases, and zero data logging.
* **📱 Progressive Web App (PWA)**: Fully cached via Service Worker (`sw.js`). Operates seamlessly **without an internet connection** once loaded.
* **🏦 HKMA Open API Integration**: Directly fetches real-time Hong Kong Licensed Banks and Branch details from the Hong Kong Monetary Authority (HKMA) Open API.
* **📋 One-Click Copy**: Instant clipboard copying for fast workflow automation.

---

## 🔒 Data Privacy & ISO Compliance

Designed with **Privacy by Design** principles, ChequeEasy complies with strict corporate data governance standards:

* **ISO/IEC 27001 (Information Security Management)**:
  * Implements strict **Content Security Policy (CSP)** to prevent unauthorized XSS or third-party data exfiltration.
  * Ensures confidential payroll and vendor payment figures never touch external servers.
* **ISO/IEC 25010 (Software Quality Model)**:
  * Modular JavaScript architecture ensuring high maintainability, reliability, and usability.

---

## 🛠️ Built With

* **Frontend**: HTML5, CSS3 (CSS Variables & Flexbox), Vanilla JavaScript (ES6+)
* **PWA**: Service Worker API for full offline capabilities
* **Data Source**: Hong Kong Monetary Authority (HKMA) Public Open API
* **Deployment**: GitHub Pages (Serverless)

---

## 🚀 Quick Start & Installation

### Online Access
Simply visit: `https://jackylawck.github.io/ChequeEasy/`

### Local / Offline Usage
Since ChequeEasy is serverless (no Node.js/Python backend required):
1. Clone or download this repository:
   ```bash
   git clone [https://github.com/jackylawck/ChequeEasy.git](https://github.com/jackylawck/ChequeEasy.git)
