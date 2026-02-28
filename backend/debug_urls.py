import os
import sys

os.chdir('c:\\workspace\\assignments\\live_project\\backend')
sys.path.insert(0, os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'crm_backend.settings')

import django
django.setup()

from django.urls import get_resolver
from crm_backend import urls as crm_urls

print("=== SYS.PATH ===")
for p in sys.path:
    print(p)

print("\n=== CRM_BACKEND URLS FILE ===")
print(crm_urls.__file__)

print("\n=== ROOT URL PATTERNS ===")
resolver = get_resolver()
for pattern in resolver.url_patterns:
    print(pattern)
    if hasattr(pattern, 'url_patterns'):
        for sub in pattern.url_patterns:
            print("  -", sub)
