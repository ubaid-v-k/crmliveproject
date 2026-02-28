import urllib.request
try:
    response = urllib.request.urlopen('http://127.0.0.1:8001/api/auth/login')
    print("STATUS", response.status)
except Exception as e:
    print("EXCEPTION", e)
