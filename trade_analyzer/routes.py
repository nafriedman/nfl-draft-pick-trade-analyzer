from flask import Blueprint, request, current_app, jsonify
from trade_analyzer.core.analyze import analyze_trade
from trade_analyzer.core.validate import validate_picks

bp = Blueprint('api', __name__)

@bp.route('/analyze-trade', methods=['POST'])
def analyze_trade_route():
    current_app.logger.info("Analyze trade route hit!")

    # Get the data from the request
    data = request.json
    current_app.logger.info(f"Received data: {data}")
    team1_picks = data.get('team1_picks', [])
    team2_picks = data.get('team2_picks', [])
    value_chart = data.get('value_chart', 'jimmy_johnson')

    # Validate the picks
    valid1, team1_picks = validate_picks(team1_picks)
    valid2, team2_picks = validate_picks(team2_picks)
    if not valid1 or not valid2:
        return jsonify({"error": "Invalid input. Please provide a list of comma-separated numbers between 1 and 260 for each input."}), 400

    return jsonify(analyze_trade(team1_picks, team2_picks, value_chart))
