document.getElementById('pastGiftButton').addEventListener('click', () => {
  const pastGiftSection = document.getElementById('pastGiftSection');
  pastGiftSection.classList.toggle('hidden');
});

document.getElementById('amount').addEventListener('input', (e) => {
  e.target.value = formatNumber(e.target.value.replace(/,/g, ""));
});

document.getElementById('pastAmount').addEventListener('input', (e) => {
  e.target.value = formatNumber(e.target.value.replace(/,/g, ""));
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

  console.log("보내는 데이터:", data); // 데이터 확인용 로그

  try {
    const response = await fetch('/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("서버 응답 오류");
    }

    const result = await response.json();
    console.log("서버에서 받은 결과:", result); // 서버 응답 확인용 로그
    document.getElementById('result').innerText = `계산 결과: ${result.totalTax.toLocaleString()} 원`;
  } catch (error) {
    console.error("계산 중 오류 발생:", error);
    document.getElementById('result').innerText = '계산 중 오류가 발생했습니다.';
  }
});

function formatNumber(num) {
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
