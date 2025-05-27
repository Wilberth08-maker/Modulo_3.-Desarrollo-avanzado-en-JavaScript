// Datos iniciales de libros en formato JSON
let biblioteca = {
    "libros": [
        { "titulo": "Cien años de soledad", "autor": "Gabriel García Márquez", "genero": "Realismo mágico", "disponible": true },
        { "titulo": "1984", "autor": "George Orwell", "genero": "Distopía", "disponible": true }
    ]
};

// Función para simular la lectura de datos (asimilar la lectura de un archivo JSON)
function leerDatos(callback) {
    setTimeout(() => {
        // Aquí simulas leer el JSON con un retraso de 1 segundo
        callback(biblioteca);
    }, 1000);
}

// Función para simular la escritura de datos
function escribirDatos(callback) {
    setTimeout(() => {
        callback();
    }, 1000)
}

// Función para mostrar todos los libros en consola
function mostrarLibros() {
    leerDatos((datos) => {
        console.log("Inventario de libros:");
        datos.libros.forEach((libro, index) => {
            console.log(`${index + 1}. ${libro.titulo} - ${libro.autor} (${libro.disponible ? 'Disponible' : 'Prestado'})`);
        });
    });
}

// Función para agregar un nuevo libro
function agregarLibro(titulo, autor, genero, disponible) {
    const nuevoLibro = { titulo, autor, genero, disponible };
    // Aquí falta la simulación de escribir el libro en el "archivo" (es decir, agregarlo al objeto)
    setTimeout(() => {
        biblioteca.libros.push(nuevoLibro);
        escribirDatos(() => {
            console.log(`Libro "${titulo}" agregado exitosamente.`);
            setTimeout(() => {
                mostrarLibros(); // Mostrar los libros
            })
        })
    }, 1000);
}

// Función para cambiar la disponibilidad de un libro
function actualizarDisponibilidad(titulo, nuevoEstado) {
    // Simula un retraso antes de actualizar la disponibilidad
    setTimeout(() => {
        const libro = biblioteca.libros.find(libro => libro.titulo === titulo);
        if(libro){
            libro.disponible = nuevoEstado;
            escribirDatos(() => {
                console.log(`Disponibilidad del libro "${titulo}" actualizada`);
                
            })
        }
        else{
            console.log(`Libro con título "${titulo}" no encontrado`);
            
        }
    }, 1000);
}

// Ejemplo de cómo ejecutar la aplicación
mostrarLibros();
agregarLibro("El principito", "Antoine de Saint-Exupéry", "Fábula", true);
actualizarDisponibilidad("1984", false);