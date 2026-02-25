import os
import sys
import subprocess

def run_django_command(args):
    print(f"Running: python manage.py {' '.join(args)}")
    try:
        # Using sys.executable to ensure the same interpreter is used
        result = subprocess.run(
            [sys.executable, "manage.py"] + args,
            capture_output=True,
            text=True
        )
        print("STDOUT:", result.stdout)
        print("STDERR:", result.stderr)
        return result.returncode == 0
    except Exception as e:
        print(f"Error running command: {e}")
        return False

if __name__ == "__main__":
    print("Step 1: makemigrations")
    if run_django_command(["makemigrations"]):
        print("\nStep 2: migrate")
        run_django_command(["migrate"])
    else:
        print("\nmakemigrations failed.")
