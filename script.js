document.addEventListener('DOMContentLoaded', () => {
    const assetType = document.getElementById('assetType');
    const cashInput = document.getElementById('cashInput');
    const realEstateInput = document.getElementById('realEstateInput');
    const stockInput = document.getElementById('stockInput');
    const calculateButton = document.getElementById('calculate');
    const results = document.getElementById('results');

    const giftTaxElement = document.getElementById('giftTax');
    const penaltyTaxElement = document.getElementById('penaltyTax');
    const acquisitionTaxElement = document.getElementById('acquisitionTax');
    const localEducationTaxElement = document.getElementById('localEducationTax');
    const totalTaxElement = document.getElementById('totalTax');

    // 콤마 추가 함수
    function formatNumberWithCommas(value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // 자산 유형 변경 시 입력 필드 표시
    assetType.addEventListener('change', () => {
        cashInput.classList.add('hidden');
        realEstateInput.classList.add('hidden');
        stockInput.classList.add('hidden');

        if (assetType.value === 'cash') {
            cashInput.classList.remove('hidden');
        } else if (assetType.value === 'realEstate') {
            realEstateInput.classList.remove('hidden');
        } else if (assetType.value === 'stocks') {
            stockInput.classList.remove('hidden');
        }
    });

    // 증여세 계산
    calculateButton.addEventListener('click', () => {
        const assetValue = parseFloat(
            (assetType.value === 'cash'
                ? document.getElementById('cashAmount').value
                : assetType.value === 'realEstate'
                ? document.getElementById('realEstatePrice').value
                : document.getElementById('stockPrice').value
            ).replace(/,/g, '')
        );

        const relationship = document.getElementById('relationship').value;
        let exemptionLimit = 0;
        if (relationship === '1') exemptionLimit = 50000000; 
        else if (relationship === '2') exemptionLimit = 20000000; 
        else if (relationship === '3') exemptionLimit = 50000000; 
        else if (relationship === '4') exemptionLimit = 10000000;

        const taxableAmount = Math.max(assetValue - exemptionLimit, 0);
        let giftTax = 0;
        if (taxableAmount <= 100000000) giftTax = taxableAmount * 0.1;
        else if (taxableAmount <= 500000000) giftTax = 10000000 + (taxableAmount - 100000000) * 0.2;

        giftTaxElement.textContent = formatNumberWithCommas(giftTax.toFixed(0)) + ' 원';
        results.classList.remove('hidden');
    });
});
