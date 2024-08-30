from flask import current_app

def validate_picks(picks):
    # # Check if picks is a list
    if not isinstance(picks, list):
        current_app.logger.error(f"Error: Not a list")
        return False
    # Check if all picks are integers between 1 and 260
    try:
        int_picks = [int(pick) for pick in picks]
        current_app.logger.info(f"Picks: {int_picks}")
        return all(1 <= pick <= 260 for pick in int_picks)
    except ValueError:
        current_app.logger.error(f"Error: Non-integer pick value(s) in {picks}")
        return False
