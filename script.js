document.addEventListener('DOMContentLoaded', () => {
    const formatNumber = (num) => num.toLocaleString('ko-KR');
    const parseNumber = (str) => parseInt(str.replace(/,/g, ''), 10) || 0;

    // 금액 입력 시 콤마 처리
    document.getElementById('giftAmount').addEventListener('input', (e) => {
        const value = parseNumber(e.target.value);
        e.target.value = formatNumber(value);
    });

    // 과거 증여 금액 추가 버튼
    document.getElementById('addGiftButton').addEventListener('click', () => {
        const container = document.getElementById('pastGiftsContainer');
        container.style.display = 'block'; // 숨겨진 입력 필드를 표시

        // 새 입력 필드 추가
        const newInput = document.createElement('input');
        newInput.type = 'text';
        newInput.className = 'pastGift';
        newInput.placeholder = '예: 10,000,000';

        // 콤마 처리 추가
        newInput.addEventListener('input', (e) => {
            const value = parseNumber(e.target.value);
            e.target.value = formatNumber(value);
        });

        container.appendChild(newInput);
    });

    // 계산 버튼 클릭
    document.getElementById('calculateButton').addEventListener('click', () => {
        const giftAmount = parseNumber(document.getElementById('giftAmount').value);
        const relationship = document.getElementById('relationship').value;
        const assetType = document.getElementById('assetType').value;
        const giftDate = new Date(document.getElementById('giftDate').value);
        const reportDate = new Date(document.getElementById('reportDate').value);

        // 과거 증여 금액 합산
        const pastGifts = Array.from(document.querySelectorAll('.pastGift'))
            .map(input => parseNumber(input.value))
            .reduce((sum, val) => sum + val, 0);

        // 공제 한도 설정
        let exemption = 0;
        if (relationship === '배우자') exemption = 600000000;
        else if (relationship === '직계비속') exemption = 50000000;
        else if (relationship === '미성년자') exemption = 20000000;
        else if (relationship === '사위/며느리') exemption = 50000000;
        else exemption = 10000000;

        // 총 증여 금액 계산
        const totalGift = giftAmount + pastGifts;

        // 과세 표준 계산
        const taxableAmount = totalGift - exemption;

        // 증여세 계산
        let tax = 0;
        if (taxableAmount > 0) {
            if (taxableAmount <= 100000000) tax = taxableAmount * 0.1;
            else if (taxableAmount <= 500000000) tax = taxableAmount * 0.2 - 10000000;
            else if (taxableAmount <= 1000000000) tax = taxableAmount * 0.3 - 60000000;
            else if (taxableAmount <= 3000000000) tax = taxableAmount * 0.4 - 160000000;
            else tax = taxableAmount * 0.5 - 460000000;
        }

        // 취득세 계산
        let acquisitionTax = 0;
        if (assetType === '부동산') acquisitionTax = giftAmount * 0.03;
        else if (assetType === '주식') acquisitionTax = giftAmount * 0.01;

        // 부가세 계산 (취득세의 10%)
        const additionalTax = acquisitionTax * 0.1;

        // 과태료 계산 (신고일 지연 시)
        const delayInDays = Math.floor((reportDate - giftDate) / (1000 * 60 * 60 * 24));
        const lateFee = delayInDays > 90 ? tax * 0.01 * Math.ceil(delayInDays / 30) : 0;

        // 결과 출력
        document.getElementById('result').innerHTML = `
            총 증여 금액: ${formatNumber(totalGift)}원<br>
            과세 표준: ${formatNumber(taxableAmount)}원<br>
            계산된 증여세: ${formatNumber(tax)}원<br>
            취득세: ${formatNumber(acquisitionTax)}원<br>
            부가세: ${formatNumber(additionalTax)}원<br>
            과태료: ${formatNumber(lateFee)}원
        `;
    });
});
