document.addEventListener('DOMContentLoaded', () => {
    // 1. 初始化 Tab 分頁
    setupTabs();
    
    // 2. 轉換觸發機制（按按鈕 或 按 Enter 鍵）
    const convertBtn = document.getElementById('convertBtn');
    const amountInput = document.getElementById('amountInput');

    convertBtn.addEventListener('click', handleConversion);
    amountInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleConversion();
    });

    // 3. 銀行代碼 API
    document.getElementById('fetchBankBtn').addEventListener('click', fetchHKMABanks);
});

// Tab 切換
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(btn.dataset.target).classList.add('active');
        });
    });
}

// 複製到剪貼簿
function copyToClipboard(elementId) {
    const copyText = document.getElementById(elementId);
    if (!copyText.value) return;
    
    copyText.select();
    navigator.clipboard.writeText(copyText.value)
        .then(() => alert("已複製大寫文字！"))
        .catch(() => alert("複製失敗，請手動選取複製。"));
}

// 核心轉換控制
function handleConversion() {
    const inputField = document.getElementById('amountInput');
    let value = parseFloat(inputField.value);
    
    if (isNaN(value) || value < 0) {
        alert("請輸入有效的數字！");
        return;
    }

    let amountStr = value.toFixed(2);
    let [integerPart, decimalPart] = amountStr.split('.');

    document.getElementById('zhOutput').value = convertToChineseCheque(integerPart, decimalPart);
    document.getElementById('enOutput').value = convertToEnglishCheque(integerPart, decimalPart);
}

// 繁體中文大寫演算法 (支援 萬/億/兆)
function convertToChineseCheque(integerPart, decimalPart) {
    const digits = ['零', '壹', '貳', '參', '肆', '伍', '陸', '柒', '捌', '玖'];
    const units = ['', '拾', '佰', '仟'];
    const bigUnits = ['', '萬', '億', '兆'];
    
    if (integerPart === '0' && decimalPart === '00') return '零元正';

    let result = '';
    let len = integerPart.length;

    if (integerPart !== '0') {
        let zeroFlag = false;
        for (let i = 0; i < len; i++) {
            let n = parseInt(integerPart[i]);
            let pos = len - 1 - i; // 位數位置
            let u = pos % 4;       // 拾佰仟
            let b = Math.floor(pos / 4); // 萬億兆

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

    // 處理角分
    if (decimalPart === '00') {
        result += '正';
    } else {
        let jiao = parseInt(decimalPart[0]);
        let fen = parseInt(decimalPart[1]);
        if (jiao > 0) result += digits[jiao] + '角';
        if (fen > 0) result += digits[fen] + '分';
        if (fen === 0) result += '正';
    }

    return result;
}

// 英文大寫演算法
function convertToEnglishCheque(integerPart, decimalPart) {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const scales = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];

    function convertGroup(num) {
        let res = '';
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

    let num = parseInt(integerPart, 10);
    if (num === 0 && decimalPart === '00') return 'Zero Dollars Only';

    let intResult = '';
    let scaleIndex = 0;

    while (num > 0) {
        let chunk = num % 1000;
        if (chunk > 0) {
            let groupStr = convertGroup(chunk);
            intResult = groupStr + (scales[scaleIndex] ? ' ' + scales[scaleIndex] : '') + ' ' + intResult;
        }
        num = Math.floor(num / 1000);
        scaleIndex++;
    }

    intResult = intResult.trim() || 'Zero';
    let finalStr = 'Say ' + intResult + ' Dollars';

    if (decimalPart !== '00') {
        let centsStr = convertGroup(parseInt(decimalPart, 10));
        finalStr += ' and Cents ' + centsStr;
    }

    return finalStr + ' Only';
}

// 香港金管局 (HKMA) API 串接
async function fetchHKMABanks() {
    const btn = document.getElementById('fetchBankBtn');
    const container = document.getElementById('bankListContainer');
    
    btn.textContent = "資料讀取中...";
    btn.disabled = true;

    try {
        const response = await fetch('https://api.hkma.gov.hk/public/bank-svf-info/banks-branch-locator?lang=tc');
        const data = await response.json();
        
        const records = data.result.records.slice(0, 10); // 取前 10 筆示範
        
        let html = '<ul>';
        records.forEach(item => {
            html += `<li><strong>${item.bankName}</strong></li>`;
        });
        html += '</ul><p><em>（已成功連線至香港金管局 API 取得最新認可機構名單）</em></p>';
        
        container.innerHTML = html;
        btn.textContent = "更新成功";
    } catch (err) {
        container.innerHTML = '<p style="color:red;">無法連線至金管局 API，請檢查網絡連線。</p>';
        btn.textContent = "重新嘗試";
        btn.disabled = false;
    }
}

// 註冊 Service Worker 以支援 100% 離線 PWA 存取
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(() => console.log('ChequeEasy 離線 PWA 模式啟用成功！'))
            .catch((err) => console.log('PWA 註冊失敗:', err));
    });
}
