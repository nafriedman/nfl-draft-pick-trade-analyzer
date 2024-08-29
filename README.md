# NFL Draft Trade Analyzer

## Introduction

The NFL Draft Trade Analyzer is a Flask-based web application designed to help NFL teams and fans evaluate potential draft pick trades. It uses the Jimmy Johnson draft value chart to assess the fairness of trades involving draft picks.

This tool allows users to input draft picks from two teams and calculates the total value for each side of the trade, providing insights into whether a trade is balanced or favors one team over the other.

## Features

- Input multiple draft picks for each team via the web interface
- Automatic calculation of trade values based on the Jimmy Johnson chart
- Visual representation of trade balance
- Responsive design for desktop and mobile use

## Prerequisites

- Python 3.7+
- pip (Python package installer)

No additional database installation is required as the application uses SQLite, which comes built-in with Python.

## How to Use

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
   flask --app trade_analyzer run
   ```

6. Open your web browser and navigate to `http://localhost:5000`.

7. Use the web interface to input draft picks for two teams and analyze potential trades.
