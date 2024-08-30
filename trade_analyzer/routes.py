from flask import Blueprint, request, current_app, jsonify
from trade_analyzer.core.analyze import analyze_trade
from trade_analyzer.core.validate import validate_picks

bp = Blueprint('api', __name__)

@bp.route('/analyze-trade', methods=['POST'])
def analyze_trade_route():
    current_app.logger.info("Analyze trade route hit!")
    data = request.json
    team1_picks = data.get('team1_picks', [])
    team2_picks = data.get('team2_picks', [])

    if not validate_picks(team1_picks) or not validate_picks(team2_picks):
        return jsonify({"error": "Invalid input. Please provide a list ofcomma-separated numbers between 1 and 260 for each input."}), 400

    result = analyze_trade(team1_picks, team2_picks)
    return jsonify(result)
