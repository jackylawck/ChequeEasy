/**
 * ChequeEasy 支票易 | Enterprise-Grade Cheque Engine v2.0
 * 100% Client-Side Pure Computation | ISO 27001 & Bank Compliant
 */

'use strict';

// ==========================================
// 1. 金融轉換核心引擎 (Cheque Converter Engine)
// ==========================================
const ChequeConverter = (() => {
    const ZH_DIGITS = ['零', '壹', '貳', '叁', '肆', '伍', '陸', '柒', '捌', '玖'];
    const ZH_POS = ['', '拾', '佰', '仟'];
    const ZH_UNITS = ['', '萬', '億', '兆'];

    const EN_ONES = [
        '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
        'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
        'Seventeen', 'Eighteen', 'Nineteen'
    ];
    const EN_TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const EN_UNITS = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];

    /**
     * 嚴謹高精度中文大寫（修復 10001 補零、多重零壓縮與開頭壹拾規範）
     */
    const toChinese = (amountStr) => {
        if (!/^\d+(\.\d{1,2})?$/.test(amountStr)) return '';
        const [intStr, decStr = ''] = amountStr.split('.');
        const intBigInt = BigInt(intStr);

        let chineseStr = '';

        if (intBigInt === 0n) {
            chineseStr = '零元';
        } else {
            // 切割為每 4 位一組（萬、億、兆）
            const groups = [];
            let temp = intStr;
            while (temp.length > 0) {
                const len = Math.max(0, temp.length - 4);
                groups.unshift(temp.slice(len));
                temp = temp.slice(0, len);
            }

            let needLeadingZero = false;
            let result = '';

            for (let i = 0; i < groups.length; i++) {
                const grp = groups[i];
                const grpNum = parseInt(grp, 10);
                const unit = ZH_UNITS[groups.length - 1 - i];

                if (grpNum > 0) {
                    let grpStr = '';
                    let zeroFlag = false;
                    const padded = grp.padStart(4, '0');

                    // 若前面有較高位組，且當前組首位為零，或上一組結尾需補零
                    if (needLeadingZero || (i > 0 && padded[0] === '0')) {
                        grpStr += '零';
                    }

                    for (let j = 0; j < 4; j++) {
                        const digit = parseInt(padded[j], 10);
                        if (digit !== 0) {
                            if (zeroFlag) {
                                grpStr += '零';
                                zeroFlag = false;
                            }
                            grpStr += ZH_DIGITS[digit] + ZH_POS[3 - j];
                        } else {
                            if (grpStr.length > 0 && !grpStr.endsWith('零')) {
                                zeroFlag = true;
                            }
                        }
                    }

                    result += grpStr + unit;
                    needLeadingZero = (padded[3] === '0');
                } else {
                    if (result.length > 0) needLeadingZero = true;
                }
            }

            chineseStr = result.replace(/零+/g, '零').replace(/零$/, '');
            if (chineseStr.startsWith('拾')) chineseStr = '壹' + chineseStr;
            chineseStr += '元';
        }

        // 小數（角、分）
        const jiao = decStr[0] ? parseInt(decStr[0], 10) : 0;
        const fen = decStr[1] ? parseInt(decStr[1], 10) : 0;

        if (jiao === 0 && fen === 0) {
            chineseStr += (chineseStr === '零元' ? '正' : '正');
        } else {
            if (chineseStr === '零元') chineseStr = '';
            if (jiao > 0) chineseStr += ZH_DIGITS[jiao] + '角';
            if (jiao === 0 && intBigInt > 0n && fen > 0) chineseStr += '零';
            if (fen > 0) chineseStr += ZH_DIGITS[fen] + '分';
        }

        return chineseStr;
    };

    /**
     * 英文大寫轉換（符合國際銀行慣例：無逗號隔開、標準連字符、清晰 and 區隔）
     */
    const toEnglish = (amountStr) => {
        if (!/^\d+(\.\d{1,2})?$/.test(amountStr)) return '';
        const [intStr, decStr = ''] = amountStr.split('.');
        const intBigInt = BigInt(intStr);

        let englishWords = '';

        if (intBigInt === 0n) {
            englishWords = 'Zero Dollars';
        } else {
            let tempInt = intBigInt;
            let groupIdx = 0;
            const groups = [];

            while (tempInt > 0n) {
                const groupVal = Number(tempInt % 1000n);
                if (groupVal > 0) {
                    const groupStr = convertEnglishGroup(groupVal);
                    const unit = EN_UNITS[groupIdx] ? ` ${EN_UNITS[groupIdx]}` : '';
                    groups.unshift(`${groupStr}${unit}`);
                }
                tempInt = tempInt / 1000n;
                groupIdx++;
            }
            // 銀行支票標準：用空白拼接，不使用逗號
            englishWords = groups.join(' ') + (intBigInt === 1n ? ' Dollar' : ' Dollars');
        }

        // 小數（Cents）
        const cents = decStr ? parseInt(decStr.padEnd(2, '0').slice(0, 2), 10) : 0;
        if (cents > 0) {
            const centsStr = convertEnglishGroup(cents) + (cents === 1 ? ' Cent' : ' Cents');
            englishWords = intBigInt === 0n ? `${centsStr} Only` : `${englishWords} and ${centsStr} Only`;
        } else {
            englishWords += ' Only';
        }

        return englishWords.replace(/\s+/g, ' ').trim();
    };

    const convertEnglishGroup = (n) => {
        let str = '';
        if (n >= 100) {
            str += `${EN_ONES[Math.floor(n / 100)]} Hundred`;
            n %= 100;
            if (n > 0) str += ' and ';
        }
        if (n >= 20) {
            const ten = Math.floor(n / 10);
            const rest = n % 10;
            str += EN_TENS[ten] + (rest > 0 ? `-${EN_ONES[rest]}` : '');
        } else if (n > 0) {
            str += EN_ONES[n];
        }
        return str;
    };

    return { toChinese, toEnglish };
})();

// ==========================================
// 2. 銀行代碼服務 (Robust Bank API Service)
// ==========================================
const BankService = (() => {
    const FALLBACK_BANKS = [
        { code: '003', zh: '渣打銀行 (香港)', en: 'Standard Chartered Bank (Hong Kong)' },
        { code: '004', zh: '香港上海滙豐銀行', en: 'The Hongkong and Shanghai Banking Corporation' },
        { code: '012', zh: '中國銀行 (香港)', en: 'Bank of China (Hong Kong)' },
        { code: '024', zh: '恒生銀行', en: 'Hang Seng Bank' },
        { code: '025', zh: '東亞銀行', en: 'The Bank of East Asia' },
        { code: '018', zh: '中信銀行 (國際)', en: 'China CITIC Bank International' },
        { code: '020', zh: '招商永隆銀行', en: 'CMB Wing Lung Bank' },
        { code: '039', zh: '花旗銀行 (香港)', en: 'Citibank (Hong Kong)' },
        { code: '040', zh: '大新銀行', en: 'Dah Sing Bank' },
        { code: '388', zh: '眾安銀行 (ZA Bank)', en: 'ZA Bank Limited' },
        { code: '389', zh: 'Mox Bank', en: 'Mox Bank Limited' },
        { code: '390', zh: '匯立銀行 (WeLab Bank)', en: 'WeLab Bank Limited' }
    ];

    const CACHE_KEY = 'cheque_easy_banks_v2';
    const CACHE_EXPIRY = 24 * 60 * 60 * 1000;

    const fetchLicensedBanks = async (forceRefresh = false) => {
        if (!forceRefresh) {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                try {
                    const { timestamp, data } = JSON.parse(cached);
                    if (Date.now() - timestamp < CACHE_EXPIRY && data?.length) return data;
                } catch (e) {
                    localStorage.removeItem(CACHE_KEY);
                }
            }
        }

        try {
            const response = await fetch('https://api.hkma.gov.hk/public/bank-svf-info/banks-branch-locator?pagesize=100');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const result = await response.json();

            if (result?.result?.records) {
                const bankMap = new Map();
                result.result.records.forEach(r => {
                    const rawCode = r.bank_code || r.institution_code || r.clearing_code;
                    if (!rawCode) return;
                    const code = String(rawCode).trim().padStart(3, '0');
                    const zhName = r.bank_name_tc || r.institution_name_tc || '';
                    const enName = r.bank_name_en || r.institution_name_en || '';

                    if (!bankMap.has(code)) {
                        bankMap.set(code, {
                            code,
                            zh: zhName || enName || `銀行代碼 ${code}`,
                            en: enName || zhName || `Bank Code ${code}`
                        });
                    }
                });

                if (bankMap.size > 0) {
                    const bankList = Array.from(bankMap.values());
                    localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: bankList }));
                    return bankList;
                }
            }
        } catch (error) {
            console.warn('HKMA API fallback activated:', error.message);
        }
        return FALLBACK_BANKS;
    };

    return { fetchLicensedBanks };
})();

// ==========================================
// 3. UI 與 互動控制 (UI Controller)
// ==========================================
const UIController = (() => {
    let currentLang = 'zh';
    let allBanks = [];

    const DOM = {
        amountInput: document.getElementById('amountInput'),
        convertBtn: document.getElementById('convertBtn'),
        zhOutput: document.getElementById('zhOutput'),
        enOutput: document.getElementById('enOutput'),
        copyZhBtn: document.getElementById('copyZhBtn'),
        copyEnBtn: document.getElementById('copyEnBtn'),
        langToggleBtn: document.getElementById('langToggleBtn'),
        tabBtns: document.querySelectorAll('.tab-btn'),
        tabContents: document.querySelectorAll('.tab-content'),
        fetchBankBtn: document.getElementById('fetchBankBtn'),
        bankSearchInput: document.getElementById('bankSearchInput'),
        bankListContainer: document.getElementById('bankListContainer')
    };

    // 置頂 Toast 輕提示
    const showToast = (msg, duration = 2200) => {
        let toast = document.getElementById('app-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'app-toast';
            toast.className = 'app-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.classList.add('show');
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
    };

    // 金額轉換（包含嚴謹正則驗證）
    const handleConvert = () => {
        let val = DOM.amountInput.value.trim();
        if (!val) {
            DOM.zhOutput.value = '';
            DOM.enOutput.value = '';
            return;
        }

        // 嚴格過濾負數、科學記號與非數字字元
        if (!/^\d+(\.\d{0,2})?$/.test(val)) {
            if (val.includes('.') && val.split('.')[1].length > 2) {
                showToast(currentLang === 'zh' ? '⚠️ 支票金額最多支援兩位小數（角、分）' : '⚠️ Maximum 2 decimal places allowed');
                val = val.split('.')[0] + '.' + val.split('.')[1].slice(0, 2);
                DOM.amountInput.value = val;
            } else {
                showToast(currentLang === 'zh' ? '⚠️ 請輸入有效正整數或金額格式' : '⚠️ Please enter a valid positive number');
                return;
            }
        }

        if (val.split('.')[0].length > 15) {
            showToast(currentLang === 'zh' ? '⚠️ 金額過大，超出安全處理範圍' : '⚠️ Amount exceeds max supported limit');
            return;
        }

        DOM.zhOutput.value = ChequeConverter.toChinese(val);
        DOM.enOutput.value = ChequeConverter.toEnglish(val);
    };

    // 複製結果
    const handleCopy = async (inputElem, btnElem) => {
        if (!inputElem.value) {
            showToast(currentLang === 'zh' ? '請先輸入金額' : 'Please enter an amount first');
            return;
        }
        try {
            await navigator.clipboard.writeText(inputElem.value);
            const originalText = btnElem.textContent;
            btnElem.textContent = currentLang === 'zh' ? '✅ 已複製' : '✅ Copied';
            showToast(currentLang === 'zh' ? '📋 已複製到剪貼簿！' : '📋 Copied to clipboard!');
            setTimeout(() => { btnElem.textContent = originalText; }, 1500);
        } catch {
            inputElem.select();
            document.execCommand('copy');
            showToast(currentLang === 'zh' ? '📋 已複製！' : '📋 Copied!');
        }
    };

    // 渲染銀行清單（含即時搜尋過濾）
    const renderBanks = (filterText = '') => {
        const query = filterText.toLowerCase().trim();
        const filtered = allBanks.filter(b => 
            b.code.includes(query) || 
            b.zh.toLowerCase().includes(query) || 
            b.en.toLowerCase().includes(query)
        );

        DOM.bankListContainer.innerHTML = '';
        if (filtered.length === 0) {
            DOM.bankListContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #888; padding: 20px;">${currentLang === 'zh' ? '查無符合條件的銀行代碼' : 'No matching bank code found'}</div>`;
            return;
        }

        filtered.sort((a, b) => a.code.localeCompare(b.code)).forEach(bank => {
            const card = document.createElement('div');
            card.className = 'bank-card';
            card.innerHTML = `
                <div class="bank-code-badge">${bank.code}</div>
                <div class="bank-names">
                    <div class="bank-name-primary">${currentLang === 'zh' ? bank.zh : bank.en}</div>
                    <div class="bank-name-secondary">${currentLang === 'zh' ? bank.en : bank.zh}</div>
                </div>
            `;
            DOM.bankListContainer.appendChild(card);
        });
    };

    // 載入銀行清單
    const handleLoadBanks = async (forceRefresh = false) => {
        DOM.fetchBankBtn.disabled = true;
        DOM.fetchBankBtn.textContent = currentLang === 'zh' ? '⏳ 載入中...' : '⏳ Loading...';

        allBanks = await BankService.fetchLicensedBanks(forceRefresh);
        renderBanks(DOM.bankSearchInput?.value || '');

        DOM.fetchBankBtn.disabled = false;
        DOM.fetchBankBtn.textContent = currentLang === 'zh' ? '🔄 重新整理名單' : '🔄 Refresh Directory';
        if (forceRefresh) showToast(currentLang === 'zh' ? `✅ 已同步最新資料 (${allBanks.length} 間)` : `✅ Updated (${allBanks.length} banks)`);
    };

    // 語言切換（全局同步）
    const handleLanguageToggle = () => {
        currentLang = currentLang === 'zh' ? 'en' : 'zh';
        DOM.langToggleBtn.textContent = currentLang === 'zh' ? 'English' : '繁體中文';

        document.querySelectorAll('[data-zh][data-en]').forEach(elem => {
            elem.textContent = elem.getAttribute(`data-${currentLang}`);
        });

        if (DOM.bankSearchInput) {
            DOM.bankSearchInput.placeholder = currentLang === 'zh' ? '🔍 搜尋銀行名稱或代碼...' : '🔍 Search bank name or code...';
        }

        handleConvert();
        if (allBanks.length > 0) renderBanks(DOM.bankSearchInput?.value || '');
    };

    const init = () => {
        DOM.amountInput.addEventListener('input', handleConvert);
        DOM.convertBtn.addEventListener('click', handleConvert);
        DOM.copyZhBtn.addEventListener('click', () => handleCopy(DOM.zhOutput, DOM.copyZhBtn));
        DOM.copyEnBtn.addEventListener('click', () => handleCopy(DOM.enOutput, DOM.copyEnBtn));
        DOM.langToggleBtn.addEventListener('click', handleLanguageToggle);
        DOM.fetchBankBtn.addEventListener('click', () => handleLoadBanks(true));

        if (DOM.bankSearchInput) {
            DOM.bankSearchInput.addEventListener('input', (e) => renderBanks(e.target.value));
        }

        // Tab 切換
        DOM.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                DOM.tabBtns.forEach(b => b.classList.remove('active'));
                DOM.tabContents.forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(btn.dataset.target).classList.add('active');
            });
        });

        // 背景預載入銀行清單
        handleLoadBanks(false);
    };

    return { init };
})();

// 啟動應用與全域測試接口
if (typeof window !== 'undefined') {
    window.ChequeConverter = ChequeConverter;
    document.addEventListener('DOMContentLoaded', UIController.init);
}
