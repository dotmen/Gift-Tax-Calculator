document.addEventListener('DOMContentLoaded', () => {
    const togglePastGiftButton = document.getElementById('toggle-past-gift');
    const pastGiftSection = document.getElementById('past-gift-section');
    const form = document.getElementById('gift-tax-form');

    // 과거 증여 금액 입력 필드 토글
    togglePastGiftButton.addEventListener('click', () => {
        if (pastGiftSection.style.display === 'none') {
            pastGiftSection.style.display = 'block';
        } else {
            pastGiftSection.style.display = 'none';
        }
    });

    // 폼 제출 이벤트 처리
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // 입력값 가져오기
        const valuationMethod = document.getElementById('valuation-method').value;
        const assetValue = parseFloat(document.getElementById('asset-value').value);
        const relationship = document.getElementById('relationship').value;
        const pastGift = parseFloat(document.getElementById('past-gift').value) || 0;
        const giftDate = document.getElementById('gift-date').value;
        const reportDate = document.getElementById('report-date').value;

        if (isNaN(assetValue) || assetValue <= 0) {
            alert("평가 금액을 올바르게 입력하세요.");
            return;
        }

        // 백엔드에 데이터 전달
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
    });
});
