document.addEventListener('DOMContentLoaded', () => {
    const formatNumber = (num) => num.toLocaleString('ko-KR');
    const parseNumber = (str) => parseInt(str.replace(/,/g, ''), 10) || 0;

    // 금액 입력 시 콤마 처리
    ['giftAmount', 'marketPrice', 'publicPrice', 'installmentAmount'].forEach((id) => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', (e) => {
                const value = parseNumber(e.target.value);
                e.target.value = formatNumber(value);
            });
        }
    });

    // 분납 여부 선택 시
    document.getElementById('installmentPlan').addEventListener('change', (e) => {
        const installmentDetails = document.getElementById('installmentDetails');
        installmentDetails.style.display = e.target.value === '예' ? 'block' : 'none';
    });

    // 계산 버튼 클릭
    document.getElementById('calculateButton').addEventListener('click', () => {
        const giftAmount = parseNumber(document.getElementById('giftAmount').value);
        const marketPrice = parseNumber(document.getElementById('marketPrice').value);
        const publicPrice = parseNumber(document.getElementById('publicPrice').value);
        const exemptionType = document.getElementById('exemptionType').value;
        const installmentAmount = parseNumber(document.getElementById('installmentAmount').value);

        // 시가와 공시가격 비교
        const taxableBase = Math.max(marketPrice, publicPrice);

        // 면제 조건
        let exemption = 0;
        if (exemptionType === '가업승계') exemption = 200000000; // 가업승계 최대 면제 금액
        else if (exemptionType === '창업자금') exemption = 50000000; // 창업자금 최대 면제 금액

        // 과세 표준
        const taxableAmount = taxableBase - exemption;

        // 분납 처리
        const finalTax = taxableAmount > 0 ? taxableAmount * 0.1 : 0;
        const remainingTax = finalTax - installmentAmount;

        // 결과 출력
        document.getElementById('result').innerHTML = `
            과세 표준: ${formatNumber(taxableAmount)}원<br>
            계산된 증여세: ${formatNumber(finalTax)}원<br>
            분납 후 남은 세액: ${formatNumber(remainingTax)}원
        `;
    });
});
