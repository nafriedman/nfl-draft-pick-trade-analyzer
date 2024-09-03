from flask import Blueprint, request, current_app, jsonify
from trade_analyzer.core.analyze import analyze_trade
from trade_analyzer.core.validate import validate_picks
import json

bp = Blueprint('api', __name__)

@bp.route('/analyze-trade', methods=['POST'])
def analyze_trade_route():
    current_app.logger.info("Analyze trade route hit!")

    # Check if the content type is application/json
    if request.content_type != 'application/json':
        return jsonify({
            "error": "Unsupported Media Type",
            "message": "Content-Type must be application/json"
        }), 415 # Error: Unsupported media type

    # Check if the request data is valid JSON
    try:
        data = json.loads(request.data)
    except json.JSONDecodeError as e:
        return jsonify({
            "error": "Bad Request",
            "message": f"Failed to decode JSON object: {str(e)}"
        }), 400 # Error: Bad Request

    current_app.logger.info(request.json)

    # Get the data from the request
    data = request.json
    current_app.logger.info(f"Received data: {data}")
    team1_picks = data.get('team1_picks', [])
    team2_picks = data.get('team2_picks', [])
    value_chart = data.get('value_chart', 'jimmy_johnson')

    # Other validations
    valid1, team1_picks = validate_picks(team1_picks)
    valid2, team2_picks = validate_picks(team2_picks)
    if not valid1 or not valid2:
        return jsonify({"error": "Bad Request",
                        "message": "Please provide a list of comma-separated numbers between 1 and 260 for each input."}), 400

    return jsonify(analyze_trade(team1_picks, team2_picks, value_chart))
