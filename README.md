# Proyecto Web - Formulario con API REST

Este proyecto implementa un sistema completo de registro de usuarios con:
- Frontend minimalista con formulario HTML/CSS/JavaScript
- API REST desarrollada en Node.js con Express
- Base de datos MongoDB para persistencia
- Validaciones del lado cliente y servidor

## Diseño y prueba con postman
<img width="1359" height="767" alt="Captura de pantalla 2025-07-25 151822" src="https://github.com/user-attachments/assets/1eba206a-1e1e-4479-ae7e-261d8da8b0da" />
<img width="1359" height="767" alt="Captura de pantalla 2025-07-25 150951" src="https://github.com/user-attachments/assets/59ba7322-5960-4e8d-9753-c815d3d4205c" />


## Características

- **Frontend Responsivo**: Diseño minimalista con formulario a la izquierda y lista de usuarios a la derecha
- **API REST Completa**: Endpoints para CRUD de usuarios
- **Validaciones Robustas**: Validación en cliente y servidor
- **Base de Datos**: Persistencia con MongoDB
- **Manejo de Errores**: Gestión completa de errores y mensajes informativos

## Requisitos Previos

- Node.js (v14 o superior)
- MongoDB (local o MongoDB Atlas)
- Navegador web moderno

## Instalación

### 1. Clonar el proyecto
```bash
git clone https://github.com/carment15/ACTIVIDAD-DE-PRACTICA-9-Crear-un-formulario-web-y-API-REST
```
### Despues
```bash
cd ACTIVIDAD-DE-PRACTICA-9-Crear-un-formulario-web-y-API-REST
```
### 2. Backend 
```bash
cd backend
npm run dev
```
### 3. frontend 

Puede usar la extencion de visual studio code live server

<img width="1255" height="715" alt="image" src="https://github.com/user-attachments/assets/57cb8e0e-ad37-4cff-8d1f-0172922fe6c0" />

---

## API Endpoints

### Usuarios

| Método | Endpoint             | Descripción                     |
|--------|----------------------|---------------------------------|
| GET    | /api/users           | Obtener todos los usuarios      |
| GET    | /api/users/:id       | Obtener usuario por ID          |
