// Simulando una base de datos de mesas
const mesasDisponibles = 5;  // Número de mesas disponibles para reservar

// Función que simula la verificación de disponibilidad de mesas
function verificarDisponibilidad(mesasSolicitadas) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {

            if(mesasSolicitadas <= mesasDisponibles){
                resolve("Mesas disponibles");
            }
            else{
                reject("No hay suficientes mesas disponibles")
            }

        }, 2000);  // Simula un retraso en la verificación (2 segundos)
    });
}

// Función que simula el envío de un correo de confirmación
function enviarConfirmacionReserva(nombreCliente) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if(Math.random() > 0.2){
                resolve(`Correo de confirmación enviado con exito a ${nombreCliente}`);
            }
            else{
                reject("Error al enviar el correo de confirmación");
            }
        }, 1500);  // Simula el envío de un correo (1.5 segundos)
    });
}

// Función principal para manejar una reserva
async function hacerReserva(nombreCliente, mesasSolicitadas) {
    try {

        console.log("Verificando disponibilidad de mesas...");
        const disponibilidad = await verificarDisponibilidad(mesasSolicitadas);  // Llama a la función de verificación
        console.log(disponibilidad);   

        const enviarCorreo = await enviarConfirmacionReserva(nombreCliente);
        console.log(enviarCorreo);

    } catch (error) {
        console.log("Error:", error);  // Maneja los errores en la promesa
    }
}

// Llamada de prueba
hacerReserva("Juan Pérez", 3);  // Intenta hacer una reserva para 3 personas
hacerReserva("Wilberth Martínez", 4);
hacerReserva("Jasiel Martínez", 7);