from app import celery
import pandas as pd
import os
from datetime import datetime

# Stockage temporaire des résultats
job_results = {}

def clean_data(df):
    """Nettoyer et préparer les données CSV"""
    df.columns = df.columns.str.strip().str.lower()
    
    date_columns = ['date', 'created_at', 'published_at', 'post_date']
    for col in date_columns:
        if col in df.columns:
            df[col] = pd.to_datetime(df[col], errors='coerce')
            df['date'] = df[col]
            break
    
    if 'date' not in df.columns:
        df['date'] = pd.Timestamp.now()
    
    numeric_columns = ['likes', 'comments', 'shares', 'saves', 'reach', 'impressions', 'engagement_rate']
    for col in numeric_columns:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
    
    return df

def calculate_kpis(df):
    """Calculer les KPIs à partir du CSV"""
    total_posts = len(df)
    
    if 'engagement_rate' in df.columns:
        avg_engagement = round(df['engagement_rate'].mean(), 2)
        top_post_idx = df['engagement_rate'].idxmax()
        top_post = {
            "content": df.loc[top_post_idx, 'content'][:100] if 'content' in df.columns else "No content",
            "engagement_rate": float(df.loc[top_post_idx, 'engagement_rate']),
            "date": df.loc[top_post_idx, 'date'].strftime('%Y-%m-%d') if pd.notna(df.loc[top_post_idx, 'date']) else "Unknown"
        }
    else:
        avg_engagement = 0
        top_post = {"content": "No data", "engagement_rate": 0, "date": "Unknown"}
    
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

@celery.task(bind=True)
def analyze_csv_task(self, file_path):
    """Tâche Celery pour analyser un fichier CSV"""
    try:
        self.update_state(state='PROGRESS', meta={'status': 'Reading CSV file...'})
        
        df = pd.read_csv(file_path)
        
        self.update_state(state='PROGRESS', meta={'status': 'Cleaning data...'})
        df = clean_data(df)
        
        self.update_state(state='PROGRESS', meta={'status': 'Calculating KPIs...'})
        kpis = calculate_kpis(df)
        
        self.update_state(state='PROGRESS', meta={'status': 'Finalizing...'})
        
        job_results[self.request.id] = {
            'status': 'completed',
            'result': kpis,
            'completed_at': datetime.now().isoformat()
        }
        
        try:
            os.remove(file_path)
        except:
            pass
        
        return kpis
        
    except Exception as e:
        job_results[self.request.id] = {
            'status': 'failed',
            'error': str(e),
            'failed_at': datetime.now().isoformat()
        }
        raise e

def get_job_status(job_id):
    """Récupérer le statut d'un job"""
    if job_id in job_results:
        return job_results[job_id]
    
    task = analyze_csv_task.AsyncResult(job_id)
    if task.state == 'PENDING':
        return {'status': 'pending'}
    elif task.state == 'PROGRESS':
        return {'status': 'running', 'info': task.info}
    elif task.state == 'SUCCESS':
        return {'status': 'completed', 'result': task.result}
    elif task.state == 'FAILURE':
        return {'status': 'failed', 'error': str(task.info)}
    
    return {'status': 'unknown'}