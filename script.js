// 숫자 입력 필드에 실시간으로 콤마 추가
function formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function removeCommas(value) {
    return value.replace(/,/g, "");
}

document.getElementById("giftAmount").addEventListener("input", function (e) {
    const input = e.target;
    const rawValue = removeCommas(input.value); // 콤마 제거 후 숫자만 남기기
    if (!isNaN(rawValue) && rawValue !== "") {
        input.value = formatNumberWithCommas(rawValue); // 다시 콤마 추가
    } else {
        input.value = ""; // 잘못된 입력은 공백 처리
    }
});

document.getElementById("previousGift").addEventListener("input", function (e) {
    const input = e.target;
    const rawValue = removeCommas(input.value); // 콤마 제거 후 숫자만 남기기
    if (!isNaN(rawValue) && rawValue !== "") {
        input.value = formatNumberWithCommas(rawValue); // 다시 콤마 추가
    } else {
        input.value = ""; // 잘못된 입력은 공백 처리
    }
});

document.getElementById('taxForm').onsubmit = function (e) {
    e.preventDefault();

    const giftAmount = parseInt(removeCommas(document.getElementById('giftAmount').value)) || 0;
    const exemptionLimit = parseInt(document.getElementById('relationship').value) || 0;
    const previousGift = parseInt(removeCommas(document.getElementById('previousGift').value)) || 0;

    const totalTaxable = Math.max(giftAmount + previousGift - exemptionLimit, 0);
    const taxBrackets = [
        { limit: 100000000, rate: 0.1, deduction: 0 },
        { limit: 500000000, rate: 0.2, deduction: 10000000 },
        { limit: 1000000000, rate: 0.3, deduction: 60000000 },
        { limit: 3000000000, rate: 0.4, deduction: 160000000 },
        { limit: Infinity, rate: 0.5, deduction: 460000000 }
    ];

    let tax = 0;
    for (let bracket of taxBrackets) {
        if (totalTaxable > bracket.limit) {
            tax += (bracket.limit - (taxBrackets[taxBrackets.indexOf(bracket) - 1]?.limit || 0)) * bracket.rate;
        } else {
            tax += (totalTaxable - (taxBrackets[taxBrackets.indexOf(bracket) - 1]?.limit || 0)) * bracket.rate;
            tax -= bracket.deduction;
            break;
        }
    }

    document.getElementById('result').innerHTML = `
        증여세: ${Math.max(tax, 0).toLocaleString()}원<br>
        가산세: ${(tax * 0.2).toLocaleString()}원<br>
        최종 납부세액: ${(Math.max(tax, 0) + tax * 0.2).toLocaleString()}원
    `;
};
