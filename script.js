document.addEventListener('DOMContentLoaded', () => {
    const formatNumber = (num) => num.toLocaleString('ko-KR');
    const parseNumber = (str) => parseInt(str.replace(/,/g, ''), 10) || 0;

    // 금액 입력 시 콤마 처리
    document.getElementById('giftAmount').addEventListener('input', (e) => {
        const value = parseNumber(e.target.value);
        e.target.value = formatNumber(value);
    });

    // 신고 기한 선택 시 연장 이유 표시
    document.getElementById('reportPeriod').addEventListener('change', (e) => {
        const reasonContainer = document.getElementById('extensionReasonContainer');
        reasonContainer.style.display = e.target.value === '연장' ? 'block' : 'none';
    });

    // 과거 증여 금액 추가 버튼
    document.getElementById('addGiftButton').addEventListener('click', () => {
        const container = document.getElementById('pastGiftsContainer');
        container.style.display = 'block';

        const newInput = document.createElement('input');
        newInput.type = 'text';
        newInput.className = 'pastGift';
        newInput.placeholder = '예: 10,000,000';
        newInput.addEventListener('input', (e) => {
            const value = parseNumber(e.target.value);
            e.target.value = formatNumber(value);
        });
        container.appendChild(newInput);
    });

    // 계산 버튼 클릭
    document.getElementById('calculateButton').addEventListener('click', () => {
        const giftAmount = parseNumber(document.getElementById('giftAmount').value);
        const reportPeriod = document.getElementById('reportPeriod').value;
        const giftDate = new Date(document.getElementById('giftDate').value);
        const reportDate = new Date(document.getElementById('reportDate').value);

        // 신고 기한 계산
        const delayInMonths = Math.ceil((reportDate - giftDate) / (1000 * 60 * 60 * 24 * 30));

        // 가산세 계산
        let lateFee = 0;
        if (reportPeriod === '연장' && delayInMonths > 3) {
            lateFee = giftAmount * 0.003 * (delayInMonths - 3); // 연장된 월 수에 따라 0.3% 가산세
        }

        // 부동산 관련 취득세 계산
        const acquisitionTax = giftAmount * 0.03; // 부동산 취득세 3%
        const additionalTax = acquisitionTax * 0.1; // 부가세 10%

        // 결과 출력
        document.getElementById('result').innerHTML = `
            증여세 신고 기한 초과: ${formatNumber(delayInMonths)}개월<br>
            가산세: ${formatNumber(lateFee)}원<br>
            취득세: ${formatNumber(acquisitionTax)}원<br>
            부가세: ${formatNumber(additionalTax)}원
        `;
    });
});
