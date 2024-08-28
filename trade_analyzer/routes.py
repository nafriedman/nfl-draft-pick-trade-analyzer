from flask import Blueprint, request, current_app, render_template, jsonify
from trade_analyzer.analyze import analyze_trade

bp = Blueprint('api', __name__)

@bp.route('/analyze-trade', methods=['POST'])
def analyze_trade_route():
    current_app.logger.info("Analyze trade route hit!")
    data = request.json
    team1_picks = data.get('team1_picks', [])
    team2_picks = data.get('team2_picks', [])

    result = analyze_trade(team1_picks, team2_picks)
    return result
