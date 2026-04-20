
from flask import Blueprint, jsonify, request
from datetime import datetime
from sqlalchemy import text 
from app.models.models import db, User, Account, Metric
import os
import pandas as pd
from werkzeug.utils import secure_filename
import uuid
from app.tasks import analyze_csv_task, get_job_status

# Créer le Blueprint (c'est api_bp)
api_bp = Blueprint('api', __name__)

# Configuration pour les uploads CSV
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'csv'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@api_bp.route('/health', methods=['GET'])
def health_check():
    """Route de santé - vérifie que l'API fonctionne"""
    db_status = 'disconnected'
    error_msg = None
    try:
        db.session.execute(text('SELECT 1'))  # ← MODIFICATION ICI (text())
        db.session.commit()
        db_status = 'connected'
    except Exception as e:
        error_msg = str(e)
        print(f"DB Error: {error_msg}")
    
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "database": db_status,
            "api": "running"
        },
        "version": "1.0.0",
        "message": "SMM Dashboard API is running",
       
    }), 200

@api_bp.route('/metrics/engagement', methods=['GET'])
def get_engagement():
    """Route pour les métriques d'engagement"""
    metrics = Metric.query.order_by(Metric.timestamp.desc()).first()
    
    if not metrics:
        # Données par défaut si pas de métriques
        return jsonify({
            "engagement_rate": 11.2,
            "virality_score": 32.5,
            "eqs": 14.8
        })
    
    return jsonify({
        "engagement_rate": metrics.engagement_rate,
        "virality_score": metrics.virality_score,
        "eqs": metrics.eqs
    })

@api_bp.route('/metrics/growth', methods=['GET'])
def get_growth():
    """Route pour les métriques de croissance"""
    metrics = Metric.query.order_by(Metric.timestamp.desc()).first()
    
    if not metrics:
        return jsonify({
            "follower_growth_rate": 4.8,
            "reach_velocity": 1.84
        })
    
    return jsonify({
        "follower_growth_rate": metrics.follower_growth_rate,
        "reach_velocity": metrics.reach_velocity
    })

@api_bp.route('/accounts', methods=['GET'])
def get_accounts():
    """Récupérer tous les comptes"""
    accounts = Account.query.all()
    return jsonify([acc.to_dict() for acc in accounts])

@api_bp.route('/accounts', methods=['POST'])
def create_account():
    """Créer un nouveau compte"""
    data = request.get_json()
    
    account = Account(
        user_id=data.get('user_id', 1),
        platform=data.get('platform'),
        account_name=data.get('account_name'),
        followers=data.get('followers', 0)
    )
    
    db.session.add(account)
    db.session.commit()
    
    return jsonify(account.to_dict()), 201

@api_bp.route('/metrics', methods=['GET'])
def get_all_metrics():
    """Récupérer toutes les métriques"""
    metrics = Metric.query.order_by(Metric.timestamp.desc()).limit(50).all()
    return jsonify([m.to_dict() for m in metrics])

@api_bp.route('/metrics', methods=['POST'])
def create_metric():
    """Créer une nouvelle métrique"""
    data = request.get_json()
    
    metric = Metric(
        account_id=data.get('account_id'),
        engagement_rate=data.get('engagement_rate', 0.0),
        virality_score=data.get('virality_score', 0.0),
        follower_growth_rate=data.get('follower_growth_rate', 0.0),
        eqs=data.get('eqs', 0.0),
        reach_velocity=data.get('reach_velocity', 0.0)
    )
    
    db.session.add(metric)
    db.session.commit()
    
    return jsonify(metric.to_dict()), 201
@api_bp.route('/init-db', methods=['POST'])
def init_database():
    """Initialiser la base de données - créer toutes les tables"""
    try:
        db.create_all()
        return jsonify({"status": "success", "message": "Database initialized"}), 201
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
@api_bp.route('/register', methods=['POST'])
def register():
    """Créer un nouvel utilisateur"""
    data = request.get_json()
    
    # Vérifier si l'utilisateur existe déjà
    existing_user = User.query.filter_by(username=data.get('username')).first()
    if existing_user:
        return jsonify({"error": "Username already exists"}), 400
    
    existing_email = User.query.filter_by(email=data.get('email')).first()
    if existing_email:
        return jsonify({"error": "Email already exists"}), 400
    
    user = User(
        username=data.get('username'),
        email=data.get('email')
    )
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify(user.to_dict()), 201

def clean_data(df):
    """Nettoyer et préparer les données CSV"""
    df.columns = df.columns.str.strip().str.lower()
    
    # Trouver la colonne de date
    date_columns = ['date', 'created_at', 'published_at', 'post_date']
    for col in date_columns:
        if col in df.columns:
            df[col] = pd.to_datetime(df[col], errors='coerce')
            df['date'] = df[col]
            break
    
    if 'date' not in df.columns:
        df['date'] = pd.Timestamp.now()
    
    # Nettoyer les colonnes numériques
    numeric_columns = ['likes', 'comments', 'shares', 'saves', 'reach', 'impressions', 'engagement_rate']
    for col in numeric_columns:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
    
    return df

def calculate_kpis(df):
    """Calculer les KPIs à partir du CSV"""
    total_posts = len(df)
    
    # Engagement moyen
    if 'engagement_rate' in df.columns:
        avg_engagement = round(df['engagement_rate'].mean(), 2)
    else:
        avg_engagement = 0
    
    # Top post
    if 'engagement_rate' in df.columns:
        top_post_idx = df['engagement_rate'].idxmax()
        top_post = {
            "content": df.loc[top_post_idx, 'content'][:100] if 'content' in df.columns else "No content",
            "engagement_rate": float(df.loc[top_post_idx, 'engagement_rate']),
            "date": df.loc[top_post_idx, 'date'].strftime('%Y-%m-%d') if pd.notna(df.loc[top_post_idx, 'date']) else "Unknown"
        }
    else:
        top_post = {"content": "No data", "engagement_rate": 0, "date": "Unknown"}
    
    # Tendance hebdomadaire
    df['week'] = df['date'].dt.strftime('%Y-W%W')
    weekly_trend = df.groupby('week').size().reset_index(name='count').to_dict('records')
    
    return {
        "total_posts": total_posts,
        "avg_engagement_rate": avg_engagement,
        "top_post": top_post,
        "weekly_trend": weekly_trend,
        "date_range": {
            "start": df['date'].min().strftime('%Y-%m-%d') if pd.notna(df['date'].min()) else "Unknown",
            "end": df['date'].max().strftime('%Y-%m-%d') if pd.notna(df['date'].max()) else "Unknown"
        }
    }

@api_bp.route('/upload', methods=['POST'])
def upload_csv():
    """Uploader un fichier CSV et retourner les KPIs"""
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    if not allowed_file(file.filename):
        return jsonify({"error": "Only CSV files are allowed"}), 400
    
    try:
        df = pd.read_csv(file)
        df = clean_data(df)
        kpis = calculate_kpis(df)
        return jsonify(kpis), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@api_bp.route('/upload-async', methods=['POST'])
def upload_csv_async():
    """Uploader un fichier CSV et lancer une tâche Celery en arrière-plan"""
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    if not allowed_file(file.filename):
        return jsonify({"error": "Only CSV files are allowed"}), 400
    
    job_id = str(uuid.uuid4())
    temp_filename = f"uploads/{job_id}.csv"
    
    file.save(temp_filename)
    
    task = analyze_csv_task.delay(temp_filename)
    
    return jsonify({
        "job_id": task.id,
        "status": "pending",
        "message": "CSV analysis started. Use /api/jobs/{job_id} to check status."
    }), 202

@api_bp.route('/jobs/<job_id>', methods=['GET'])
def get_job_status_route(job_id):
    """Vérifier le statut d'une tâche d'analyse CSV"""
    status = get_job_status(job_id)
    return jsonify(status), 200
@api_bp.route('/posts', methods=['GET'])
def get_posts():
    """Récupérer tous les posts"""
    from app.models.models import Post
    posts = Post.query.order_by(Post.published_at.desc()).all()
    return jsonify([p.to_dict() for p in posts])
@api_bp.route('/reports', methods=['GET'])
def get_reports():
    """Récupérer tous les rapports"""
    from app.models.models import Report
    reports = Report.query.order_by(Report.created_at.desc()).all()
    return jsonify([r.to_dict() for r in reports])
@api_bp.route('/alerts', methods=['GET'])
def get_alerts():
    """Récupérer toutes les alertes"""
    from app.models.models import Alert
    alerts = Alert.query.order_by(Alert.created_at.desc()).all()
    return jsonify([a.to_dict() for a in alerts])

@api_bp.route('/analytics', methods=['GET'])
def get_analytics():
    """Récupérer les données analytics pour le dashboard"""
    from app.models.models import Metric, Account, Post
    
    # Récupérer les métriques
    metrics = Metric.query.order_by(Metric.timestamp.desc()).all()
    
    # Récupérer les comptes
    accounts = Account.query.all()
    total_followers = sum(acc.followers or 0 for acc in accounts)
    
    # Récupérer les posts
    posts = Post.query.all()
    total_posts = len(posts)
    
    # Calculer l'engagement moyen
    avg_engagement = 0
    if metrics:
        avg_engagement = round(sum(m.engagement_rate or 0 for m in metrics) / len(metrics), 2)
    
    # Données pour le graphique (évolution des followers)
    follower_growth = []
    recent_metrics = metrics[-12:] if len(metrics) > 12 else metrics
    for i, metric in enumerate(recent_metrics):
        follower_growth.append({
            "date": f"Sem {i+1}",
            "followers": int(total_followers * (1 + (metric.follower_growth_rate or 0) / 100))
        })
    
    return jsonify({
        "total_followers": total_followers,
        "total_posts": total_posts,
        "avg_engagement": avg_engagement,
        "current_metrics": metrics[0].to_dict() if metrics else {},
        "follower_growth": follower_growth,
        "recent_posts": [p.to_dict() for p in posts[-5:]] if posts else []
    }), 200

@api_bp.route('/users', methods=['GET'])
def get_users():
    """Récupérer tous les utilisateurs"""
    users = User.query.all()
    return jsonify([u.to_dict() for u in users])