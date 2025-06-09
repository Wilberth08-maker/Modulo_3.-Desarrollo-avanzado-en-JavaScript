document.getElementById('registroEvento').addEventListener('submit', function (event) {
    event.preventDefault(); // Evita el envío automático del formulario

    // Variables
    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;
    const telefono = document.getElementById('telefono').value;
    const intereses = document.querySelectorAll('input[name="intereses"]:checked');
    const horario = document.querySelector('input[name="horario"]:checked');
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;

    // Validaciones básicas

    if (nombre.trim().length < 3) {
        alert("El nombres es muy corto, verifiquelo");
        return;
    }

    const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

    if (!soloLetras.test(nombre)) {
        alert('El nombre solo debe contener letras y espacios.');
        return;
    }

    if (!correo.includes('@') || !correo.includes('.com')) {
        alert('Por favor, introduce un correo electrónico válido.');
        return;
    }

    const telefonoLimpio = telefono.replace(/\D/g, ''); // Elimina cualquier carácter que no sea número

    if (telefonoLimpio.length < 10) {
        alert('El número de teléfono debe tener al menos 10 dígitos.');
        return;
    }

    if (!nombre || !correo || !telefono || intereses.length === 0 || !horario) {
        alert('Por favor, completa todos los campos obligatorios.');
        return;
    }


    // Que la fecha seleccionada sea una fecha futura
    const hoy = new Date();

    const fechaSeleccionada = new Date(fecha);

    if (fechaSeleccionada < hoy.setHours(0,0,0,0)) {
        alert('Por favor, selecciona una fecha futura para el evento.');
        return;
    }

    // Si todo está bien
    alert('Registro exitoso. ¡Gracias por registrarte!');
    document.getElementById('registroEvento').reset();
});