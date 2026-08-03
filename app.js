var currentLang = 'zh';

var HK_BANK_DATABASE = [
    { code: '004', nameZh: '香港上海滙豐銀行有限公司', nameEn: 'The Hongkong and Shanghai Banking Corporation Limited' },
    { code: '012', nameZh: '中國銀行(香港)有限公司', nameEn: 'Bank of China (Hong Kong) Limited' },
    { code: '003', nameZh: '渣打銀行(香港)有限公司', nameEn: 'Standard Chartered Bank (Hong Kong) Limited' },
    { code: '024', nameZh: '恒生銀行有限公司', nameEn: 'Hang Seng Bank Limited' },
    { code: '015', nameZh: '東亞銀行有限公司', nameEn: 'The Bank of East Asia, Limited' },
    { code: '035', nameZh: '華僑銀行(香港)有限公司', nameEn: 'OCBC Bank (Hong Kong) Limited' },
    { code: '020', nameZh: '招商永隆銀行有限公司', nameEn: 'CMB Wing Lung Bank Limited' },
    { code: '039', nameZh: '集友銀行有限公司', nameEn: 'Chiyu Banking Corporation Limited' },
    { code: '028', nameZh: '大眾銀行(香港)有限公司', nameEn: 'Public Bank (Hong Kong) Limited' },
    { code: '072', nameZh: '中國工商銀行(亞洲)有限公司', nameEn: 'Industrial and Commercial Bank of China (Asia) Limited' },
    { code: '006', nameZh: '花旗銀行(香港)有限公司', nameEn: 'Citibank (Hong Kong) Limited' },
    { code: '016', nameZh: '星展銀行(香港)有限公司', nameEn: 'DBS Bank (Hong Kong) Limited' },
    { code: '043', nameZh: '南洋商業銀行有限公司', nameEn: 'Nanyang Commercial Bank, Limited' },
    { code: '025', nameZh: '上海商業銀行有限公司', nameEn: 'Shanghai Commercial Bank Limited' },
    { code: '041', nameZh: '創興銀行有限公司', nameEn: 'Chong Hing Bank Limited' },
    { code: '040', nameZh: '大新銀行有限公司', nameEn: 'Dah Sing Bank, Limited' }
];

// 頁面加載後綁定所有事件（完全避開行內 onclick 的 CSP 限制）
document.addEventListener('DOMContentLoaded', function() {
    // 預先印出銀行列表
    renderBankList(HK_BANK_DATABASE, false);

    // 1. 綁定轉換按鈕與輸入框事件
    var convertBtn = document.getElementById('convertBtn');
    var amountInput = document.getElementById('amountInput');

    if (convertBtn) {
        convertBtn.addEventListener('click', handleConversion);
    }
    if (amountInput) {
        amountInput.addEventListener('input', handleConversion);
        amountInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') handleConversion();
        });
    }

    // 2. 綁定複製按鈕
    var copyZhBtn = document.getElementById('copyZhBtn');
    var copyEnBtn = document.getElementById('copyEnBtn');

    if (copyZhBtn) {
        copyZhBtn.addEventListener('click', function() { copyToClipboard('zhOutput'); });
    }
    if (copyEnBtn) {
        copyEnBtn.addEventListener('click', function() { copyToClipboard('enOutput'); });
    }

    // 3. 綁定語言切換
    var langBtn = document.getElementById('langToggleBtn');
    if (langBtn) {
        langBtn.addEventListener('click', toggleLanguage);
    }

    // 4. 綁定分頁按鈕
    var tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var targetId = this.getAttribute('data-target');
            switchTab(targetId, this);
        });
    });

    // 5. 綁定 API 按鈕
    var fetchBankBtn = document.getElementById('fetchBankBtn');
    if (fetchBankBtn) {
        fetchBankBtn.addEventListener('click', fetchHKMABanks);
    }
});

function switchTab(targetId, clickedBtn) {
    var tabBtns = document.querySelectorAll('.tab-btn');
    var tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(function(b) { b.classList.remove('active'); });
    tabContents.forEach(function(c) { c.classList.remove('active'); });

    clickedBtn.classList.add('active');
    var target = document.getElementById(targetId);
    if (target) target.classList.add('active');
}

function toggleLanguage() {
    currentLang = (currentLang === 'zh') ? 'en' : 'zh';
    var langBtn = document.getElementById('langToggleBtn');
    if (langBtn) langBtn.textContent = (currentLang === 'zh') ? 'English' : '繁體中文';

    var elementsToTranslate = document.querySelectorAll('[data-zh][data-en]');
    elementsToTranslate.forEach(function(el) {
        el.textContent = el.getAttribute('data-' + currentLang);
    });

    var amountInput = document.getElementById('amountInput');
    var zhOutput = document.getElementById('zhOutput');

    if (amountInput && zhOutput) {
        if (currentLang === 'en') {
            amountInput.placeholder = "e.g. 123456789";
            if (!zhOutput.value) zhOutput.placeholder = "Result will appear here...";
        } else {
            amountInput.placeholder = "例如：123456789";
            if (!zhOutput.value) zhOutput.placeholder = "請先輸入阿拉伯數字，再按轉換";
        }
    }
    
    renderBankList(HK_BANK_DATABASE, false);
}

function copyToClipboard(elementId) {
    var copyText = document.getElementById(elementId);
    if (!copyText || !copyText.value) return;
    
    copyText.select();
    navigator.clipboard.writeText(copyText.value)
        .then(function() {
            alert(currentLang === 'zh' ? "已複製大寫文字！" : "Text copied to clipboard!");
        })
        .catch(function() {
            alert(currentLang === 'zh' ? "複製失敗，請手動複製。" : "Copy failed. Please copy manually.");
        });
}

function handleConversion() {
    var inputField = document.getElementById('amountInput');
    if (!inputField) return;

    var value = parseFloat(inputField.value);
    
    if (isNaN(value) || value < 0) {
        document.getElementById('zhOutput').value = "";
        document.getElementById('enOutput').value = "";
        return;
    }

    var amountStr = value.toFixed(2);
    var parts = amountStr.split('.');

    document.getElementById('zhOutput').value = convertToChineseCheque(parts[0], parts[1]);
    document.getElementById('enOutput').value = convertToEnglishCheque(parts[0], parts[1]);
}

function convertToChineseCheque(integerPart, decimalPart) {
    var digits = ['零', '壹', '貳', '參', '肆', '伍', '陸', '柒', '捌', '玖'];
    var units = ['', '拾', '佰', '仟'];
    var bigUnits = ['', '萬', '億', '兆'];
    
    if (integerPart === '0' && decimalPart === '00') return '零元正';

    var result = '';
    var len = integerPart.length;

    if (integerPart !== '0') {
        var zeroFlag = false;
        for (var i = 0; i < len; i++) {
            var n = parseInt(integerPart[i]);
            var pos = len - 1 - i;
            var u = pos % 4;
            var b = Math.floor(pos / 4);

            if (n === 0) {
                zeroFlag = true;
            } else {
                if (zeroFlag) {
                    result += '零';
                    zeroFlag = false;
                }
                result += digits[n] + units[u];
            }

            if (u === 0 && zeroFlag === false) {
                result += bigUnits[b];
            }
        }
        result += '元';
    }

    if (decimalPart === '00') {
        result += '正';
    } else {
        var jiao = parseInt(decimalPart[0]);
        var fen = parseInt(decimalPart[1]);
        if (jiao > 0) result += digits[jiao] + '角';
        if (fen > 0) result += digits[fen] + '分';
        if (fen === 0) result += '正';
    }

    return result;
}

function convertToEnglishCheque(integerPart, decimalPart) {
    var ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    var tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    var scales = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];

    function convertGroup(num) {
        var res = '';
        if (num >= 100) {
            res += ones[Math.floor(num / 100)] + ' Hundred ';
            num %= 100;
        }
        if (num > 0) {
            if (num < 20) res += ones[num] + ' ';
            else {
                res += tens[Math.floor(num / 10)] + ' ';
                if (num % 10 > 0) res += ones[num % 10] + ' ';
            }
        }
        return res.trim();
    }

    var num = parseInt(integerPart, 10);
    if (num === 0 && decimalPart === '00') return 'Zero Dollars Only';

    var intResult = '';
    var scaleIndex = 0;

    while (num > 0) {
        var chunk = num % 1000;
        if (chunk > 0) {
            var groupStr = convertGroup(chunk);
            intResult = groupStr + (scales[scaleIndex] ? ' ' + scales[scaleIndex] : '') + ' ' + intResult;
        }
        num = Math.floor(num / 1000);
        scaleIndex++;
    }

    intResult = intResult.trim() || 'Zero';
    var finalStr = intResult + ' Dollars';

    if (decimalPart !== '00') {
        var centsNum = parseInt(decimalPart, 10);
        var centsStr = convertGroup(centsNum);
        finalStr += ' and Cents ' + centsStr;
    }

    return finalStr + ' Only';
}

function renderBankList(bankData, isFromApi) {
    var container = document.getElementById('bankListContainer');
    if (!container) return;

    var html = '<ul style="list-style-type: none; padding-left: 0; margin-top: 15px;">';
    
    bankData.forEach(function(item) {
        var name = (currentLang === 'zh') ? (item.nameZh || item.name) : (item.nameEn || item.name);
        html += '<li style="padding: 10px 0; border-bottom: 1px solid #eee; display: flex; align-items: center; gap: 12px;">' +
                    '<strong style="color: #003366; background: #e9ecef; padding: 3px 8px; border-radius: 4px; font-family: monospace;">[' + item.code + ']</strong> ' +
                    '<span style="font-size: 1rem; color: #222;">' + name + '</span>' +
                 '</li>';
    });

    var note = isFromApi 
        ? (currentLang === 'zh' ? '（已成功連線至香港金管局 API 取得最新名單）' : '(Successfully updated from HKMA Open API)')
        : (currentLang === 'zh' ? '（目前顯示內置常規銀行代碼對照表）' : '(Showing offline built-in bank directory)');

    html += '</ul><p style="margin-top: 15px; font-size: 0.85rem; color: #666;"><em>' + note + '</em></p>';
    container.innerHTML = html;
}

async function fetchHKMABanks() {
    var btn = document.getElementById('fetchBankBtn');
    if (!btn) return;
    
    btn.textContent = currentLang === 'zh' ? "資料讀取中..." : "Loading data...";
    btn.disabled = true;

    try {
        var langParam = currentLang === 'zh' ? 'tc' : 'en';
        var response = await fetch('https://api.hkma.gov.hk/public/bank-svf-info/banks-branch-locator?lang=' + langParam);
        var data = await response.json();
        
        var records = data.result.records || [];
        var apiBanks = [];
        var seenNames = new Set();

        records.forEach(function(item) {
            var bName = item.bank_name || item.institution_name || '';
            var bCode = item.clearing_code || item.bank_code || item.institution_code || '';

            if (!bCode && bName) {
                var found = HK_BANK_DATABASE.find(function(db) {
                    return bName.includes(db.nameZh) || bName.includes(db.nameEn);
                });
                if (found) bCode = found.code;
            }

            if (bName && !seenNames.has(bName)) {
                seenNames.add(bName);
                apiBanks.push({ code: bCode || '004', name: bName });
            }
        });

        if (apiBanks.length > 0) {
            renderBankList(apiBanks.slice(0, 20), true);
            btn.textContent = currentLang === 'zh' ? "更新成功" : "Updated";
        } else {
            throw new Error("No data");
        }
    } catch (err) {
        console.warn("API Offline, using local fallback database", err);
        renderBankList(HK_BANK_DATABASE, false);
        btn.textContent = currentLang === 'zh' ? "離線模式 (已使用內置資料)" : "Offline Mode (Built-in)";
    } finally {
        btn.disabled = false;
    }
}
