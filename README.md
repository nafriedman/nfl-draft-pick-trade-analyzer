# NFL Draft Trade Analyzer

## Introduction

The NFL Draft Trade Analyzer is a Flask-based web API designed to help NFL teams and fans evaluate potential draft pick trades to assess the fairness of trades involving draft picks. The analysis can be performed using one of several popular NFL draft value charts such as those popularized by Jimmy Johnson, Fitzgerald-Spielberger, and many others.

## Prerequisites

- Python 3.7+
- pip (Python package installer)

No additional database installation is required as the application uses SQLite, which comes built-in with Python.

## How to Use Locally
Skip this section if you only want to use the API directly.

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/nfl-draft-trade-analyzer.git
   cd nfl-draft-trade-analyzer
   ```

2. Set up a virtual environment (optional but recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

4. Initialize the database and populate the Jimmy Johnson chart:
   ```
   flask --app trade_analyzer init-db
   ```

5. Run the application:
   ```
   flask --app trade_analyzer run --port <number>
   ```
   where ```<number>``` should be replaced by the port number you would like to use. You can also just leave out the ``` --port <number> ``` option in order to use the default port which is 5000.

6. Open your web browser and navigate to `http://127.0.0.1:<number>` where ```<number>``` is the port number specified above.

7. Use the web interface to input draft picks for two teams and analyze potential trades.

## How to Use the API

### Instructions

You can also use the NFL Draft Trade Analyzer as an API. Here's how to make a request:

1. Ensure the application is running locally (using the steps above) or server.

2. Send a POST request to the `/analyze-trade` endpoint with a JSON payload in the below format containing the draft picks as integer lists for each team and the value chart to use.

   ```
   curl -X POST http://127.0.0.1:5000/analyze-trade \
   -H "Content-Type: application/json" \
   -d '{
     "team1_picks": [10, 41],
     "team2_picks": [15, 78, 120],
     "value_chart": "jimmy_johnson"
   }'
   ```

4. The API will return a JSON response with the trade analysis.


### Example

Here's an example of making an API request using curl and the response you might receive:

#### Request:
  ```
   curl -X POST http://127.0.0.1:5000/analyze-trade \
   -H "Content-Type: application/json" \
   -d '{
     "team1_picks": [10, 41],
     "team2_picks": [15, 78, 120],
     "value_chart": "jimmy_johnson"
   }'
   ```
#### Response:
````
  {
    "difference": 486.0,
    "team1_value": 1790.0,
    "team2_value": 1304.0,
    "winner": "Team 2"
  }
````
