import sqlite3
import click
from flask import current_app, g

def get_db():
    ''' Get the database connection '''
    if 'db' not in g:
        g.db = sqlite3.connect(
            current_app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row

    return g.db

def close_db(e=None):
    ''' Teardown function to close the database connection '''
    db = g.pop('db', None)

    if db is not None:
        db.close()

def init_db():
    ''' Initialize the database with the schema and tables'''
    db = get_db()

    with current_app.open_resource('schema.sql') as f:
        db.executescript(f.read().decode('utf8'))

    # Populate the database with Jimmy Johnson's chart table
    from .scripts import populate_jimmy_johnson_chart
    populate_jimmy_johnson_chart.init_jimmy_johnson_chart(current_app)

@click.command('init-db')
def init_db_command():
    ''' Clear the existing data and create new tables '''
    click.echo('Initializing the database...')
    init_db()
    click.echo('Initialized the database.')

def init_app(app):
    ''' Register teardown function and init db command with flask app '''
    # Register teardown function. This will be called when the request is handled.
    app.teardown_appcontext(close_db)
    # Register init db command.
    app.cli.add_command(init_db_command)
