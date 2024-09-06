from flask import Blueprint, request, current_app, jsonify
from trade_analyzer.core.analyze import analyze_trade
from trade_analyzer.core.validate import validate_data
import json

bp = Blueprint('api', __name__)

@bp.route('/analyze-trade', methods=['POST'])
def analyze_trade_route():
    current_app.logger.info("Analyze trade route hit!")

    team1_picks, team2_picks, value_chart, error_response = validate_data(request)
    if error_response:
        return error_response

    return jsonify(analyze_trade(team1_picks, team2_picks, value_chart))
