from flask import Blueprint, jsonify
from datetime import datetime

# Créer le Blueprint (c'est api_bp)
api_bp = Blueprint('api', __name__)

@api_bp.route('/health', methods=['GET'])
def health_check():
    """Route de santé - vérifie que l'API fonctionne"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "database": "connected",
            "api": "running"
        },
        "version": "1.0.0",
        "message": "SMM Dashboard API is running"
    }), 200

@api_bp.route('/metrics/engagement', methods=['GET'])
def get_engagement():
    """Route pour les métriques d'engagement"""
    return jsonify({
        "engagement_rate": 11.2,
        "virality_score": 32.5,
        "eqs": 14.8
    })

@api_bp.route('/metrics/growth', methods=['GET'])
def get_growth():
    """Route pour les métriques de croissance"""
    return jsonify({
        "follower_growth_rate": 4.8,
        "reach_velocity": 1.84
    })