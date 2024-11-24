from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json
    gift_amount = data.get('giftAmount', 0)
    past_gifts = data.get('pastGifts', 0)
    relationship = data.get('relationship', '')
    aggregation_period = data.get('aggregationPeriod', '')

    # 공제 한도 설정
    exemption = 0
    if relationship == '배우자':
        exemption = 600000000
    elif relationship == '직계비속':
        exemption = 50000000
    elif relationship == '사위/며느리':
        exemption = 50000000
    else:
        exemption = 10000000

    # 합산 계산
    total_gift_amount = gift_amount
    if aggregation_period in ['10년', '5년']:
        total_gift_amount += past_gifts

    taxable_amount = total_gift_amount - exemption
    if taxable_amount <= 0:
        return jsonify({"result": "증여세는 발생하지 않습니다."})

    # 누진세율 계산
    tax = 0
    if taxable_amount <= 100000000:
        tax = taxable_amount * 0.1
    elif taxable_amount <= 500000000:
        tax = taxable_amount * 0.2 - 10000000
    elif taxable_amount <= 1000000000:
        tax = taxable_amount * 0.3 - 60000000
    elif taxable_amount <= 3000000000:
        tax = taxable_amount * 0.4 - 160000000
    else:
        tax = taxable_amount * 0.5 - 460000000

    return jsonify({"taxableAmount": taxable_amount, "tax": tax})

if __name__ == '__main__':
    app.run(debug=True)
