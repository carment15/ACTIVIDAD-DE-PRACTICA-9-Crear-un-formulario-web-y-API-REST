const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./rutas/users');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/Gestion_usuarios', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Conectado a MongoDB');
})
.catch((error) => {
    console.error('Error conectando a MongoDB:', error);
});

// Rutas
app.use('/api', userRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ 
        mensaje: 'API de Usuarios funcionando correctamente',
        version: '1.0.0',
        endpoints: [
            'GET /api/users - Obtener todos los usuarios',
            'POST /api/users - Crear nuevo usuario',
            'GET /api/users/:id - Obtener usuario por ID',
            'PUT /api/users/:id - Actualizar usuario',
            'DELETE /api/users/:id - Eliminar usuario'
        ]
    });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        mensaje: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
    });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({ 
        mensaje: 'Ruta no encontrada',
        ruta: req.originalUrl
    });
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});