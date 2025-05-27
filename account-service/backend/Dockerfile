FROM python:3.12
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY auth_project/ /app/auth_project/
EXPOSE 8000
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]