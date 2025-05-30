// URL DE LA API REST DONDE SE ALMACENAN LOS PRODUCTOS
const API_URL = 'http://localhost:3000/tareas'; // URL de la API REST

// MANIPULAR EL DOM
// Seleccionar los elemnetos del dom
const containers = {
    pendiente: document.getElementById("pendiente"),
    enprogreso: document.getElementById("enprogreso"),
    terminada: document.getElementById("terminada"),
};

// Seleccionar elementos accionables
const modal = document.getElementById("form-modal");
const formulario = document.getElementById("formulario-tarea");

const inputId = document.getElementById("tarea-id");
const inputTitulo = document.getElementById("titulo");
const inputDescripcion = document.getElementById("descripcion");
const inputResponsable = document.getElementById("responsable");
const inputEstado = document.getElementById("estado");
const cancelarBtn = document.getElementById("cancelar-btn");

// Función para obtener las tareas desede el servidor y mostrarlo en las cartas
async function getTareas() {
    try{
        const response = await fetch(API_URL); // hacer una solicitud/petición GET a la API
        const tareas = await response.json(); // convertir la respuesta a JSON
        console.log(tareas);
        renderTareasPorEstado(tareas); // llamar a la función para renderizar los productos 
    }catch(error){
        showError('Error al obtener las tareas: ' + error.message) // Muestra un mensaje de error si ocurre un error al cargar las tareas
    }
}

function showError(mensaje) {
    alert(mensaje);
}

//Función para mostrar las tareas
function renderTareasPorEstado(tareas){
    // limpiar el contenedor
    for(const estado in containers){
        containers[estado].innerHTML = "";
    }

    tareas.forEach(tarea => {
        let estadoKey = tarea.estado.toLowerCase().replace(" ", "");
        const card = crearElementoTarea(tarea);
        const contenedor = containers[estadoKey];
        if (contenedor) {
            contenedor.appendChild(card);
        }
    });
}

function crearElementoTarea(tarea){
    // crear un div con una clase llamada "card" para cada tarea
    const card = document.createElement("div");
    card.className = "card"; // añadir la calse "card" al div
    // Define el contenido HTML de la tarjeta con los datos de la tarea
    card.innerHTML = ` 
        <div class="text-card">
            <h2>${tarea.id}. ${tarea.titulo}</h2>
        </div>
        <div class="text-card"> ${tarea.descripcion} </div>
        <div class="text-card"><strong>Responsable:</strong> ${tarea.responsable || "N/A"}</div>
        <div class="card-actions">
            <button class="edit-card-btn" data-id="${tarea.id}">
                Editar
            </button>
            <button class="delete-card-btn" data-id="${tarea.id}">
                Borrar
            </button>
        </div>
    `;

        // Agregar eventos
    card.querySelector(".edit-card-btn").addEventListener("click", () => {
        actualizarTarea(tarea.id);
    });

    card.querySelector(".delete-card-btn").addEventListener("click", () => {
        eliminarTarea(tarea.id);
    });

    return card;
}

// Funciones de edición y eliminación
async function actualizarTarea(id){
    try{
        console.log("Intentando acceder a la tarea con ID:", id);
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        const tarea = await response.json();
        inputId.value = tarea.id;
        inputTitulo.value = tarea.titulo;
        inputDescripcion.value = tarea.descripcion;
        inputEstado.value = tarea.estado.toLowerCase().replace(" ", "");
        inputResponsable.value = tarea.responsable || "";
        modal.style.display = "flex";
    }catch(error){
        showError("Error al cargar tarea: " + error.message);
    }
}

async function eliminarTarea(id) {
    try{
        console.log("Intentando acceder a la tarea con ID:", id);
        const response = await fetch(`${API_URL}/${id}`,{method: "DELETE",});
        // Manejo de error en la respuesta del servidor
        if(!response.ok) throw new Error(`Status: ${response.status}`); // Si la respuesta no es OK, lanzar un error
        // si la respuesta es correcta, actualizar la lista de productos
        await getTareas(); // recargar la lista de productos después de eliminar el producto
    }catch(error){
        showError('Error al eliminar el producto: ' + error.message); // Mostrar un mensaje de error si ocurre un error al eliminar el producto
    }
}

// Formulario

cancelarBtn.addEventListener("click", () => {
    modal.style.display = "none";
    limpiarFormulario();
});

// Enviar formulario: crear o actualizar
formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    const tarea = {
        titulo: inputTitulo.value.trim(),
        descripcion: inputDescripcion.value.trim(),
        responsable: inputResponsable.value.trim(),
        estado: inputEstado.value.trim()
    };

    const id = inputId.value;

    try {
        if (id) {
            await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(tarea)
            });
        } else {
            await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(tarea)
            });
        }

        getTareas();
        modal.style.display = "none";
        limpiarFormulario();

    } catch (error) {
        showError("Error al guardar la tarea: " + error.message);
    }
});

function limpiarFormulario() {
    inputId.value = "";
    inputTitulo.value = "";
    inputDescripcion.value = "";
    inputResponsable.value = "";
    inputEstado.value = "pendiente";
}

// Botones de "Añadir tarea"
document.querySelectorAll(".add-card-btn").forEach((btn, index) => {
    btn.addEventListener("click", () => {
        inputId.value = "";
        inputTitulo.value = "";
        inputDescripcion.value = "";
        inputResponsable.value = "";
        modal.style.display = "flex";
    });
});

async function crearTareaDummy() {
    const tarea = {
        id: 100,
        titulo: "Dummy",
        descripcion: "Dummy description",
        responsable: "Tú",
        estado: "pendiente"
    };

    await fetch(`${API_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tarea)
    });

    getTareas();
}




// Iniciar la app
getTareas();
