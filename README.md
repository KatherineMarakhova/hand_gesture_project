# Gesture Project
Проект для распознавания жестов с использованием Django и React.

## Структура проекта
```
GestureProject/
├── account-service/          # Сервис аутентификации
│   ├── backend/              # Django-бекенд
│   └── frontend/             # React-фронтенд
├── hand_gesture_project/     # Основной Django-проект
├── docker-compose.yml        # Конфигурация Docker
└── README.md                 # Документация
```

## Запуск проекта
### Требования
- Docker
- Docker Compose

### Инструкция по запуску
**1. Клонируйте репозиторий:**
```bash
git clone <repository-url>
cd GestureProject
```
**2. Запустите сервисы:**

```bash
docker-compose up --build
```
Для запуска в фоновом режиме:

```bash
docker-compose up -d
```
**3. Доступ к сервисам:**
- Frontend (React): http://localhost:3000
- Backend (Django): http://localhost:8000
- Hand Gesture Project (Django): http://localhost:8001

**4. Остановка сервисов:**

```bash
docker-compose down
```
Для полной очистки:

```bash
docker-compose down -v
```
## Конфигурация сервисов
#### Django-проекты
- Автоматически применяются миграции при запуске
- Режим разработки (DEBUG=True)
- SQLite в качестве БД (по умолчанию)

#### React-frontend
- Hot-reload включен
- Прокси для API настроен на http://localhost:8000

### Дополнительные команды
**Просмотр логов:**

```bash
docker-compose logs -f <service_name>  # frontend, backend или hand-gesture
```

**Пересборка конкретного сервиса:**

```bash
docker-compose up --build <service_name>
```

**Запуск команд в контейнере:**

```bash
docker-compose exec <service_name> <command>
# Пример:
docker-compose exec backend python manage.py createsuperuser
```

## Рекомендации по разработке
1. Для разработки фронтенда:
- Все изменения в account-service/frontend/src будут сразу отображаться
- Логи можно просматривать командой docker-compose logs -f frontend

2. Для работы с Django:
- Миграции применяются автоматически при запуске
- Для создания новых миграций:

```bash
docker-compose exec backend python manage.py makemigrations
```

## Troubleshooting
Если фронтенд не отображается:

1. Проверьте логи: docker-compose logs frontend
2. Убедитесь что порт 3000 свободен:
```bash
lsof -i :3000
```
3. Пересоберите фронтенд:

```bash
docker-compose up --build frontend
```
**Для production-деплоя рекомендуется:**

1. Установить DEBUG=False
2. Использовать PostgreSQL вместо SQLite
3. Добавить Nginx для раздачи статики