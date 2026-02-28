import pprint

def read_file(path):
    print("------- " + path + " -------")
    try:
        with open(path, "r", encoding="utf-8") as f:
            print(f.read())
    except Exception as e:
        print(f"Error reading {path}: {e}")

read_file(r"c:\workspace\assignments\live_project\backend\crm_backend\urls.py")
read_file(r"c:\workspace\assignments\live_project\backend\accounts\urls.py")
