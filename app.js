// 金管局 API (精確解析 clearing_code 與 bank_name 專用版)
async function fetchHKMABanks() {
    const btn = document.getElementById('fetchBankBtn');
    const container = document.getElementById('bankListContainer');
    
    btn.textContent = currentLang === 'zh' ? "資料讀取中..." : "Loading data...";
    btn.disabled = true;

    try {
        const langParam = currentLang === 'zh' ? 'tc' : 'en';
        const response = await fetch(`https://api.hkma.gov.hk/public/bank-svf-info/banks-branch-locator?lang=${langParam}`);
        const data = await response.json();
        
        const records = data.result.records || [];
        
        // 使用 Map 進行「銀行代碼/名稱」精確去重
        const bankMap = new Map();

        records.forEach(item => {
            // 金管局 API 的真實欄位名稱
            const bName = item.bank_name || item.institution_name || '未知銀行';
            // 優先讀取 clearing_code (即 3 位數銀行代碼，如 004, 024, 012)
            const bCode = item.clearing_code || item.bank_code || item.institution_code || '';

            // 只要有銀行名稱，且 Map 裡面還沒有，就加進去
            if (bName && !bankMap.has(bName)) {
                bankMap.set(bName, bCode);
            }
        });

        // 取前 20 間不重複的銀行
        let html = '<ul style="list-style-type: none; padding-left: 0; margin-top: 15px;">';
        
        let count = 0;
        for (let [name, code] of bankMap.entries()) {
            if (count >= 20) break;
            
            // 如果抓到了 clearing_code 就顯示 [004]，否則顯示 [HK]
            const displayCode = code ? `[${String(code).padStart(3, '0')}]` : '[HK]';

            html += `<li style="padding: 10px 0; border-bottom: 1px solid #eee; display: flex; align-items: center; gap: 12px;">
                        <strong style="color: #003366; background: #e9ecef; padding: 3px 8px; border-radius: 4px; font-family: monospace; font-size: 0.95rem;">${displayCode}</strong> 
                        <span style="font-size: 1rem; color: #222;">${name}</span>
                     </li>`;
            count++;
        }
        
        html += '</ul><p style="margin-top: 15px; font-size: 0.85rem; color: #666;"><em>' + 
                (currentLang === 'zh' ? '（已成功連線至香港金管局 API 取得最新認可機構名單）' : '(Successfully connected to HKMA Open API)') + 
                '</em></p>';
        
        container.innerHTML = html;
        btn.textContent = currentLang === 'zh' ? "更新成功" : "Updated";
        btn.disabled = false;
    } catch (err) {
        console.error("API Error:", err);
        container.innerHTML = '<p style="color:red; margin-top: 15px;">' + (currentLang === 'zh' ? '無法連線至金管局 API，請檢查網絡連線。' : 'Failed to connect to HKMA API.') + '</p>';
        btn.textContent = currentLang === 'zh' ? "重新嘗試" : "Retry";
        btn.disabled = false;
    }
}
