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

    const tax = totalTaxable > 0 ? totalTaxable * 0.2 : 0;

    document.getElementById('result').innerHTML = `
        증여세: ${tax.toLocaleString()}원
    `;
};
