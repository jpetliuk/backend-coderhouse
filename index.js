const { clear } = require("console");
const fs = require("fs");

class ProductManager {
  constructor(filename) {
    this.filename = filename;
    this.format = "utf-8";
  }

  getFile = async () => {
    return fs.promises
      .readFile(this.filename, this.formate)
      .then((file) => JSON.parse(file))
      .catch((err) => {
        console.log(err);
        console.log("-----------------------------------------");
        return [];
      });
  };

  getProducts = async () => {
    return console.table(await this.getFile());
  };

  getProductByID = async (inputID) => {
    const file = await this.getFile();
    const productID = file.find(({ id }) => id === inputID);

    return productID
      ? console.table(productID)
      : console.log("error: Not found product of id: " + inputID);
  };

  getNextID = async (file) => {
    const lastObject = file[file.length - 1];

    return lastObject ? lastObject.id + 1 : 1;
  };

  codeExists = async (file, codeInput) => {
    const code = file.find(({ code }) => code === codeInput);

    return code ? true : false;
  };

  addProduct = async (title, description, price, thumbnail, code, stock) => {
    const file = await this.getFile();

    // prettier-ignore
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      return console.log("error: Todos los campos deben ser completados correctamente")
    }
    if (await this.codeExists(file, code)) {
      return console.log("error: Ingrese otro codigo");
    }

    const id = await this.getNextID(file);

    file.push({
      id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    });
    await fs.promises.writeFile(this.filename, JSON.stringify(file));

    console.log("Producto agregado satisfactoriamente");
  };

  deleteProduct = async (idInput) => {
    const file = await this.getFile();

    const index = file.findIndex((object) => {
      return object.id === idInput;
    });

    if (!index || index < 0)
      return console.log(`error: el producto de id "${idInput}" no existe.`);

    file.splice(index, 1);

    await fs.promises.writeFile(this.filename, JSON.stringify(file));
    console.log(`el producto de id "${idInput}" se a eliminado correctamente`);
  };

  updateProduct = async (idInput, toChange, info) => {
    const file = await this.getFile();
    const index = file.findIndex((object) => {
      return object.id === idInput;
    });

    if (!index || index < 0)
      return console.log(`error: el producto de id "${idInput}" no existe.`);

    if (toChange === "price" || toChange === "stock") {
      file[index][toChange] = ~~info;
    } else {
      file[index][toChange] = info;
    }

    console.table(file[index]);
    await fs.promises.writeFile(this.filename, JSON.stringify(file));
  };
}

const Manager = new ProductManager("users.json");

//--------- Descomentar para usar sin interface -------------

// async function run() {
//   await Manager.addProduct(
//     "producto prueba",
//     "Este es un producto prueba",
//     200,
//     "sin imagen",
//     "abc123",
//     25
//   );

//   await Manager.getProducts();

//   await Manager.getProductByID(1);

//   await Manager.updateProduct(1, "title", "new title");

//   await Manager.getProductByID(1);

//   await Manager.deleteProduct(1);
// }

// run();

//--------------------------------------------------------------------
//-----------------------------INTERFACE------------------------------
//--------------------------------------------------------------------

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));

const interface = async () => {
  try {
    let opperation = null;
    let pause = false;
    while (opperation !== "exit") {
      clear();
      console.log('<type "help" to see all comands>');
      console.log('<commands: "new" "id" "all" "delete" "update">');
      console.log(" ");
      opperation = await prompt("What's your next opperation?: ");

      if (opperation === "help") {
        clear();
        console.log('type "new" to add a new product.');
        console.log('type "all" to see all products.');
        console.log('type "id" to search a product by its id.');
        console.log('type "remove" to add a new product.');
        console.log('type "update" to add a new product.');
        console.log('type "exit" to exit.');
        console.log(" ");

        pause = await prompt("press enter to continue");
      }

      if (opperation === "new") {
        clear();
        let title = await prompt("product title: ");
        let description = await prompt("product description: ");
        let price = await prompt("product price (number): ");
        let thumbnail = await prompt("product thumbnail: ");
        let code = await prompt("product code: ");
        let stock = await prompt("product stock (number): ");

        console.log(" ");

        await Manager.addProduct(
          title,
          description,
          ~~price,
          thumbnail,
          code,
          ~~stock
        );

        console.log(" ");
        pause = await prompt("press enter to continue");
      }

      if (opperation === "all") {
        clear();
        console.log(" ");
        await Manager.getProducts();
        console.log(" ");
        pause = await prompt("press enter to continue");
      }

      if (opperation === "id") {
        clear();
        let id = await prompt("id of the product you search: ");
        console.log(" ");
        await Manager.getProductByID(~~id);
        console.log(" ");
        pause = await prompt("press enter to continue");
      }

      if (opperation === "delete") {
        clear();
        let id = await prompt("id of the product you want to delete: ");
        console.log(" ");
        await Manager.deleteProduct(~~id);
        console.log(" ");
        pause = await prompt("press enter to continue");
      }

      if (opperation === "update") {
        clear();
        let id = await prompt("id of the product: ");
        console.log(" ");
        await Manager.getProductByID(~~id);
        console.log(" ");
        let toChange = await prompt("property you want to change: ");
        let info = await prompt("new contect: ");
        console.log(" ");
        await Manager.updateProduct(~~id, toChange, info);
        console.log(" ");
        pause = await prompt("press enter to continue");
      }
    }

    rl.close();
  } catch (e) {
    console.error("Unable to prompt", e);
  }
};
async function runInterface() {
  await interface();
}

//--------- Comentar para usar sin la interfaz ---------
runInterface();
