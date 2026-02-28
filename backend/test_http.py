import urllib.request

try:
    response = urllib.request.urlopen('http://127.0.0.1:8001/api/core/leads/')
    print(f"Status: {response.status}")
    print(f"Body: {response.read().decode('utf-8')[:100]}...")
except Exception as e:
    print(f"Error: {e}")
