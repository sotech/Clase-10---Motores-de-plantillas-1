const { Producto } = require("./producto");
const express = require('express');
const path = require('path');

const app = express();
const router = express.Router();
const port = 8080;


app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', router);

let listaProductos = [];
//Home
app.get('/', (req, res) => {
    res.render("pages/formularioCarga", {productoCargado:false});
});

//Listar todos los productos
router.get('/productos/listar', (req, res) => {
    console.log("API - Listar Productos");
    //Hay productos?
    if (listaProductos.length > 0) {
        res.status(200).json({
            productos: listaProductos
        });
    } else {
        res.status(400).json({
            error: 'no hay productos cargados'
        });
    }
});

//Listar un unico producto por ID
router.get('/productos/listar/:id', (req, res) => {
    console.log("API - Buscar Producto");
    let productosEncontrados = listaProductos.filter(prod => prod.id == req.params.id);
    if (productosEncontrados.length < 1) {
        res.status(400).json({
            error: 'producto no encontrado'
        });
    } else {
        res.status(200).json({
            producto: productosEncontrados[0]
        })
    }
});

//Almacenar un nuevo producto. Retornar el producto creado
router.post('/productos/guardar', (req, res) => {
    console.log("API - Guardar Producto");
    let producto = new Producto(req.body.title, req.body.price, req.body.thumbnail);
    producto.id = listaProductos.length;
    listaProductos.push(producto);
    res.status(200).render("pages/formularioCarga.ejs",{productoCargado:true});
});

//Actualizar producto
router.put('/productos/actualizar/:id', (req, res) => {
    console.log("API - Actualizar Producto");
    //Obtener producto
    let producto = req.body;
    //Buscar producto en la lista
    let productosEncontrados = listaProductos.filter(prod => prod.id == req.params.id);
    if (productosEncontrados.length > 0) {
        producto.id = productosEncontrados[0].id;
        listaProductos[req.params.id] = producto;
        res.status(200).json(producto);
    } else {
        res.status(400).json({
            error: 'Producto no encontrado'
        })
    }

});

//Borrar producto
router.delete('/productos/borrar/:id', (req, res) => {
    console.log("API - Borrar Producto");
    let productosRemovidos = listaProductos.splice(req.params.id, 1);
    if (productosRemovidos.length > 0) {
        res.status(200).json(productosRemovidos[0]);
    } else {
        res.status(400).json({
            error: 'Producto no encontrado'
        })
    }
});

app.get("/productos/vista",(req,res) => {
    if(listaProductos.length > 0){
        res.render("pages/main",{productos: listaProductos, hayProductos:true});
    }
    else{
        res.render("pages/main",{hayProductos:false});
    }
});

//Iniciar servidor
app.listen(port, () => {
    console.log("Servidor iniciado en el puerto " + port);
}).on("error", (err) => {
    console.log("Hubo un error: " + err);
});