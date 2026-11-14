const CategoriaFlyweight = require("./CategoriaFlyweight");

class CategoriaFactory {
    static categorias = {};

    static getCategoria(nombre) {
        if (!this.categorias[nombre]) {
            this.categorias[nombre] = new CategoriaFlyweight(nombre);
        } else {
            console.log("Reutilizando categoría:", nombre);
        }

        return this.categorias[nombre];
    }
}

module.exports = CategoriaFactory;