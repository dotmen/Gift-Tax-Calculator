document.addEventListener('DOMContentLoaded', () => {
    const togglePastGiftButton = document.getElementById('toggle-past-gift');
    const pastGiftSection = document.getElementById('past-gift-section');
    const form = document.getElementById('gift-tax-form');

    // 과거 증여 금액 입력 필드 토글
    togglePastGiftButton.addEventListener('click', () => {
        if (pastGiftSection.style.display === 'none') {
            pastGiftSection.style.display = 'block';
            togglePastGiftButton.textContent = '과거 증여 금액 숨기기';
        } else {
            pastGiftSection.style.display = 'none';
            togglePastGiftButton.textContent = '과거 증여 금액 추가';
        }
    });

    // 숫자에 콤마 추가하는 함수
    function formatNumberWithCommas(input) {
        const value = input.replace(/,/g, ''); // 콤마 제거
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, ','); // 콤마 추가
    }

    // 숫자에서 콤마 제거 (숫자만 반환)
    function parseNumber(input) {
        return parseFloat(input.replace(/,/g, '')) || 0; // 숫자로 변환하거나 0 반환
    }

    // 콤마 처리 이벤트 연결 (평가 금액)
    document.getElementById('asset-value').addEventListener('input', function () {
        this.value = formatNumberWithCommas(this.value);
    });

    // 콤마 처리 이벤트 연결 (과거 증여 금액)
    document.getElementById('past-gift').addEventListener('input', function () {
        this.value = formatNumberWithCommas(this.value);
    });

    // 폼 제출 이벤트 처리
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // 입력값 가져오기
        const valuationMethod = document.getElementById('valuation-method').value;
        const assetValue = parseNumber(document.getElementById('asset-value').value); // 콤마 제거 후 숫자 반환
        const relationship = document.getElementById('relationship').value;
        const pastGift = parseNumber(document.getElementById('past-gift').value); // 콤마 제거 후 숫자 반환
        const giftDate = document.getElementById('gift-date').value;
        const reportDate = document.getElementById('report-date').value;

        // 입력값 유효성 검사
        if (assetValue <= 0) {
            alert("평가 금액을 올바르게 입력하세요.");
            return;
        }

        // 백엔드에 데이터 전달
        try {
            const response = await fetch('/calculate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    value: assetValue,
                    past_gift: pastGift,
                    relationship,
                    is_minor: relationship === 'minor',
                    gift_date: giftDate,
                    report_date: reportDate
                })
            });

            const result = await response.json();

            // 결과 표시
            document.getElementById('gift-tax').textContent = `₩${result.gift_tax.toLocaleString()}`;
            document.getElementById('penalty').textContent = `₩${result.penalty.toLocaleString()}`;
            document.getElementById('total-tax').textContent = `₩${result.total_tax.toLocaleString()}`;
            document.getElementById('result').style.display = 'block';
        } catch (error) {
            alert("계산 중 오류가 발생했습니다. 다시 시도해주세요.");
            console.error(error);
        }
    });
});
