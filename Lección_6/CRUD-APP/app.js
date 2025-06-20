// URL DE LA API REST DONDE SE ALMACENAN LOS PRODUCTOS
const API_URL = 'http://localhost:3000/products'; // URL de la API REST

// Vamos a manipular el Dom
// Referencia a los elementos del DOM  que interactuan con el usuario
const productForm = document.getElementById('product-form');
const productTable = document.getElementById('product-table');
const resetBtn = document.getElementById('reset-btn'); // Botón para restablecer el formulario
const searchBtn = document.getElementById('search-btn'); // Botón para buscar un producto por ID
const errorMessage = document.getElementById('error-message'); // elemento para mostrar mensajes de error

// Inputs del formulario para ingresar información sobre los productos 
const inputId = document.getElementById('product-id'); // ID del producto
const inputName = document.getElementById('product-name'); // Nombre del producto
const inputPrice = document.getElementById('product-price'); // Precio del producto
const searchInput = document.getElementById('search-id'); // Input para buscar un producto por ID

// Función para mostrar un mensaje de error en la interfaz de usuario
function showError(message){
    errorMessage.textContent = message; // Asignar el mensaje de error al elemento de error
    errorMessage.style.display = 'block'; // Mostrar el elemento de error
}

// Función para ocultar el mensaje de error en la interfaz de usuario
function clearError(){
    errorMessage.textContent = ''; // Limpiar el mensaje de error
    errorMessage.style.display = 'none'; // Ocultar el elemento de error
}

//Evento para manejar el envío del formulario ( Crear y Editar un producto)
productForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evitar la recarga de la página al enviar el formulario.

    const id = inputId.value.trim();     // Obtener el valor del campo de ID del producto
    const name = inputName.value.trim(); // Obtener el valor del campo de nombre del producto
    const price = Number(inputPrice.value.trim()); // Obtener el valor del campo de precio del producto

    //validación básica: no permitir campos vacíos
    if(!name || isNaN(price)){
        showError('Por favor, completa todos los campos correctamente.'); // Mostrar un mensaje de error si los campos no están completos
        return;
    }

    // crear un objeto con la información del producto
    const payload = {name,price}; // pyload es un objeto que contiene la información del producto que se va a enviar al servidor

    try{
        let response; // Variable para almacenar la respuesta del servidor
        // Si el ID está vacío, significa que estamos creando un nuevo producto
        if(id){
            // si el producto ya tiene un ID, significa que estamos actualiizando un producto existente (método PUT)
            response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT', // Método para actualizar un producto existente
                headers: {'Content-Type': 'application/json'}, // Indicar que el cuerpo de la solicitud es JSON
                body: JSON.stringify(payload), // Convertir el objeto payload a una cadena JSON
            })
        }else {
            // si el producto no tiene un ID, significa que estamos creando un nuevo producto (método POST)
            // obtener la lista de productos actuales para derterminar el nuevo ID
            const allProductsRes = await fetch(API_URL); // obtener la lista de productos actuales
            const allProducts = await  allProductsRes.json(); // convertir la respuesta a JSON
            // al tener la lista de productos, generar un nuevo ID 
            const newId = allProducts.length 
            ? Math.max(...allProducts.map(p => Number(p.id))) + 1
             : 1; // Generar un nuevo ID basado en el máximo ID existente
            // Enviar la solicitud para crear un nuevo producto
            response = await fetch(API_URL , {
                method: 'POST', // Método para actualizar un producto existente
                headers: {'Content-Type': 'application/json'}, // Indicar que el cuerpo de la solicitud es JSON
                body: JSON.stringify({id: String(newId), ...payload}), // Convertir el objeto payload a una cadena JSON
        });
        }
        // manejor de error en la respuesta del servidor
        if(!response.ok) throw new Error(`Status: ${response.status}`); // Si la respuesta no es OK, lanzar un error
        clearError(); // Limpiar el mensaje de error si la solicitud fue exitosa
        await getProducts(); // actulizar la lista de productos en la tabla
        productForm.reset(); // Limpiar el formulario después de enviar los datos
    }catch(error){
        showError('Error al enviar los datos: ' + error.message); // Mostrar un mensaje de error si ocurre un error al enviar los datos
    }
})

// Función para obtener la lista de productos desde el servidor y mostrarlos en la tabla
async function getProducts() {
    try{
        const response = await fetch(API_URL); // hacer una solicitud/petición GET a la API
        const products = await response.json(); // convertir la respuesta a JSON
        renderProducts(products); // llamar a la función para renderizar los productos en la tabla
    }catch(error){
        showError('Error al obtener los productos: ' + error.message) // Muestra un mensaje de error si ocurre un error al cargar los productos
    }
}

//Función para mostrar los productos en la tabla HTML
function renderProducts(products){
    productTable.innerHTML = ''; // limpiar la tabla antes de mostrar los productos
    // iterar sobre cada producto y crear una fila en la tabla
    products.forEach(p => {
        const row = document.createElement('tr'); // crear una nueva fila
        row.innerHTML = ` 
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.price}</td>   
        <td>
            <button class="btn btn-outline-warning btn-sm edit-btn" data-id="${p.id}">Editar</button>
            <button class="btn btn-outline-danger btn-sm delete-btn" data-id="${p.id}">Eliminar</button>
        </td>
        ` 
        // Agregar la fila a la tabla
        productTable.appendChild(row);
    })

      // Asignar eventos a los botones de editar y eliminar productos
document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', () => {
        const id = button.getAttribute('data-id'); // Obtener el ID del producto desde el atributo data-id del botón
        editProduct(id); // Llamar a la función para editar el producto con el ID correspondiente
    })
})

document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', () => {
        const id = button.getAttribute('data-id'); // Obtener el ID del producto desde el atributo data-id del botón
        deleteProduct(id); // Llamar a la función para eliminar el producto con el ID correspondiente
    })
})
}

//Función para eliminar un producto mediante su ID
async function deleteProduct(id){
    //asegurarme que el id es un número
    const idNumber = Number(id);
    // confirmar la eliminación del producto
    if(!confirm('Estás seguro de eliminar este producto?')) return; // Si el usuario no confirma, salir de la función
    try{
        // Hacer una solicitud DELETE a la API para eliminar el producto
        const response = await fetch(`${API_URL}/${idNumber}`, { method: 'DELETE', }); // Método para eliminar un producto
        // Manejo de error en la respuesta del servidor
        if(!response.ok) throw new Error(`Status: ${response.status}`); // Si la respuesta no es OK, lanzar un error
        clearError(); // Limpiar el mensaje de error si la solicitud fue exitosa
        // si la respuesta es correcta, actualizar la lista de productos
        await getProducts(); // recargar la lista de productos después de eliminar el producto
    }catch(error){
        showError('Error al eliminar el producto: ' + error.message); // Mostrar un mensaje de error si ocurre un error al eliminar el producto
    }
}

// Función para editar un producto en el formulario
async function editProduct(id) {
    try{
        const response = await fetch(`${API_URL}/${id}`); // Hacer una solicitud GET a la API para obtener el producto por ID
        const product = await response.json();
        inputId.value = product.id; // Asignar el ID del producto al campo de ID del formulario
        inputName.value = product.name; // Asignar el nombre del producto al campo de nombre del formulario
        inputPrice.value = product.price; // Asignar el precio del producto al campo de precio del formulario

        window.scrollTo({ top: 0, behavior: 'smooth' });

    }catch(error){
        showError('Error al editar el producto: ' + error.message); // Mostrar un mensaje de error si ocurre un error al editar el producto
    }
}

// evento para buscar productos por su ID
searchBtn.addEventListener('click', async () => {
    const id = searchInput.value.trim(); // Obtener el ID del producto desde el input de búsqueda
    if(!id) return; // evitar busquedas con campos vacíos
    try{
        const response = await fetch(`${API_URL}/${id}`); // Hacer una solicitud GET a la API para obtener el producto por ID
        if(!response.ok) throw new Error("Producto no encontrado"); // Si la respuesta no es OK, lanzar un error
        const product = await response.json(); // Convertir la respuesta a JSON
        renderProducts([product]); // Renderizar solo el producto encontrado en la tabla
    }catch(error){
        showError('Error al buscar el producto: ' + error.message); // Mostrar un mensaje de error si ocurre un error al buscar el producto
    }
});

// evento para limpiar el formulario de busqueda y recargar todos los productos
resetBtn.addEventListener('click', () => {
    productForm.reset(); // Limpiar el formulario
    inputId.value = ''; // Limpiar el campo de ID del formulario
    getProducts(); // Recargar la lista de productos
});


getProducts(); // Llamar a la función para obtener los productos al cargar la página