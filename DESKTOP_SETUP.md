
# Soroti Elites School Management — Desktop Version

## Purpose
Run the existing Flask school management application locally on Windows.

## Requirements
- Windows 10 or Windows 11
- Python compatible with the project's dependencies
- PostgreSQL installed locally
- A local PostgreSQL database and database user
- Python packages listed in requirements.txt

## Local database configuration
The desktop application reads DATABASE_URL from the process environment.

Use a local PostgreSQL connection, for example:

postgresql://school_app:YOUR_PASSWORD@127.0.0.1:5432/school_system

Replace the example username, password, and database name with the actual local values.

Do not commit real database passwords or production credentials to GitHub.

## Starting the application
Once Python dependencies and the local database are configured, start the desktop launcher with:

python desktop_app.py

The application will listen on 127.0.0.1 and attempt to open the local interface in the default browser.

## Important
This launcher is not yet a standalone Windows installer.
Before production use, configure the local database, migrate or restore school data,
test all application features offline, and establish regular backups.
