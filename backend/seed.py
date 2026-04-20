#!/usr/bin/env python
"""Script pour peupler la base de données avec des données de test"""

from app import create_app
from app.models.models import db, User, Account, Metric, Post, Report
from datetime import datetime, timedelta
import random

app = create_app()

def seed_database():
    with app.app_context():
        print("🌱 Seeding database...")
        
        # 1. Créer un utilisateur
        user = User.query.filter_by(username="demo_user").first()
        if not user:
            user = User(username="demo_user", email="demo@example.com")
            db.session.add(user)
            db.session.commit()
            print("✅ User created")
        else:
            print("ℹ️ User already exists")
        
        # 2. Créer des comptes sociaux
        accounts_data = [
            {"platform": "instagram", "account_name": "demo_insta", "followers": 15000},
            {"platform": "tiktok", "account_name": "demo_tiktok", "followers": 45000},
            {"platform": "facebook", "account_name": "demo_fb", "followers": 8200},
            {"platform": "linkedin", "account_name": "demo_li", "followers": 3400},
        ]
        
        accounts = []
        for acc_data in accounts_data:
            account = Account.query.filter_by(account_name=acc_data["account_name"]).first()
            if not account:
                account = Account(
                    user_id=user.id,
                    platform=acc_data["platform"],
                    account_name=acc_data["account_name"],
                    followers=acc_data["followers"]
                )
                db.session.add(account)
                accounts.append(account)
            else:
                accounts.append(account)
        db.session.commit()
        print("✅ Accounts created")
        
        # 3. Créer des métriques pour chaque compte
        metrics_data = [
            {"engagement_rate": 11.2, "virality_score": 32.5, "eqs": 14.8, "follower_growth_rate": 5.2, "reach_velocity": 1.84},
            {"engagement_rate": 8.7, "virality_score": 28.3, "eqs": 11.2, "follower_growth_rate": 12.5, "reach_velocity": 2.45},
            {"engagement_rate": 4.2, "virality_score": 15.8, "eqs": 6.9, "follower_growth_rate": 2.1, "reach_velocity": 0.92},
            {"engagement_rate": 3.8, "virality_score": 12.4, "eqs": 5.5, "follower_growth_rate": 1.8, "reach_velocity": 0.76},
        ]
        
        for i, account in enumerate(accounts):
            metric = Metric(
                account_id=account.id,
                engagement_rate=metrics_data[i]["engagement_rate"],
                virality_score=metrics_data[i]["virality_score"],
                eqs=metrics_data[i]["eqs"],
                follower_growth_rate=metrics_data[i]["follower_growth_rate"],
                reach_velocity=metrics_data[i]["reach_velocity"]
            )
            db.session.add(metric)
        db.session.commit()
        print("✅ Metrics created")
        
        # 4. Créer des posts pour chaque compte
        post_contents = [
            "Check out our latest reel! 🎬 #socialmedia",
            "Behind the scenes of our campaign shoot 📸",
            "New product launch coming soon! 🚀",
            "Weekly tips: How to grow your engagement 📈",
            "Client success story: How we doubled their reach",
        ]
        
        for account in accounts:
            for i in range(3):
                published_at = datetime.utcnow() - timedelta(days=random.randint(0, 30))
                post = Post(
                    account_id=account.id,
                    content=random.choice(post_contents),
                    published_at=published_at,
                    likes=random.randint(100, 5000),
                    comments=random.randint(10, 500),
                    shares=random.randint(5, 200),
                    saves=random.randint(20, 300),
                    reach=random.randint(5000, 50000),
                    impressions=random.randint(10000, 100000),
                    engagement_rate=round(random.uniform(2.0, 12.0), 1)
                )
                db.session.add(post)
        db.session.commit()
        print("✅ Posts created")
        
        # 5. Créer un rapport
        report = Report(
            user_id=user.id,
            title="Weekly Performance Report - Week 15",
            report_type="weekly",
            period_start=datetime.utcnow() - timedelta(days=7),
            period_end=datetime.utcnow(),
            data={
                "total_reach": 245000,
                "total_engagement": 18200,
                "avg_engagement_rate": 7.4,
                "top_platform": "instagram",
                "total_followers_gained": 847
            }
        )
        db.session.add(report)
        db.session.commit()
        print("✅ Report created")
        
        print("\n🎉 Seeding completed successfully!")
        print(f"\n📊 Summary:")
        print(f"   - Users: {User.query.count()}")
        print(f"   - Accounts: {Account.query.count()}")
        print(f"   - Metrics: {Metric.query.count()}")
        print(f"   - Posts: {Post.query.count()}")
        print(f"   - Reports: {Report.query.count()}")

if __name__ == "__main__":
    seed_database()