document.addEventListener('DOMContentLoaded', () => {
    const calculateGiftTax = () => {
        const assetType = document.getElementById('assetType').value;
        const giftAmount = parseFloat(document.getElementById('giftAmount').value);
        const relationship = document.getElementById('relationship').value;
        const pastGifts = parseFloat(document.getElementById('pastGifts').value || 0);
        const aggregationPeriod = document.getElementById('aggregationPeriod').value;

        // 공제 한도 설정
        let exemption = 0;
        if (relationship === '배우자') {
            exemption = 600000000;
        } else if (relationship === '직계비속') {
            exemption = 50000000;
        } else if (relationship === '사위/며느리') {
            exemption = 50000000; // 동일하게 설정
        } else {
            exemption = 10000000;
        }

        // 증여 합산 계산
        let totalGiftAmount = giftAmount;
        if (aggregationPeriod === '10년' || aggregationPeriod === '5년') {
            totalGiftAmount += pastGifts;
        }

        // 과세 표준 계산
        let taxableAmount = totalGiftAmount - exemption;
        if (taxableAmount <= 0) {
            document.getElementById('result').innerText = "증여세는 발생하지 않습니다.";
            return;
        }

        // 세율 및 누진 공제 계산
        let tax = 0;
        if (taxableAmount <= 100000000) {
            tax = taxableAmount * 0.1;
        } else if (taxableAmount <= 500000000) {
            tax = taxableAmount * 0.2 - 10000000;
        } else if (taxableAmount <= 1000000000) {
            tax = taxableAmount * 0.3 - 60000000;
        } else if (taxableAmount <= 3000000000) {
            tax = taxableAmount * 0.4 - 160000000;
        } else {
            tax = taxableAmount * 0.5 - 460000000;
        }

        // 결과 출력
        document.getElementById('result').innerText = `과세 표준: ${taxableAmount.toLocaleString()}원\n계산된 증여세: ${tax.toLocaleString()}원\n총 증여 금액 (합산 포함): ${totalGiftAmount.toLocaleString()}원`;
    };

    // 이벤트 리스너 추가
    document.querySelector('button').addEventListener('click', calculateGiftTax);
});
