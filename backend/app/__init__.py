from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    
    app.config['SECRET_KEY'] = 'dev-secret-key'
    
    CORS(app)
    
    from app.routes.api import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')
    
    @app.route('/')
    def home():
        return {'message': 'SMM API is running', 'status': 'ok'}
    
    return app