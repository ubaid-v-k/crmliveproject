import os
import django
import random
from datetime import timedelta
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'crm_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from core.models import Lead, Deal, Company

User = get_user_model()

def seed_data():
    print("Seeding dashboard demo data...")
    
    # 1. Create Employees
    employees = [
        {"username": "ethan", "first": "Ethan", "last": "Harper"},
        {"username": "olivia", "first": "Olivia", "last": "Bennett"},
        {"username": "liam", "first": "Liam", "last": "Carter"},
        {"username": "sophia", "first": "Sophia", "last": "Evans"},
    ]
    
    users = []
    for emp in employees:
        u, created = User.objects.get_or_create(
            username=emp['username'],
            defaults={
                "first_name": emp['first'],
                "last_name": emp['last'],
                "email": f"{emp['username']}@example.com"
            }
        )
        if created:
            u.set_password("password123")
            u.save()
            print(f"Created user: {emp['first']} {emp['last']}")
        users.append(u)

    # 2. Create some Companies
    industries = ["Tech", "Finance", "Healthcare", "Retail"]
    companies = []
    for i in range(10):
        c, _ = Company.objects.get_or_create(
            name=f"Company {i+1}",
            defaults={
                "user": users[0],
                "industry": random.choice(industries)
            }
        )
        companies.append(c)

    # 3. Create Leads (target 1250 as in screenshot)
    if Lead.objects.count() < 1250:
        print("Creating 1250 leads (this may take a few seconds)...")
        leads_to_create = []
        for i in range(1250 - Lead.objects.count()):
            leads_to_create.append(Lead(
                user=random.choice(users),
                first_name=f"Lead_{i}",
                last_name="Test",
                email=f"lead_{i}@test.com",
                status=random.choice(["New", "Contacted", "Qualified"])
            ))
        Lead.objects.bulk_create(leads_to_create)

    # 4. Create Deals (target 136 active, 136 closed)
    stages = ["Prospecting", "Qualification", "Proposal", "Negotiation", "Closed Won", "Closed Lost"]
    if Deal.objects.count() < 300:
        print("Creating 300 deals...")
        deals_to_create = []
        for i in range(300):
            stage = random.choice(stages)
            amount = random.randint(1000, 10000)
            created_at = timezone.now() - timedelta(days=random.randint(0, 365))
            d = Deal(
                user=random.choice(users),
                title=f"Deal {i+1}",
                amount=amount,
                stage=stage,
                company=random.choice(companies)
            )
            deals_to_create.append(d)
        Deal.objects.bulk_create(deals_to_create)
        # Update created_at (since bulk_create skips auto_now_add in some versions/settings but usually it's fine)
        # For this script we'll just leave them as current if bulk_create works.

    print("Success! Dashboard seeded.")

if __name__ == "__main__":
    seed_data()
