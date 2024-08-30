def validate_picks(picks):
    # Check if picks is a list
    if not isinstance(picks, list):
        return False
    # Check if all picks are integers between 1 and 260
    return all(isinstance(pick, int) and 1 <= pick <= 260 for pick in picks)
