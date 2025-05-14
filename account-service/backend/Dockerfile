FROM python:3.9

WORKDIR /app

COPY auth_project /app/backend/auth_project
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

WORKDIR /app/backend/auth_project

EXPOSE 8000

CMD ["sh", "-c", "python manage.py migrate"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
