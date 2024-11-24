document.getElementById('pastGiftButton').addEventListener('click', () => {
  const pastGiftSection = document.getElementById('pastGiftSection');
  pastGiftSection.classList.toggle('hidden');
});

document.getElementById('amount').addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
});

document.getElementById('pastAmount').addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
});

document.getElementById('calculateButton').addEventListener('click', async () => {
  const valuation = document.getElementById('valuation').value;
  const amount = document.getElementById('amount').value.replace(/,/g, "");
  const relation = document.getElementById('relation').value;
  const pastAmount = document.getElementById('pastAmount')?.value.replace(/,/g, "") || 0;
  const giftDate = document.getElementById('giftDate').value;
  const submissionDate = document.getElementById('submissionDate').value;

  const data = {
    valuation,
    amount: parseInt(amount, 10),
    relation,
    pastAmount: parseInt(pastAmount, 10),
    giftDate,
    submissionDate,
  };

  try {
    const response = await fetch('/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    document.getElementById('result').innerText = `계산 결과: ${result.totalTax.toLocaleString()} 원`;
  } catch (error) {
    document.getElementById('result').innerText = '계산 중 오류가 발생했습니다.';
    console.error(error);
  }
});
