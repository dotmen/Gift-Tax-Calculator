async function calculateTax() {
    const giftAmount = document.getElementById("giftAmount").value;
    const pastGiftAmount = document.getElementById("pastGiftAmount").value;
    const relationship = document.getElementById("relationship").value;
    const giftDate = document.getElementById("giftDate").value;
    const declarationDate = document.getElementById("declarationDate").value;

    const response = await fetch("/calculate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            giftAmount: parseInt(giftAmount.replace(/,/g, ""), 10) || 0,
            pastGiftAmount: parseInt(pastGiftAmount.replace(/,/g, ""), 10) || 0,
            relationship,
            giftDate,
            declarationDate,
        }),
    });

    const result = await response.json();
    document.getElementById("result").innerHTML = `
        <b>결과:</b><br>
        기본 증여세: ${result.basicTax}원<br>
        가산세: ${result.penaltyTax}원<br>
        총 납부 세액: ${result.totalTax}원
    `;
}
