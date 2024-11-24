document.addEventListener('DOMContentLoaded', function () {
    const taxBrackets = [
        { limit: 100000000, rate: 10, deduction: 0 },
        { limit: 500000000, rate: 20, deduction: 10000000 },
        { limit: 1000000000, rate: 30, deduction: 60000000 },
        { limit: 3000000000, rate: 40, deduction: 160000000 },
        { limit: Infinity, rate: 50, deduction: 460000000 }
    ];

    // 숫자에 콤마 추가
    function formatNumberWithCommas(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // 콤마 제거
    function removeCommas(value) {
        return value.replace(/,/g, '');
    }

    // 입력 필드에 실시간 콤마 추가
    const giftAmountInput = document.getElementById('giftAmount');
    giftAmountInput.addEventListener('input', function () {
        const rawValue = removeCommas(this.value);
        if (!isNaN(rawValue) && rawValue !== '') {
            this.value = formatNumberWithCommas(rawValue);
        } else {
            this.value = ''; // 잘못된 값 초기화
        }
    });

    // 증여세 계산
    document.getElementById('taxForm').onsubmit = function (e) {
        e.preventDefault();

        const giftAmount = parseInt(removeCommas(giftAmountInput.value)) || 0;
        const exemption = parseInt(document.getElementById('relationship').value) || 0;

        const taxableAmount = Math.max(giftAmount - exemption, 0);

        let tax = 0;
        for (let i = 0; i < taxBrackets.length; i++) {
            const bracket = taxBrackets[i];
            const prevLimit = taxBrackets[i - 1]?.limit || 0;

            if (taxableAmount > bracket.limit) {
                tax += (bracket.limit - prevLimit) * (bracket.rate / 100);
            } else {
                tax += (taxableAmount - prevLimit) * (bracket.rate / 100);
                tax -= bracket.deduction;
                break;
            }
        }

        tax = Math.max(tax, 0);

        // 결과 출력
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `
            <p><strong>증여 금액:</strong> ${giftAmount.toLocaleString()}원</p>
            <p><strong>공제 한도:</strong> ${exemption.toLocaleString()}원</p>
            <p><strong>과세 표준:</strong> ${taxableAmount.toLocaleString()}원</p>
            <p><strong>증여세:</strong> ${tax.toLocaleString()}원</p>
        `;
    };
});
