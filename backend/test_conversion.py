import os
import django
import sys
import json

sys.path.append('c:/workspace/assignments/live_project/backend')
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "crm_backend.settings")
django.setup()

from django.contrib.auth import get_user_model
from core.models import Lead, Deal
from rest_framework.test import APIClient

User = get_user_model()
user = User.objects.first()

client = APIClient()
client.force_authenticate(user=user)

def run_tests():
    print("Testing Conversion Logic...")
    
    # Create test leads
    lead_new = Lead.objects.create(
        user=user, first_name="Test", last_name="New",
        email="test_new@example.com", status="New"
    )
    
    lead_qualified = Lead.objects.create(
        user=user, first_name="Test", last_name="Qualified",
        email="test_qualified@example.com", status="Qualified",
        value=5000.00
    )
    
    # 1. Test converting non-qualified lead (Should Fail)
    print(f"\n1. Converting Non-Qualified Lead (Status: {lead_new.status})")
    response_fail = client.post(f'/api/core/leads/{lead_new.id}/convert/', HTTP_HOST='localhost')
    print(f"Status Code: {response_fail.status_code}")
    print(f"Response: {response_fail.content}")
    
    # 2. Test converting qualified lead (Should Succeed)
    print(f"\n2. Converting Qualified Lead (Status: {lead_qualified.status})")
    response_success = client.post(f'/api/core/leads/{lead_qualified.id}/convert/', HTTP_HOST='localhost')
    print(f"Status Code: {response_success.status_code}")
    print(f"Response: {response_success.content}")
    
    # Verify DB state
    lead_qualified.refresh_from_db()
    print(f"\n3. DB State Verification")
    print(f"Lead new status: {lead_qualified.status}")
    
    deals = Deal.objects.filter(lead_reference=lead_qualified)
    print(f"Associated Deals count: {deals.count()}")
    if deals.exists():
        d = deals.first()
        print(f"Deal linked correctly: {d.name}, Amount: {d.amount}")
        
    # 4. Test converting already converted lead (Should Fail)
    print(f"\n4. Converting Converted Lead (Status: {lead_qualified.status})")
    response_converted_fail = client.post(f'/api/core/leads/{lead_qualified.id}/convert/', HTTP_HOST='localhost')
    print(f"Status Code: {response_converted_fail.status_code}")
    print(f"Response: {response_converted_fail.content}")

if __name__ == '__main__':
    run_tests()
