document.addEventListener('DOMContentLoaded', () => {
    const formatNumber = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const parseNumber = (str) => parseFloat(str.replace(/,/g, ''));

    // 금액 입력 시 콤마 처리
    document.getElementById('giftAmount').addEventListener('input', (e) => {
        const value = parseNumber(e.target.value) || '';
        e.target.value = value ? formatNumber(value) : '';
    });

    // 과거 증여 금액 추가 버튼 클릭 이벤트
    document.getElementById('addGiftButton').addEventListener('click', () => {
        const container = document.getElementById('pastGiftsContainer');

        // 새 입력 필드 생성
        const newInput = document.createElement('input');
        newInput.type = 'text';
        newInput.className = 'pastGift';
        newInput.placeholder = '예: 10,000,000';

        // 콤마 처리 이벤트 추가
        newInput.addEventListener('input', (e) => {
            const value = parseNumber(e.target.value) || '';
            e.target.value = value ? formatNumber(value) : '';
        });

        // 입력 필드를 컨테이너의 첫 번째 자식으로 추가 (위에 추가)
        container.insertBefore(newInput, container.firstChild);
    });

    // 계산 버튼 클릭 이벤트
    document.getElementById('calculateButton').addEventListener('click', () => {
        const giftAmount = parseNumber(document.getElementById('giftAmount').value) || 0;
        const relationship = document.getElementById('relationship').value;

        // 과거 증여 금액 합산
        const pastGifts = [...document.querySelectorAll('.pastGift')]
            .map(input => parseNumber(input.value) || 0)
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

        // 세율에 따른 증여세 계산
        let tax = 0;
        if (taxableAmount > 0) {
            if (taxableAmount <= 100000000) tax = taxableAmount * 0.1;
            else if (taxableAmount <= 500000000) tax = taxableAmount * 0.2 - 10000000;
            else if (taxableAmount <= 1000000000) tax = taxableAmount * 0.3 - 60000000;
            else if (taxableAmount <= 3000000000) tax = taxableAmount * 0.4 - 160000000;
            else tax = taxableAmount * 0.5 - 460000000;
        }

        // 결과 출력
        document.getElementById('result').innerHTML = `
            총 증여 금액: ${formatNumber(totalGift)}원<br>
            과세 표준: ${formatNumber(taxableAmount)}원<br>
            계산된 증여세: ${formatNumber(tax)}원
        `;
    });
});
