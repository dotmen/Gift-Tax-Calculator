from flask import Flask, request, jsonify
from datetime import datetime, timedelta

app = Flask(__name__)

@app.route('/calculate', methods=['POST'])
def calculate_gift_tax():
    data = request.json
    current_gift = data.get('current_gift', 0)
    past_gift = data.get('past_gift', 0)
    relationship = data.get('relationship')
    gift_date = datetime.strptime(data.get('gift_date'), "%Y-%m-%d")
    report_date = datetime.strptime(data.get('report_date'), "%Y-%m-%d")
    include_penalty = data.get('include_penalty', False)

    # 계산 로직 호출 (생략된 부분은 위 예제 활용)
    result = calculate_combined_gift_tax(current_gift, past_gift, relationship)
    penalty_result = calculate_penalty(gift_date, report_date, result['gift_tax'], include_penalty)

    return jsonify({
        "gift_tax": result['gift_tax'],
        "combined_gift": result['combined_gift'],
        "penalty": penalty_result['penalty'],
        "total_tax": penalty_result['total_tax']
    })

if __name__ == '__main__':
    app.run(debug=True)
