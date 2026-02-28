import urllib.request
import json
import traceback

def run_fix():
    print("Trying to run Database Migration Fixes for Companies...")
    try:
        req = urllib.request.Request("http://localhost:8000/api/core/db-fix/")
        with urllib.request.urlopen(req) as response:
            result = response.read().decode('utf-8')
            print("\n=== MIGRATION RESULTS ===")
            print(result)
            print("=========================")
    except Exception as e:
        print(f"Error executing migration: {str(e)}")
        print(traceback.format_exc())

if __name__ == "__main__":
    run_fix()
