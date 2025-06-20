import './style.css';

let numeroSecreto = Math.floor(Math.random() * 100) + 1;
let intentos = 0;

const inputNumero = document.getElementById('numero');
const botonAdivinar = document.getElementById('adivinar');
const botonReiniciar = document.getElementById('reiniciar');
const mensaje = document.getElementById('mensaje');
const mensajeIntentos = document.getElementById('intentos');

botonAdivinar.addEventListener('click', () => {
    const numeroJugador = parseInt(inputNumero.value);

    if (isNaN(numeroJugador) || numeroJugador < 1 || numeroJugador > 100) {
        mensaje.textContent = 'Por favor, ingresa un número válido entre 1 y 100.';
    
    } else{
        intentos ++;
        mensajeIntentos.textContent = `Intentos: ${intentos}`;

        if (numeroJugador === numeroSecreto) {
            mensaje.textContent = '¡Felicidades! ¡Adivinaste el número!';
            animarMensaje();
            botonAdivinar.disabled = true;
            inputNumero.disabled = true;
        }   else if (numeroJugador < numeroSecreto) {
            mensaje.textContent = 'El número secreto es más alto.';
            animarMensaje();
        }   else {
            mensaje.textContent = 'El número secreto es más bajo.';
            animarMensaje();
        }
    }
    inputNumero.focus();
});

botonReiniciar.addEventListener('click', () => {
    numeroSecreto = Math.floor(Math.random() * 100) + 1;
    intentos = 0;
    mensajeIntentos.textContent = 'Intentos: 0';
    mensaje.textContent = '';
    inputNumero.value = '';
    inputNumero.disabled = false;
    botonAdivinar.disabled = false;
    inputNumero.focus();
});

function animarMensaje() {
    mensaje.classList.remove('mensaje-animado'); 
    void mensaje.offsetWidth; 
    mensaje.classList.add('mensaje-animado');
}