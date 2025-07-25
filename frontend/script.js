const API_URL = 'http://localhost:3000/api';

// Cargar usuarios al iniciar la página
document.addEventListener('DOMContentLoaded', function() {
    cargarUsuarios();
});

// Validaciones del lado del cliente
function validarFormulario(formData) {
    const errores = {};
    
    // Validar nombre
    if (!formData.nombre || formData.nombre.length < 2) {
        errores.nombre = 'El nombre debe tener al menos 2 caracteres';
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
        errores.email = 'Ingrese un email válido';
    }
    
    // Validar teléfono (si se proporciona)
    if (formData.telefono) {
        const telefonoRegex = /^[\d\s\-\+\(\)]+$/;
        if (!telefonoRegex.test(formData.telefono)) {
            errores.telefono = 'Formato de teléfono inválido';
        }
    }
    
    // Validar edad
    const edad = parseInt(formData.edad);
    if (!edad || edad < 1 || edad > 120) {
        errores.edad = 'La edad debe estar entre 1 y 120 años';
    }
    
    return errores;
}

// Mostrar errores en el formulario
function mostrarErrores(errores) {
    // Limpiar errores anteriores
    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(el => el.textContent = '');
    
    // Mostrar nuevos errores
    Object.keys(errores).forEach(campo => {
        const errorElement = document.getElementById(`${campo}Error`);
        if (errorElement) {
            errorElement.textContent = errores[campo];
        }
    });
}

// Manejar envío del formulario
document.getElementById('userForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const userData = Object.fromEntries(formData);
    
    // Validar en el cliente
    const errores = validarFormulario(userData);
    if (Object.keys(errores).length > 0) {
        mostrarErrores(errores);
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            mostrarMensaje('Usuario guardado exitosamente', 'success');
            limpiarFormulario();
            cargarUsuarios(); // Actualizar la lista
        } else {
            if (result.errores) {
                mostrarErrores(result.errores);
            } else {
                mostrarMensaje(result.mensaje || 'Error al guardar usuario', 'error');
            }
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Error de conexión con el servidor', 'error');
    }
});

// Cargar lista de usuarios
async function cargarUsuarios() {
    const userList = document.getElementById('userList');
    userList.innerHTML = '<div class="loading">Cargando usuarios...</div>';
    
    try {
        const response = await fetch(`${API_URL}/users`);
        const users = await response.json();
        
        if (users.length === 0) {
            userList.innerHTML = '<div class="loading">No hay usuarios registrados</div>';
            return;
        }
        
        userList.innerHTML = users.map(user => `
            <div class="user-card">
                <h4>${user.nombre}</h4>
                <div class="user-info"> Correo: ${user.email}</div>
                ${user.telefono ? `<div class="user-info"> Telefono: ${user.telefono}</div>` : ''}
                <div class="user-info"> Edad: ${user.edad} años</div>
                ${user.ciudad ? `<div class="user-info"> Ciudad: ${user.ciudad}</div>` : ''}
                ${user.profesion ? `<div class="user-info"> Profesión: ${user.profesion}</div>` : ''}
                ${user.comentarios ? `<div class="user-info"> comentario: ${user.comentarios}</div>` : ''}
                <div class="user-info"> Fecha de Creación: ${new Date(user.fechaRegistro).toLocaleDateString()}</div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error:', error);
        userList.innerHTML = '<div class="loading">Error al cargar usuarios</div>';
    }
}

// Limpiar formulario
function limpiarFormulario() {
    document.getElementById('userForm').reset();
    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(el => el.textContent = '');
    document.getElementById('successMessage').style.display = 'none';
}

// Mostrar mensajes
function mostrarMensaje(mensaje, tipo) {
    const successDiv = document.getElementById('successMessage');
    successDiv.textContent = mensaje;
    successDiv.className = tipo === 'success' ? 'success' : 'error';
    successDiv.style.display = 'block';
    
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 3000);
}