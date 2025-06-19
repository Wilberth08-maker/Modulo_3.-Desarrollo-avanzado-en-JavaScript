const planetas = require('./planetas');
const cowsay = require('cowsay');

planetas.forEach((planeta) => {
    console.log(cowsay.say({
        text: `¡Planeta ${planeta.nombre} descubierto!\nDescripción: ${planeta.descripcion}\nAño: ${planeta.descubiertoEn}`,
        e: "^^",
        T: "U ",
        f: "stegosaurus"
    }));
    console.log("---");
});