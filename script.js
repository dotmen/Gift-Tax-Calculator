document.getElementById('gift-tax-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const currentGift = document.getElementById('current-gift').value;
    const pastGift = document.getElementById('past-gift').value;
    const relationship = document.getElementById('relationship').value;
    const giftDate = document.getElementById('gift-date').value;
    const reportDate = document.getElementById('report-date').value;
    const includePenalty = document.getElementById('include-penalty').checked;

    const response = await fetch('/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_gift: currentGift, past_gift: pastGift, relationship, gift_date: giftDate, report_date: reportDate, include_penalty: includePenalty })
    });

    const result = await response.json();
    document.getElementById('results').innerHTML = `
        <p>증여세: ${result.gift_tax.toLocaleString()}원</p>
        <p>가산세: ${result.penalty.toLocaleString()}원</p>
        <p>총 세금: ${result.total_tax.toLocaleString()}원</p>
    `;
});
