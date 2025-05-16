# Используем официальный образ Node.js
FROM node:18-alpine

# Рабочая директория
WORKDIR /app

# Копируем зависимости и устанавливаем их
COPY package.json package-lock.json ./
RUN npm install

# Копируем исходный код
COPY . .

# Открываем порт, который использует React
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "start"]