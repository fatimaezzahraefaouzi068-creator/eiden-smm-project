from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from app.models.models import db
from app.celery_app import make_celery

celery = None

def create_app():
    global celery
    app = Flask(__name__)
    
    app.config['SECRET_KEY'] = 'dev-secret-key'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:password@db:5432/smm_db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Configuration Celery
    app.config['CELERY_BROKER_URL'] = 'redis://redis:6379/0'
    app.config['CELERY_RESULT_BACKEND'] = 'redis://redis:6379/0'
    
    db.init_app(app)
    Migrate(app, db)
    CORS(app)
    
    # Initialiser Celery
    celery = make_celery(app)
    
    from app.routes.api import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')
    
    @app.route('/')
    def home():
        return {'message': 'SMM API is running', 'status': 'ok'}
    
    return app