// COLA DE EJECUCIÓN DE JAVASCRIPT
console.log('COLA DE EJECUCIÓN DE JAVASCRIPT');

// Definimos una clase Cola para gestionar una estrucutura tipo
// F.I.F.O (First In First Out)

class Cola {
    constructor(){
        this.items = []; // Array vacio para almacenar los elementos de la pila
    }

    // Método para  simular una cola en javascript
    enqueue(elemento){
        console.log(`Enqueue: Agregando "${elemento}" a la cola`);
        this.items.push(elemento);
    }
    // Método para eliminar el primer elemento de la cola
    dequeue(){
        if(this.isEmpty()){
            console.log("Dequeue: la cola está vacía. No se puede eliminar el elemento");
            return null;
        }
        const elemento = this.items.shift();    // Eliminamos el primer elemento del array
        console.log(`Dequeue: eliminando "${elemento}" de la cola`);
        return elemento;
    }
    // Devuelve el primer elemento de la cola sin eliminarlo de la misma
    front(){
        if(this.isEmpty()){
            console.log("Front: la cola de ejecución está vacía");
            return null;
        }
        console.log(`Front: el primer elemento de la cola es "${this.items[0]}"`);
        return this.items[0];   // Accedemos al primer elemento del array
    }
    // Muestra el último elemento de la cola sin eliminarlo de la misma
    back(){
        if(this.isEmpty()){
            console.log("Back: la cola de ejecución está vacía");
            return null;
        }
        const last = this.items[this.items.length - 1 ]  // Accedemos al último elemento del array
        console.log(`Back: el último elemento de la cola es "${last}"`);
        return last;
    }
     // Devuelve el número de elementos de la cola
        size(){
        console.log(`Size: la cola tiene ${this.items.length} elementos`);
        return this.items.length;
    }
    //Imprime todos los elementos de la cola 
    print(){
        if(this.isEmpty()){
            console.log("Print: la cola está vacía");
        }else{
            console.log("Contenido de la cola:" , this.items.join("<-"));
        }
    }
    // Método auxiliar
    // Verificar si la pila está vacía
    isEmpty(){
        return this.items.length === 0;
    }
}

// INSTANCIAR UNA COLA DE EJECUCIÓN
// Simulación de operaciones sobre la cola de ejecución
console.log("Creando una nueva instancia de la cola  de ejecución...");
// Creamos la instancia de la clase Cola
const miColaEjecucion = new Cola();

miColaEjecucion.enqueue("Tarea 1");
miColaEjecucion.enqueue("Tarea 2");
miColaEjecucion.enqueue("Tarea 3");
miColaEjecucion.enqueue("Tarea 4");
miColaEjecucion.enqueue("Tarea 5");

miColaEjecucion.front(); // debe ser "Tarea 1"
miColaEjecucion.back(); // debe ser "Tarea 5"
miColaEjecucion.print(); // muestra toda la cola

miColaEjecucion.dequeue(); // elimina "Tarea 1"
miColaEjecucion.front(); // debe ser "Tarea 2"
miColaEjecucion.back(); // debe ser "Tarea 5"
miColaEjecucion.print(); // muestra toda la cola

miColaEjecucion.size(); // debe ser 4

console.log("Fin de la simulación");

//  Fin de la simulación
console.log('-------------------------------------------------------------------');


// SIMIULAR UNA PILA DE EJECUCIÓN DE JAVASCRIPT
// Definimos una clase Pila para gestionar una estrcutura tipo
// L.I.F.O (Last In First Out)
console.log('PILA DE EJECUCIÓN DE JAVASCRIPT');

class Pila {
    constructor(){
        this.items = []; // Array vacio para almacenar los elementos de la pila
    }

    // Método para  simular una pila
    push(elemento){ // Push: añade un elemento a la pila
        console.log(`Push: Agregando "${elemento}" a la pila`);
        this.items.push(elemento);
    }
   // Pop: elimina el elemento de la pila (el tope de la pila)
    pop(){
        if(this.isEmpty()){
            console.log("Pop: la pila está vacía. No se puede eliminar el elemento");
            return null;
        }
        const elemento = this.items.pop();  // Eliminamos el último elemento del array
        console.log(`Pop: eliminando "${elemento}" de la pila`);
        return elemento;
    }

    // Devuelve el último elemento de la pila sin eliminarlo de la misma 
    peek(){
        if(this.isEmpty()){
            console.log("Peek: no se puede ver el último elemento de la pila, la pila está vacía");
            return null;
        }
        const tope = this.items[this.items.length - 1 ];     // Accedemos al último elemento del array
        console.log(`Peek: el ultimo elemento de la pila es "${tope}"`);
        return tope;
    }

    // Devuelve el número de elementos de la pila
    size(){
        console.log(`Size: la pila tiene ${this.items.length} elementos`);
        return this.items.length;
    }

    // Imprime todos los elementos de la pila 
    print(){
        if(this.isEmpty()){
            console.log("Print: la pila está vacía");
        }else{
            console.log("Contenido de la pila:" , this.items.join(","));
        }
    }

    // Método auxiliar
    // Verificar si la pila está vacía
    isEmpty(){
        return this.items.length === 0;
    }
}

// INSTANCIAR UNA PILA
// CREAR LOS OBJETOS DE LA CLASE Pila
// Simulación de una pila de ejecución de Javascript
console.log("Creando una nueva instancia de pila...");

// Creamos la instancia de la clase Pila
const miPila = new Pila();

miPila.pop(); // Debe ser null, ya que la pila está vacía

// Agregamos elementos a la pila
miPila.push("Libro 1");
miPila.push("Libro 2");
miPila.push("Libro 3");
miPila.push("Libro 4");
miPila.push("Libro 5");

// Consultamos el elemento que está en el tope de la pila
miPila.peek(); 
// Consultamos el tamaño de la pila 
miPila.size();
// Imprimos el contenido de la pila
miPila.print();
// Eliminamos el elemento que está en el tope de la pila
miPila.pop();
// Volvemos a consultar el tope y el tamaño actual de la pila
miPila.peek();
miPila.size();
miPila.print();

// Vaciamos por completo la pila
miPila.pop(); 
miPila.size();
miPila.pop(); 
miPila.size();
miPila.pop(); 
miPila.size();
miPila.pop();
miPila.size(); // debe ser 0
console.log("Fin de la simulación");

// Fin de la simulación