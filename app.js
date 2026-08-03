// 金管局 API (精確解析 institution_code 及 institution_name)
async function fetchHKMABanks() {
    const btn = document.getElementById('fetchBankBtn');
    const container = document.getElementById('bankListContainer');
    
    btn.textContent = currentLang === 'zh' ? "資料讀取中..." : "Loading data...";
    btn.disabled = true;

    try {
        const langParam = currentLang === 'zh' ? 'tc' : 'en';
        const response = await fetch(`https://api.hkma.gov.hk/public/bank-svf-info/banks-branch-locator?lang=${langParam}`);
        const data = await response.json();
        
        const records = data.result.records;
        
        // 1. 去重（Deduplicate）：因為分行 API 會重複出現同一個銀行名稱，我們只留不重複的銀行
        const uniqueBanks = [];
        const seenCodes = new Set();

        records.forEach(item => {
            // 解析金管局正確欄位名稱
            const bName = item.institution_name || item.bank_name || item.bankName || '未知銀行';
            let bCode = item.institution_code || item.bank_code || item.bankCode || '';

            // 如果金管局沒直接給 Bank Code，就從分行編號或名稱解析
            if (!bCode && item.clearing_code) {
                bCode = item.clearing_code;
            }

            // 去重邏輯：按銀行名稱過濾，避免重複顯示滙豐
            if (!seenCodes.has(bName)) {
                seenCodes.add(bName);
                uniqueBanks.push({ name: bName, code: bCode || '004' }); // 若無代碼預設為通用
            }
        });

        // 2. 取前 15 間不重複的銀行展示
        const displayBanks = uniqueBanks.slice(0, 15);
        
        let html = '<ul style="list-style-type: none; padding-left: 0;">';
        displayBanks.forEach(item => {
            const codeDisplay = item.code ? `[${item.code}]` : '';
            html += `<li style="padding: 10px 0; border-bottom: 1px solid #eee; display: flex; align-items: center; gap: 10px;">
                        <strong style="color: #003366; background: #e9ecef; padding: 2px 8px; border-radius: 4px; font-family: monospace;">${codeDisplay || '[004]'}</strong> 
                        <span>${item.name}</span>
                     </li>`;
        });
        html += '</ul><p style="margin-top: 15px; font-size: 0.85rem; color: #666;"><em>' + 
                (currentLang === 'zh' ? '（已成功連線至香港金管局 API 取得最新認可機構名單）' : '(Successfully connected to HKMA Open API)') + 
                '</em></p>';
        
        container.innerHTML = html;
        btn.textContent = currentLang === 'zh' ? "更新成功" : "Updated";
    } catch (err) {
        console.error("API Error:", err);
        container.innerHTML = '<p style="color:red;">' + (currentLang === 'zh' ? '無法連線至金管局 API，請檢查網絡連線。' : 'Failed to connect to HKMA API.') + '</p>';
        btn.textContent = currentLang === 'zh' ? "重新嘗試" : "Retry";
        btn.disabled = false;
    }
}
