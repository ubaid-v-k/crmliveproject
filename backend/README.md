# CRM Backend (Django + PostgreSQL)

This is the backend for a CRM application. To run this project locally, follow the steps below.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

1.  **Python** (version 3.10 to 3.13)
2.  **PostgreSQL** (Ensure the service is running and you have pgAdmin or `psql` to create a database)
3.  **Git** (optional, but recommended)

## 1. Extract the Project

Extract the ZIP file to a folder on your computer and open that folder in your terminal or VS Code.

## 2. Create and Activate a Virtual Environment

It is highly recommended to isolate project dependencies using a virtual environment.

**On Windows:**
```bash
python -m venv venv
.\venv\Scripts\activate
```

**On macOS / Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

## 3. Install Dependencies

Once the virtual environment is activated, install all required Python packages.

```bash
pip install -r requirements.txt
```

## 4. Set Up the Database

You need to create a new database in PostgreSQL for this project.

1.  Open pgAdmin or your PostgreSQL command line.
2.  Create a new database (e.g., named `crm_db`).
3.  Ensure you have a user with access to this database (usually the default `postgres` user).

## 5. Configure Environment Variables

The project uses a `.env` file to manage sensitive settings like database credentials and email configurations.

1.  In the root folder of the project, find the file named `.env.example`.
2.  Create a **copy** of this file and name it exactly `.env`.
3.  Open the newly created `.env` file and update the following values to match your local PostgreSQL setup:

```ini
DEBUG=True
DB_NAME=crm_db          # The name of the database you just created
DB_USER=postgres        # Your PostgreSQL username
DB_PASSWORD=your_pass   # Your PostgreSQL password
DB_HOST=localhost       # Usually localhost
DB_PORT=5432            # Usually 5432
```

*Note: The frontend will need the same email configurations if you wish to test the "Forgot Password" functionality.*

## 6. Run Migrations

Before starting the server, you need to create the database tables. Run the following command:

```bash
python manage.py migrate
```

## 7. Create a Superuser (Optional)

If you want to access the Django Admin panel (`http://127.0.0.1:8000/admin/`), create a superuser account:

```bash
python manage.py createsuperuser
```
Follow the prompts to set an email and password.

## 8. Start the Development Server

Finally, start the Django development server:

```bash
python manage.py runserver
```

The API will now be accessible at `http://127.0.0.1:8000/`.
