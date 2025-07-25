const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi');
const router = express.Router();

// Esquema de MongoDB
const userSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
    },
    telefono: {
        type: String,
        trim: true
    },
    edad: {
        type: Number,
        required: true,
        min: 1,
        max: 120
    },
    ciudad: {
        type: String,
        trim: true
    },
    profesion: {
        type: String,
        trim: true
    },
    comentarios: {
        type: String,
        trim: true
    },
    fechaRegistro: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

// Esquema de validación con Joi
const userValidationSchema = Joi.object({
    nombre: Joi.string().min(2).max(100).required().messages({
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.max': 'El nombre no puede exceder 100 caracteres',
        'any.required': 'El nombre es obligatorio'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Ingrese un email válido',
        'any.required': 'El email es obligatorio'
    }),
    telefono: Joi.string().allow('').pattern(/^[\d\s\-\+\(\)]+$/).messages({
        'string.pattern.base': 'Formato de teléfono inválido'
    }),
    edad: Joi.number().integer().min(1).max(120).required().messages({
        'number.min': 'La edad debe ser mayor a 0',
        'number.max': 'La edad debe ser menor a 121',
        'any.required': 'La edad es obligatoria'
    }),
    ciudad: Joi.string().allow('').max(100),
    profesion: Joi.string().allow('').max(100),
    comentarios: Joi.string().allow('').max(500)
});

// GET - Obtener todos los usuarios
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().sort({ fechaRegistro: -1 });
        res.status(200).json(users);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ 
            mensaje: 'Error al obtener usuarios',
            error: error.message 
        });
    }
});

// GET - Obtener usuario por ID
router.get('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ mensaje: 'ID de usuario inválido' });
        }
        
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        
        res.status(200).json(user);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ 
            mensaje: 'Error al obtener usuario',
            error: error.message 
        });
    }
});

// POST - Crear nuevo usuario
router.post('/users', async (req, res) => {
    try {
        // Validación con Joi
        const { error, value } = userValidationSchema.validate(req.body, { abortEarly: false });
        
        if (error) {
            const errores = {};
            error.details.forEach(detail => {
                const campo = detail.path[0];
                errores[campo] = detail.message;
            });
            
            return res.status(400).json({ 
                mensaje: 'Errores de validación',
                errores: errores
            });
        }
        
        // Verificar si el email ya existe
        const existingUser = await User.findOne({ email: value.email });
        if (existingUser) {
            return res.status(400).json({ 
                mensaje: 'El email ya está registrado',
                errores: { email: 'Este email ya está en uso' }
            });
        }
        
        // Crear nuevo usuario
        const newUser = new User(value);
        const savedUser = await newUser.save();
        
        res.status(201).json({
            mensaje: 'Usuario creado exitosamente',
            usuario: savedUser
        });
        
    } catch (error) {
        console.error('Error al crear usuario:', error);
        
        // Manejo de errores de duplicado de MongoDB
        if (error.code === 11000) {
            return res.status(400).json({ 
                mensaje: 'El email ya está registrado',
                errores: { email: 'Este email ya está en uso' }
            });
        }
        
        res.status(500).json({ 
            mensaje: 'Error al crear usuario',
            error: error.message 
        });
    }
});

// PUT - Actualizar usuario
router.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ mensaje: 'ID de usuario inválido' });
        }
        
        // Validación con Joi
        const { error, value } = userValidationSchema.validate(req.body, { abortEarly: false });
        
        if (error) {
            const errores = {};
            error.details.forEach(detail => {
                const campo = detail.path[0];
                errores[campo] = detail.message;
            });
            
            return res.status(400).json({ 
                mensaje: 'Errores de validación',
                errores: errores
            });
        }
        
        const updatedUser = await User.findByIdAndUpdate(
            id, 
            value, 
            { new: true, runValidators: true }
        );
        
        if (!updatedUser) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        
        res.status(200).json({
            mensaje: 'Usuario actualizado exitosamente',
            usuario: updatedUser
        });
        
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ 
            mensaje: 'Error al actualizar usuario',
            error: error.message 
        });
    }
});

// DELETE - Eliminar usuario
router.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ mensaje: 'ID de usuario inválido' });
        }
        
        const deletedUser = await User.findByIdAndDelete(id);
        
        if (!deletedUser) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        
        res.status(200).json({
            mensaje: 'Usuario eliminado exitosamente',
            usuario: deletedUser
        });
        
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ 
            mensaje: 'Error al eliminar usuario',
            error: error.message 
        });
    }
});

module.exports = router;