import os

files_to_update = [
    r"c:\workspace\assignments\live_project\crm-live-project-batch-4-frontend-c\src\pages\tickets\TicketDetails.jsx",
    r"c:\workspace\assignments\live_project\crm-live-project-batch-4-frontend-c\src\pages\leads\LeadDetails.jsx",
    r"c:\workspace\assignments\live_project\crm-live-project-batch-4-frontend-c\src\pages\companies\CompanyDetails.jsx",
    r"c:\workspace\assignments\live_project\crm-live-project-batch-4-frontend-c\src\pages\deals\DealDetails.jsx",
    r"c:\workspace\assignments\live_project\crm-live-project-batch-4-frontend-c\src\components\common\ComposeEmailDialog.jsx",
    r"c:\workspace\assignments\live_project\crm-live-project-batch-4-frontend-c\src\api\tickets.api.js",
    r"c:\workspace\assignments\live_project\crm-live-project-batch-4-frontend-c\src\api\leads.api.js",
    r"c:\workspace\assignments\live_project\crm-live-project-batch-4-frontend-c\src\api\deals.api.js",
    r"c:\workspace\assignments\live_project\crm-live-project-batch-4-frontend-c\src\api\dashboard.api.js",
    r"c:\workspace\assignments\live_project\crm-live-project-batch-4-frontend-c\src\api\companies.api.js",
    r"c:\workspace\assignments\live_project\crm-live-project-batch-4-frontend-c\src\api\authService.js",
    r"c:\workspace\assignments\live_project\crm-live-project-batch-4-frontend-c\src\api\activities.api.js"
]

for file_path in files_to_update:
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        content = content.replace('localhost:8000', 'localhost:8001')
        
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(content)
            
        print(f"Updated {file_path}")
    except Exception as e:
        print(f"Failed to update {file_path}: {e}")
