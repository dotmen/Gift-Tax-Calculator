from flask import Flask, render_template, request, jsonify
from datetime import datetime

app = Flask(__name__)

# 증여세 계산 함수
def calculate_gift_tax(data):
    try:
        # 데이터 가져오기 및 기본값 설정
        amount = data.get('amount', 0)
        past_amount = data.get('pastAmount', 0)
        relation = data.get('relation', 'others')
        gift_date = datetime.strptime(data.get('giftDate', '2000-01-01'), '%Y-%m-%d')
        submission_date = datetime.strptime(data.get('submissionDate', '2000-01-01'), '%Y-%m-%d')

        # 기본 증여세율 및 공제액 설정
        tax_rate = 0.1
        if relation == "spouse":
            deduction = 600000000  # 배우자 공제
        elif relation == "child":
            deduction = 50000000  # 성인 직계비속 공제
        elif relation == "minor":
            deduction = 20000000  # 미성년자 공제
        elif relation == "inLaw":
            deduction = 30000000  # 사위/며느리 공제
        else:
            deduction = 10000000  # 기타 공제

        # 과세표준 계산
        taxable_amount = max(0, (amount + past_amount - deduction))

        # 가산세 계산
        months_late = (submission_date - gift_date).days // 30
        penalty_rate = 0.0
        if months_late > 6:
            penalty_rate = 0.2
        elif months_late > 3:
            penalty_rate = 0.1

        # 증여세 계산
        base_tax = taxable_amount * tax_rate
        penalty_tax = taxable_amount * penalty_rate
        total_tax = base_tax + penalty_tax

        return {
            "taxableAmount": taxable_amount,
            "baseTax": base_tax,
            "penaltyTax": penalty_tax,
            "totalTax": total_tax,
        }
    except Exception as e:
        print("계산 함수 오류:", e)
        raise

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    try:
        data = request.get_json()
        print("수신된 데이터:", data)
        result = calculate_gift_tax(data)
        return jsonify(result)
    except Exception as e:
        print("오류 발생:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
