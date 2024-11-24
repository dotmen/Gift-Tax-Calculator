document.addEventListener('DOMContentLoaded', function () {
    // 콤마 추가 함수
    function formatNumberWithCommas(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // 콤마 제거 함수
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

    // 과거 증여 금액 추가 버튼
    const addGiftButton = document.getElementById('addGiftButton');
    addGiftButton.addEventListener('click', function () {
        const previousGifts = document.getElementById('previousGifts');
        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.placeholder = '예: 10,000,000';
        inputField.className = 'past-gift';
        inputField.addEventListener('input', function () {
            const rawValue = removeCommas(this.value);
            if (!isNaN(rawValue) && rawValue !== '') {
                this.value = formatNumberWithCommas(rawValue);
            } else {
                this.value = ''; // 잘못된 값 초기화
            }
        });
        previousGifts.appendChild(inputField);
    });

    // 과거 증여 금액 합산
    function getTotalPreviousGifts() {
        const inputs = document.querySelectorAll('#previousGifts input');
        let total = 0;
        inputs.forEach(input => {
            total += parseInt(removeCommas(input.value)) || 0;
        });
        return total;
    }

    // 증여세 계산
    document.getElementById('taxForm').onsubmit = function (e) {
        e.preventDefault();

        const giftAmount = parseInt(removeCommas(giftAmountInput.value)) || 0;
        const exemption = parseInt(document.getElementById('relationship').value) || 0;
        const previousGifts = getTotalPreviousGifts();
        const giftDate = document.getElementById('giftDate').value;
        const reportDate = document.getElementById('reportDate').value;

        const taxableAmount = Math.max(giftAmount + previousGifts - exemption, 0);

        // 증여세 계산 로직
        const taxBrackets = [
            { limit: 100000000, rate: 10, deduction: 0 },
            { limit: 500000000, rate: 20, deduction: 10000000 },
            { limit: 1000000000, rate: 30, deduction: 60000000 },
            { limit: 3000000000, rate: 40, deduction: 160000000 },
            { limit: Infinity, rate: 50, deduction: 460000000 }
        ];

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
            <p><strong>증여일:</strong> ${giftDate}</p>
            <p><strong>신고일:</strong> ${reportDate}</p>
        `;
    };
});
