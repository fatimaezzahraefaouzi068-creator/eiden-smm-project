from app import create_app
from app.celery_app import make_celery

app = create_app()
celery = make_celery(app)

# Importe les tâches pour qu'elles soient enregistrées
from app.tasks import analyze_csv_task