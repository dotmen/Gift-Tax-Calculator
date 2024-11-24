from flask import Flask, render_template, request, jsonify
from datetime import datetime

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/calculate", methods=["POST"])
def calculate():
    data = request.get_json()
    
    # 입력 값 처리
    gift_amount = data.get("giftAmount", 0)
    past_gift_amount = data.get("pastGiftAmount", 0)
    relationship = data.get("relationship")
    gift_date = datetime.strptime(data.get("giftDate"), "%Y-%m-%d")
    declaration_date = datetime.strptime(data.get("declarationDate"), "%Y-%m-%d")
    
    # 관계별 공제액
    exemptions = {
        "직계비속": 50000000,
        "직계존속": 50000000,
        "배우자": 600000000,
        "며느리": 10000000,
    }
    exemption = exemptions.get(relationship, 0)

    # 과거 증여 금액 합산 기준
    total_gift_amount = gift_amount
    current_year = datetime.now().year
    if relationship in ["직계비속", "직계존속"]:
        if current_year - gift_date.year <= 10:
            total_gift_amount += past_gift_amount
    elif relationship == "며느리":
        if current_year - gift_date.year <= 5:
            total_gift_amount += past_gift_amount

    # 과세표준 계산
    taxable_amount = max(0, total_gift_amount - exemption)

    # 누진세율 및 누진공제 적용
    tax_rate = [
        (50000000, 0.1, 0),
        (100000000, 0.2, 5000000),
        (300000000, 0.3, 15000000),
        (500000000, 0.4, 45000000),
        (float('inf'), 0.5, 95000000),
    ]
    basic_tax = 0
    for limit, rate, deduction in tax_rate:
        if taxable_amount <= limit:
            basic_tax = taxable_amount * rate - deduction
            break

    # 신고 기한 계산
    due_date = gift_date.replace(month=gift_date.month + 3)
    penalty_tax = 0
    if declaration_date > due_date:
        months_late = (declaration_date.year - due_date.year) * 12 + (declaration_date.month - due_date.month)
        penalty_tax = basic_tax * 0.02 * months_late

    total_tax = basic_tax + penalty_tax

    return jsonify({
        "basicTax": round(basic_tax),
        "penaltyTax": round(penalty_tax),
        "totalTax": round(total_tax)
    })

if __name__ == "__main__":
    app.run(debug=True)
