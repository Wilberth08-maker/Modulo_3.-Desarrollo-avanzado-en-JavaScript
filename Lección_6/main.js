// Importamos Zod
const { z } = window.Zod;

const inputName = document.getElementById("name");
const inputEmail =  document.getElementById("email");
const inputPassword = document.getElementById("password");
const errorsDiv = document.querySelector(".errorsOculto")

// Esquema para validar los datos del formulario
const registerSchema = z.object({
    name: z.string().min(1, "⚠️ El nombre es obligatorio"),
    email: z.string().email("⚠️ Correo electrónico inválido"),
    password: z.string().min(6, "⚠️ La contraseña debe tener al menos 6 caracteres")
});

document.getElementById("registerForm").addEventListener("submit", (event) => {
    event.preventDefault();

    // Capturamos los valores ingresados
    const formData = {
        name: inputName.value.trim(),
        email: inputEmail.value.trim(),
        password: inputPassword.value,
    };

    // Limpiar errores anteriores
    document.getElementById("errors").textContent = "";
    errorsDiv.classList.add('errorsOculto');

    try {
        registerSchema.parse(formData)
        alert("¡Registro exitoso!");
        limpiarFormulario();

    } catch (error) {
        if (error.errors) {
            errorsDiv.classList.remove('errorsOculto');
            document.getElementById("errors").textContent = error.errors
                .map((e) => e.message)
                .join(", ");
        } else {
            console.error(error);
        }
    }
});

function limpiarFormulario() {
    inputName.value = "";
    inputEmail.value = "";
    inputPassword.value = "";
}
