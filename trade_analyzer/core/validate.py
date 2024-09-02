from flask import current_app

def validate_picks(picks):
    if not isinstance(picks, list):
        current_app.logger.error(f"Error: Not a list")
        return False, None
    try:
        int_picks = [int(pick) for pick in picks]
        if all(1 <= pick <= 260 for pick in int_picks):
            return True, int_picks
        else:
            current_app.logger.error(f"Error: Pick(s) out of range in {int_picks}")
            return False, None
    except ValueError:
        current_app.logger.error(f"Error: Non-integer pick value(s) in {picks}")
        return False, None
