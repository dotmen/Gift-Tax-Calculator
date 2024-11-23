document.addEventListener('DOMContentLoaded', () => {
    const formatNumber = (num) => num.toLocaleString('ko-KR');
    const parseNumber = (str) => parseInt(str.replace(/,/g, ''), 10) || 0;

    // 금액 입력 시 콤마 처리
    ['giftAmount', 'marketPrice', 'publicPrice'].forEach((id) => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', (e) => {
                const value = parseNumber(e.target.value);
                e.target.value = formatNumber(value);
            });
        }
    });

    // 과거 증여 금액 추가 버튼
    document.getElementById('addGiftButton').addEventListener('click', () => {
        const container = document.getElementById('pastGiftsContainer');

        // 새 입력 필드 생성
        const newInput = document.createElement('input');
        newInput.type = 'text';
        newInput.className = 'pastGift';
        newInput.placeholder = '예: 10,000,000';

        // 콤마 처리 이벤트 추가
        newInput.addEventListener('input', (e) => {
            const value = parseNumber(e.target.value);
            e.target.value = formatNumber(value);
        });

        container.appendChild(newInput);
    });

    // 계산 버튼 클릭
    document.getElementById('calculateButton').addEventListener('click', () => {
        const giftAmount = parseNumber(document.getElementById('giftAmount').value);
        const marketPrice = parseNumber(document.getElementById('marketPrice').value);
        const publicPrice = parseNumber(document.getElementById('publicPrice').value);
        const giftDate = new Date(document.getElementById('giftDate').value);
        const reportDate = new Date(document.getElementById('reportDate').value);
        const reportPeriod = document.getElementById('reportPeriod').value;

        // 과거 증여 금액 합산
        const pastGifts = Array.from(document.querySelectorAll('.pastGift'))
            .map(input => parseNumber(input.value))
            .reduce((sum, val) => sum + val, 0);

        // 감정평가 기준에 따라 과세 표준 결정
        const taxableBase = Math.max(marketPrice, publicPrice);

        // 총 증여 금액 계산
        const totalGift = giftAmount + pastGifts;

        // 신고 기한에 따른 초과 계산
        const allowedMonths = reportPeriod === '연장' ? 6 : 3;
        const delayInMonths = Math.ceil((reportDate - giftDate) / (1000 * 60 * 60 * 24 * 30));
        const overdueMonths = Math.max(0, delayInMonths - allowedMonths);

        // 가산세 계산 (지연 시 매월 0.3%)
        const lateFee = overdueMonths > 0 ? totalGift * 0.003 * overdueMonths : 0;

        // 취득세 및 부가세 계산 (부동산일 경우만)
        const assetType = document.getElementById('assetType').value;
        let acquisitionTax = 0;
        let additionalTax = 0;
        let educationTax = 0;
        if (assetType === '부동산') {
            acquisitionTax = giftAmount * 0.03; // 취득세 3%
            additionalTax = acquisitionTax * 0.1; // 부가세 10%
            educationTax = acquisitionTax * 0.2; // 지방교육세 20%
        }

        // 결과 출력
        document.getElementById('result').innerHTML = `
            증여세 신고 기한 초과: ${overdueMonths}개월<br>
            가산세: ${formatNumber(lateFee)}원<br>
            취득세: ${formatNumber(acquisitionTax)}원<br>
            부가세: ${formatNumber(additionalTax)}원<br>
            지방교육세: ${formatNumber(educationTax)}원
        `;
    });
});
