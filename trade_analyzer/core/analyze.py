from ..db import get_db

def analyze_trade(team1_picks, team2_picks, value_chart):
    db = get_db()

    def calculate_value(picks):
        total_value = 0
        for pick in picks:
            cursor = db.execute(f'SELECT value FROM {value_chart}_chart WHERE pick_number = ?', (pick,))
            result = cursor.fetchone()
            if result:
                total_value += result['value']
        return total_value

    team1_value = calculate_value(team1_picks)
    team2_value = calculate_value(team2_picks)

    difference = abs(team1_value - team2_value)
    winner = "Team 2" if team1_value > team2_value else "Team 1" if team2_value > team1_value else "Fair Trade"

    return {
        "team1_value": team1_value,
        "team2_value": team2_value,
        "difference": difference,
        "winner": winner
    }
