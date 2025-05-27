FROM python:3.12

WORKDIR /app

COPY requirements.txt .
RUN pip install --use-deprecated=legacy-resolver -r requirements.txt

COPY . .

EXPOSE 8001

CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8001"]