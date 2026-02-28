import os
import sys

os.chdir('c:\\workspace\\assignments\\live_project\\backend')
sys.path.insert(0, os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'crm_backend.settings')

import django
django.setup()

from django.urls import resolve, reverse, Resolver404

def check_url(url):
    print(f"\n--- Checking URL: {url} ---")
    try:
        match = resolve(url)
        print("Success!")
        print("View name:", match.view_name)
        print("Route:", match.route)
        print("Args:", match.args)
        print("Kwargs:", match.kwargs)
    except Resolver404 as e:
        print("Resolver404 Exception!")
        print(e)

check_url('/api/core/deals/')
check_url('/api/core/leads/')
check_url('/api/auth/login')

# Let's also print out the exact urlpatterns
from crm_backend.urls import urlpatterns
print("\n--- URL Patterns in crm_backend.urls ---")
for p in urlpatterns:
    print(p, getattr(p, 'pattern', ''))

