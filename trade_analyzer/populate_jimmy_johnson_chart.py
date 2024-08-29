import csv
from flask import current_app
from ...db import get_db

def populate_jimmy_johnson_chart():
    db = get_db()

    # Read the CSV file and insert data into the database
    with current_app.open_resource('../data/jimmy_johnson_draft_value.csv') as csv_file:
        csv_reader = csv.DictReader(csv_file.read().decode('utf-8').splitlines())
        for row in csv_reader:
            db.execute(
                'INSERT INTO jimmy_johnson_chart (pick_number, value) VALUES (?, ?)',
                (int(row['pick_number']), int(row['value']))
            )

    # Commit the changes
    db.commit()

    print("Jimmy Johnson chart data has been successfully populated in the database.")

def init_jimmy_johnson_chart(app):
    with app.app_context():
        populate_jimmy_johnson_chart()
