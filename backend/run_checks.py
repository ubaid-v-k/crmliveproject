import subprocess
import os
import sys

# Change to the backend directory
os.chdir('c:\\workspace\\assignments\\live_project\\backend')

# Run the python checks
try:
    result = subprocess.run([sys.executable, 'manage.py', 'check'], capture_output=True, text=True)
    print("STDOUT:", result.stdout)
    print("STDERR:", result.stderr)
    print("RETURN CODE:", result.returncode)
except Exception as e:
    print(f"Failed to run command: {e}")
