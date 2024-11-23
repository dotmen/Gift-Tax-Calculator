document.addEventListener('DOMContentLoaded', () => {
    const formatNumber = (num) => num.toLocaleString('ko-KR');
    const parseNumber = (str) => parseInt(str.replace(/,/g, ''), 10) || 0;

    // 부동산 유형에 따라 다르게 표시
    const assetTypeSelect = document.getElementById('assetType');
    const propertyTypeContainer = document.getElementById('propertyTypeContainer');

    assetTypeSelect.addEventListener('change', () => {
        propertyTypeContainer.style.display = assetTypeSelect.value === '부동산' ? 'block' : 'none';
    });

    // 계산 버튼 클릭
    document.getElementById('calculateButton').addEventListener('click', () => {
        const assetType = document.getElementById('assetType').value;
        const giftAmount = parseNumber(document.getElementById('giftAmount').value);

        let acquisitionTax = 0; // 취득세
        let educationTax = 0; // 지방교육세

        if (assetType === '부동산') {
            const propertyType = document.getElementById('propertyType').value;

            // 부동산 세부 유형별 취득세율 설정
            if (propertyType === '주택') {
                acquisitionTax = giftAmount <= 600000000 ? giftAmount * 0.01 :
                                 giftAmount <= 900000000 ? giftAmount * 0.02 : giftAmount * 0.03;
            } else if (propertyType === '상가') {
                acquisitionTax = giftAmount * 0.04; // 상가 4%
            }

            // 지방교육세 계산
            educationTax = acquisitionTax * 0.2;
        }

        // 결과 출력
        document.getElementById('result').innerHTML = `
            자산 유형: ${assetType}<br>
            총 증여 금액: ${formatNumber(giftAmount)}원<br>
            ${
                assetType === '부동산'
                    ? `
                부동산 세부 유형: ${propertyType}<br>
                취득세: ${formatNumber(acquisitionTax)}원<br>
                지방교육세: ${formatNumber(educationTax)}원<br>
                `
                    : ''
            }
        `;
    });
});
