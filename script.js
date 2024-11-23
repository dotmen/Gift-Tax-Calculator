document.addEventListener('DOMContentLoaded', () => {
    const cashInput = document.getElementById('cashAmount');
    const calculateButton = document.getElementById('calculate');
    const giftTaxElement = document.getElementById('giftTax');

    function formatNumberWithCommas(value) {
        if (isNaN(value)) return value;
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function removeCommas(value) {
        return value.replace(/,/g, '');
    }

    calculateButton.addEventListener('click', () => {
        const cashValue = parseFloat(removeCommas(cashInput.value));
        if (isNaN(cashValue)) {
            alert('금액을 정확히 입력해주세요.');
            return;
        }
        const giftTax = cashValue * 0.1; // 10% 세율 예제
        giftTaxElement.textContent = formatNumberWithCommas(giftTax.toFixed(0));
        document.getElementById('results').classList.remove('hidden');
    });

    cashInput.addEventListener('input', () => {
        const unformattedValue = removeCommas(cashInput.value);
        cashInput.value = formatNumberWithCommas(unformattedValue);
    });
});
