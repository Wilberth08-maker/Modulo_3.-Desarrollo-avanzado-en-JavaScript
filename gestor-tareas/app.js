// URL DE LA API REST DONDE SE ALMACENAN LOS PRODUCTOS
const API_URL = 'https://api-project-mm6l.onrender.com/tareas'; // URL de la API REST

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
const inputAvatar = document.querySelector('input[name="avatar"]:checked') || { value: '' };

// Función para obtener las tareas desede el servidor y mostrarlo en las cartas
async function getTareas() {
    try{
        const response = await fetch(API_URL); // hacer una solicitud/petición GET a la API
        const tareas = await response.json(); // convertir la respuesta a JSON
        
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

    const contadores = {
        pendiente: 0,
        enprogreso: 0,
        terminada: 0,
    };

    // limpiar el contenedor
    for(const estado in containers){
        containers[estado].innerHTML = "";
    }

    tareas.forEach(tarea => {
        let estadoKey = tarea.estado.toLowerCase().replace(" ", "");
        contadores[estadoKey]++;
        const card = crearElementoTarea(tarea);
        const contenedor = containers[estadoKey];
        if (contenedor) {
            contenedor.appendChild(card);
        }
    });

    // Contadores de tareas por estado
    document.getElementById("contador-pendiente").textContent = contadores.pendiente;
    document.getElementById("contador-enprogreso").textContent = contadores.enprogreso;
    document.getElementById("contador-terminada").textContent = contadores.terminada;

}

function crearElementoTarea(tarea){
    // crear un div con una clase llamada "card" para cada tarea
    const card = document.createElement("div");
    card.className = "card"; // añadir la calse "card" al div
    // Define el contenido HTML de la tarjeta con los datos de la tarea

    card.setAttribute("draggable", true); // Hace que la tarjeta se pueda arrastrar

    card.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", tarea.id);
    });

    card.innerHTML = ` 
        <div class="text-card">
            <h2>${tarea.id}. ${tarea.titulo}</h2>
        </div>
        <div class="text-card"> ${tarea.descripcion} </div>
        <div class="responsable-info">
        <strong>Responsable:</strong>${tarea.responsable || "N/A"}
        <img src="${tarea.avatar || 'default-avatar.png'}" class="avatar-small" /> 
        </div>
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
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        const tarea = await response.json();
        inputId.value = tarea.id;
        inputTitulo.value = tarea.titulo;
        inputDescripcion.value = tarea.descripcion;
        inputEstado.value = tarea.estado.toLowerCase().replace(" ", "");
        inputResponsable.value = tarea.responsable || "";

        
        const avatarOptions = document.querySelectorAll('.avatar-option input[name="avatar"]');

        avatarOptions.forEach(input => {
            input.checked = false;
            input.parentElement.classList.remove('selected');
        });

        const avatarToSelect = Array.from(avatarOptions).find(input => input.value === tarea.avatar);
        if (avatarToSelect) {
            avatarToSelect.checked = true;
            avatarToSelect.parentElement.classList.add('selected');
        }

        modal.style.display = "flex";
    }catch(error){
        showError("Error al cargar tarea: " + error.message);
    }
}

async function eliminarTarea(id) {
    const confirmar = confirm("¿Estás seguro de que deseas eliminar esta tarea?");
    if (!confirmar) return;

    try{
        const response = await fetch(`${API_URL}/${id}`,{method: "DELETE",});
        // Manejo de error en la respuesta del servidor
        if(!response.ok) throw new Error(`Status: ${response.status}`); // Si la respuesta no es OK, lanzar un error
        // si la respuesta es correcta, actualizar las cards
        await getTareas(); // recargar las tareas después de eliminar el producto
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

    const selectedAvatar = document.querySelector('input[name="avatar"]:checked');
    const tarea = {
        titulo: inputTitulo.value.trim(),
        descripcion: inputDescripcion.value.trim(),
        responsable: inputResponsable.value.trim(),
        estado: inputEstado.value.trim(),
        avatar: selectedAvatar ? selectedAvatar.value : ""
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

const avatarOptions = document.querySelectorAll('.avatar-option input[name="avatar"]');

avatarOptions.forEach(input => {
    input.addEventListener('change', () => {
        avatarOptions.forEach(i => i.parentElement.classList.remove('selected'));
        if (input.checked) {
            input.parentElement.classList.add('selected');
        }
    });
});

// EXTRA. TARJETAS DESPLAZABLES

Object.keys(containers).forEach(estadoKey => {
    const contenedor = containers[estadoKey];

    contenedor.addEventListener("dragover", (e) => {
        e.preventDefault(); // Permite soltar
    });

    contenedor.addEventListener("drop", async (e) => {
        e.preventDefault();
        const tareaId = e.dataTransfer.getData("text/plain");

        // Obtener la tarea actual
        const response = await fetch(`${API_URL}/${tareaId}`);
        const tarea = await response.json();

        // Actualizar el estado de la tarea al nuevo estado
        const nuevoEstado = estadoKey;

        // Solo actualizar si el estado cambió
        if (tarea.estado.toLowerCase().replace(" ", "") !== nuevoEstado) {
            tarea.estado = nuevoEstado;

            await fetch(`${API_URL}/${tareaId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(tarea)
            });

            getTareas(); // Recarga las tareas
        }
    });
});

// Iniciar la app
getTareas();
