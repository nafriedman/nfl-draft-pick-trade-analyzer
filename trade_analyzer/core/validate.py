from flask import current_app, jsonify
import json

def validate_content_type(request):
     if request.content_type != 'application/json':
        return jsonify({
            "error": "Unsupported Media Type",
            "message": "Content-Type must be application/json"
        }), 415 # Error: Unsupported media type

def parse_request_data(request):
    # Check if the request data is valid JSON
    try:
        data = json.loads(request.data)
        # Get the data from the request
        current_app.logger.info(f"Received data: {data}")
        if 'team1_picks' not in data or 'team2_picks' not in data:
            raise KeyError("Missing required keys: 'team1_picks' and/or 'team2_picks'")
        team1_picks = data.get('team1_picks', [])
        team2_picks = data.get('team2_picks', [])
        value_chart = data.get('value_chart', 'jimmy_johnson')
    # Check if the data is valid JSON
    except json.JSONDecodeError as e:
        error_response = jsonify({
            "error": "Bad Request",
            "message": f"Failed to decode JSON object: {str(e)}"
        }), 400 # Error: Bad Request
        return error_response
    # Catch missing keys
    except KeyError as e:
        error_response = jsonify({
            "error": "Bad Request",
            "message": "Missing required keys: 'team1_picks' and/or 'team2_picks'"
        }), 400 # Error: Bad Request
        return error_response
    # Catch any other exceptions
    except Exception as e:
        error_response = jsonify({
            "error": "Bad Request",
            "message": f"An error occurred: {str(e)}"
        }), 400 # Error: Bad Request
        return error_response
    return team1_picks, team2_picks, value_chart

def validate_picks(picks):
    if not isinstance(picks, list):
        current_app.logger.info(f"Error: Not a list")
        return jsonify({"error": "Bad Request",
                        "message": "Please provide a list of comma-separated numbers between 1 and 260 for each input."}), 400
    try:
        int_picks = [int(pick) for pick in picks]
        if all(1 <= pick <= 260 for pick in int_picks):
            return int_picks
        else:
            current_app.logger.info(f"Error: Pick(s) out of range in {int_picks}")
            return jsonify({"error": "Bad Request",
                        "message": "Please provide a list of comma-separated numbers between 1 and 260 for each input."}), 400
    except ValueError:
        current_app.logger.info(f"Error: Non-integer pick value(s) in {picks}")
        return jsonify({"error": "Bad Request",
                        "message": "Please provide a list of comma-separated numbers between 1 and 260 for each input."}), 400

def validate_data(request):
     ''' Main validation function that returns the picks and value chart if
     valid, or an error response if any validation fails.'''
     # Check if the content type is application/json
     content_type_result = validate_content_type(request)
     if content_type_result:
         return None, None, None, content_type_result

     # Check if data is valid JSON, and if so, retrieve data
     json_result = parse_request_data(request)
     if isinstance(json_result, tuple) and isinstance(json_result[0], current_app.response_class):  # Error response
         return None, None, None, json_result
     team1_picks_raw, team2_picks_raw, value_chart = json_result

     # Additional Validations
     team1_picks_result = validate_picks(team1_picks_raw)
     if isinstance(team1_picks_result, tuple) and isinstance(team1_picks_result[0], current_app.response_class):  # Error response
         return None, None, None, team1_picks_result

     team2_picks_result = validate_picks(team2_picks_raw)
     if isinstance(team2_picks_result, tuple) and isinstance(team2_picks_result[0], current_app.response_class):  # Error response
         return None, None, None, team2_picks_result

     return team1_picks_result, team2_picks_result, value_chart, None
