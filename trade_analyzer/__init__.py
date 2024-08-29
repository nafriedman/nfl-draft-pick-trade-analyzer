import os
from flask import Flask, render_template

# Application Factory
def create_app(test_config=None):
    # Create app
    # When instance_relative_config is set to True, it tells Flask to look for configuration files relative to the "instance folder" instead of the application's root folder
    app = Flask(__name__, instance_relative_config=True)
    # set default configuration
    app.config.from_mapping(
        SECRET_KEY='dev', # should be overidden with random value when deploying
        DATABASE=os.path.join(app.instance_path, 'trade_analyzer.sqlite'),
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    @app.route('/', methods=('GET', 'POST'))
    def index():
        return render_template('base.html')

    @app.route('/debug/routes')
    def list_routes():
        output = []
        for rule in app.url_map.iter_rules():
            methods = ','.join(rule.methods)
            line = f"{rule.endpoint:50s} {methods:20s} {rule}"
            output.append(line)
        return "<br>".join(output)

    # initialize db for flask app
    from . import db
    db.init_app(app)

    from . import routes
    app.register_blueprint(routes.bp)

    return app
