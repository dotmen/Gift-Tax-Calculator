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

    // 계산 버튼 클릭
    document.getElementById('calculateButton').addEventListener('click', () => {
        const giftAmount = parseNumber(document.getElementById('giftAmount').value);
        const relationship = document.getElementById('relationship').value;
        const assetType = document.getElementById('assetType').value;
        const giftDate = new Date(document.getElementById('giftDate').value);
        const reportDate = new Date(document.getElementById('reportDate').value);
        const reportPeriod = document.getElementById('reportPeriod').value;

        // 공제 금액 설정
        let exemption = 0;
        if (relationship === '배우자') exemption = 600000000;
        else if (relationship === '직계비속') exemption = 50000000;
        else if (relationship === '미성년자') exemption = 20000000;
        else if (relationship === '사위/며느리') exemption = 50000000;
        else exemption = 10000000; // 기타

        // 과세 표준 계산
        const pastGifts = Array.from(document.querySelectorAll('.pastGift'))
            .map(input => parseNumber(input.value))
            .reduce((sum, val) => sum + val, 0);
        const totalGift = giftAmount + pastGifts;
        const taxableBase = totalGift - exemption;

        // 증여세율에 따른 계산
        let giftTax = 0;
        if (taxableBase > 0) {
            if (taxableBase <= 100000000) giftTax = taxableBase * 0.1;
            else if (taxableBase <= 500000000) giftTax = taxableBase * 0.2 - 10000000;
            else if (taxableBase <= 1000000000) giftTax = taxableBase * 0.3 - 60000000;
            else if (taxableBase <= 3000000000) giftTax = taxableBase * 0.4 - 160000000;
            else giftTax = taxableBase * 0.5 - 460000000;
        }

        // 신고 기한 계산
        const allowedMonths = reportPeriod === '연장' ? 6 : 3;
        const actualMonths = Math.ceil((reportDate - giftDate) / (1000 * 60 * 60 * 24 * 30));
        const overdueMonths = actualMonths - allowedMonths > 0 ? actualMonths - allowedMonths : 0;

        let lateFee = 0;
        if (overdueMonths > 0) {
            lateFee = giftTax * 0.003 * overdueMonths; // 가산세: 초과 월당 0.3%
        }

        // 취득세 계산
        let acquisitionTax = 0;
        if (assetType === '부동산') {
            acquisitionTax = totalGift * 0.03; // 부동산 취득세: 3%
        }

        // 지방교육세 계산
        const localEducationTax = acquisitionTax * 0.1; // 지방교육세: 취득세의 10%

        // 결과 출력
        document.getElementById('result').innerHTML = `
            총 증여 금액: ${formatNumber(totalGift)}원<br>
            공제 금액: ${formatNumber(exemption)}원<br>
            과세 표준: ${formatNumber(taxableBase)}원<br>
            증여세: ${formatNumber(giftTax)}원<br>
            신고 기한 초과: ${overdueMonths}개월<br>
            가산세: ${formatNumber(lateFee)}원<br>
            취득세: ${formatNumber(acquisitionTax)}원<br>
            지방교육세: ${formatNumber(localEducationTax)}원
        `;
    });
});
