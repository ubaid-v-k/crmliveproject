import subprocess
import os
import sys

def start_server():
    print("Attempting to start Django server in background...")
    try:
        # Using sys.executable ensures we use the same Python environment
        # shell=True is usually what run_command does, but we can try False too if needed
        proc = subprocess.Popen(
            [sys.executable, "manage.py", "runserver"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            creationflags=subprocess.CREATE_NEW_PROCESS_GROUP if os.name == 'nt' else 0
        )
        print(f"Process started with PID: {proc.pid}")
        # Give it a second to see if it crashes immediately
        try:
            outs, errs = proc.communicate(timeout=2)
            print("Server output:")
            print(outs)
            print("Server errors:")
            print(errs)
        except subprocess.TimeoutExpired:
            print("Server seems to be running in background (no immediate crash).")
            
    except Exception as e:
        print(f"Error starting server: {e}")

if __name__ == "__main__":
    start_server()
