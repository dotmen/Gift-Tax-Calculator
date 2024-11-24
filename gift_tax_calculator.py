from flask import Flask, request, jsonify
from datetime import datetime, timedelta

app = Flask(__name__)

# 공제 금액 계산
def calculate_deduction(relationship, is_minor=False):
    deductions = {
        "spouse": 600000000,  # 배우자
        "child": 50000000 if not is_minor else 20000000,  # 성년: 5천만 원, 미성년: 2천만 원
        "sibling": 10000000,  # 형제/자매
        "others": 0           # 기타
    }
    return deductions.get(relationship, 0)

# 증여세 계산
def calculate_gift_tax(value, past_gift, relationship, is_minor=False):
    # 과거 증여 합산
    total_gift = value + past_gift

    # 공제 금액 계산
    deduction = calculate_deduction(relationship, is_minor)
    taxable_amount = total_gift - deduction

    if taxable_amount <= 0:
        return {"gift_tax": 0, "combined_gift": total_gift}

    # 증여세율 테이블
    tax_brackets = [
        (100000000, 0.1, 0),
        (500000000, 0.2, 10000000),
        (1000000000, 0.3, 60000000),
        (3000000000, 0.4, 160000000),
        (float('inf'), 0.5, 460000000)
    ]

    # 누진세율 계산
    for limit, rate, deduction in tax_brackets:
        if taxable_amount <= limit:
            gift_tax = taxable_amount * rate - deduction
            return {"gift_tax": gift_tax, "combined_gift": total_gift}

    # 최대 세율 적용
    gift_tax = taxable_amount * 0.5 - 460000000
    return {"gift_tax": gift_tax, "combined_gift": total_gift}

# 가산세 계산
def calculate_penalty(gift_date, report_date, gift_tax):
    # 신고 기한: 증여일로부터 3개월
    gift_date = datetime.strptime(gift_date, "%Y-%m-%d")
    report_date = datetime.strptime(report_date, "%Y-%m-%d")
    deadline = gift_date + timedelta(days=90)

    overdue_days = max(0, (report_date - deadline).days)

    if overdue_days <= 0:
        return 0  # 기한 내 신고

    penalty_rate = 0.00025  # 하루 0.025%
    return round(gift_tax * penalty_rate * overdue_days)

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json
    value = data.get('value', 0)
    past_gift = data.get('past_gift', 0)
    relationship = data.get('relationship', 'others')
    is_minor = data.get('is_minor', False)
    gift_date = data.get('gift_date')
    report_date = data.get('report_date')

    # 증여세 계산
    gift_tax_result = calculate_gift_tax(value, past_gift, relationship, is_minor)

    # 가산세 계산
    penalty = calculate_penalty(gift_date, report_date, gift_tax_result['gift_tax'])

    # 총 세금 계산
    total_tax = gift_tax_result['gift_tax'] + penalty

    return jsonify({
        "gift_tax": gift_tax_result['gift_tax'],
        "combined_gift": gift_tax_result['combined_gift'],
        "penalty": penalty,
        "total_tax": total_tax
    })

if __name__ == '__main__':
    app.run(debug=True)
