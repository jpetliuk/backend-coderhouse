class ProductManager {
  constructor() {
    this.products = [];
  }

  getProducts = () => {
    return this.products;
  };
  getNextID = () => {
    const count = this.products.length;
    return count > 0 ? this.products[count - 1].id + 1 : 1;
  };
  getProductByID = (input) => {
    const result = this.products.find(({ id }) => id === input);
    return result
      ? console.log(result)
      : console.log("error: Not found product of id: " + input);
  };

  addProduct = (title, description, price, thumbnail, codeInput, stock) => {
    const codeExists = this.products.find(({ code }) => code === codeInput);
    let stop = false;

    title && description && price && thumbnail && codeInput && stock
      ? codeExists
        ? (console.log("error: Ingrese otro codigo"), (stop = true))
        : console.log("Producto agregado satisfactoriamente")
      : (console.log("error: Todos los campos deben ser completados"),
        (stop = true));
    if (stop) return;

    const id = this.getNextID();
    const products = {
      id,
      title,
      description,
      price,
      thumbnail,
      code: codeInput,
      stock,
    };

    this.products.push(products);
  };
}

const Manager = new ProductManager();

console.log("<Add product>");
//Producto de prueba:
Manager.addProduct(
  "producto prueba",
  "Este es un producto prueba",
  200,
  "Sin imagen",
  "abc123",
  25
);
//Producto de prueba con mismo code:
Manager.addProduct(
  "producto prueba",
  "Este es un producto prueba",
  200,
  "Sin imagen",
  "abc123",
  25
);
//Producto de prueba con distinto code:
Manager.addProduct(
  "producto prueba",
  "Este es un producto prueba",
  200,
  "Sin imagen",
  "hola321",
  25
);
//Producto con campo vacio:
Manager.addProduct(
  "",
  "Este es un producto prueba",
  200,
  "Sin imagen",
  "12345",
  25
);
console.log("</Add product>");
console.log("---------");
console.log("<Product by Id>");
Manager.getProductByID(1);
Manager.getProductByID(3);
console.log("</Product by Id>");
console.log("---------");
console.log("<All products>");
console.log(Manager.getProducts());
console.log("</All products>");
