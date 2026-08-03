// 英文大寫演算法 (現代標準格式，移除 Say)
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
    
    // 直接從金額開始，不加 Say
    let finalStr = intResult + ' Dollars';

    if (decimalPart !== '00') {
        let centsNum = parseInt(decimalPart, 10);
        let centsStr = convertGroup(centsNum);
        finalStr += ' and Cents ' + centsStr;
    }

    return finalStr + ' Only';
}
