//Importamos
import { Router } from 'express'
import fs from 'fs'

const router = Router()

const products = []

//ENDPOINTS para los productos.

//En router.get mostramos los productos que tenemos cargados.
router.get("/products", (req,res)=>{

    fs.readFile('producto.json', 'utf-8', (error)=>{
        if(error){
            console.error(error);
            return res.status(500).json({error: 'Error interno en el servidor'})
        }
        res.json(products)
    }) //Leemos el archivo "producto.json".
})

//En este router.get buscamos un producto en especifico con el "id".
router.get("/products/:pid", (req, res)=>{

    const producId = parseInt(req.params.pid) //Recibimos un producto por parametro.
    //Usamos el metodo .find y le decimos el p.id lo debe comparar con produc.id
    const produc = products.find((p => p.pid === producId))
// 
    fs.readFile('producto.json', 'utf-8', (error)=>{
        if(error){
            console.error(error);
            return res.status(500).json({error: 'Error interno en el servidor'})
        }

        if(!produc) return res.send({error: "Producto no encontrado"}) //Verificamos si el producto es correcto.
        res.send(produc) //Devolvemos dicho producto recibido.
    }) //Leemos el archivo "producto.json" y tomamos el id del mismo.
//
})

//En router.post creamos un nuevo producto(newProduct) y creamos con fs.writeLine un archivo "producto.json" donde registramos nuestros productos.
router.post("/products", (req, res)=>{

    const newProduct = { 
        pid: products.length + 1,
        title: "reloj inteligente",
        description: "Incluye chat-gpt",
        code: "1111",
        price: 15,
        status: true,
        stock: 20,
        category: "electronica",
    } //Creamos un nuevo producto.
//
    fs.writeFile('producto.json', JSON.stringify(products, null, 2), (error)=>{
        if(error){
            console.error(error);
            return res.status(500).json({error: 'Error interno en el servidor'})
        }
        products.push(newProduct) //Agregamos el nuevo producto.
        //io.emit('productoActualizado', products)
        res.render('lista-productos', {products})
        res.status(200).json({message: 'Producto cargado'})
    }) //Creamos el archivo "producto.json".
//
})

//En router.put agregamos y modificamos un producto manualmente desde nuestro "body" de postman.
router.put("/products/:pid", (req,res)=>{

    const producId = parseInt(req.params.pid) //Obtenemos el id ingresado en el body.
    const produc = products.find((p => p.pid === producId)) //Buscamos q exista el id.
//
    // fs.appendFile('producto.json', produc, (error)=>{  //Dejo comentado esto profe, porque no me funciona el programa con "fs.appendFile". 
    //     console.error(error);
    //     return res.status(500).json({error: 'Error interno en el servidor'})
    // })
//
    if(produc){
        const {title} = req.body
        produc.title = title //Le damos el valor del body.
        const {description} = req.body
        produc.description = description //Le damos el valor del body.
        const {code} = req.body
        produc.code = code //Le damos el valor del body.
        const {price} = req.body
        produc.price = price //Le damos el valor del body.
        const {status} = req.body
        produc.status = status //Le damos el valor del body.
        const {stock} = req.body
        produc.stock = stock //Le damos el valor del body.
        const {category} = req.body
        produc.category = category //Le damos el valor del body.

        res.json(produc)
    }else{
        res.status(404).json({message: "Producto no encontrado"})
    }
})

//En router.delete lo que hacemos es eliminar un producto colocando su "id", el cual es el que queremos eliminar.
router.delete("/products/:pid", (req,res)=>{
    const producId = parseInt(req.params.pid)
    //Utilizamos .filter para traer todas las tareas, menos las q eliminamos.
    products = products.filter((p => p.pid !== producId)) 
//
    // fs.unlink('producto.json', (error)=>{
    //     if(error){
    //         console.log("No se puede eliminar el archivo")  //Lo dejo comentado profe, porque no me funcionaba el programa con "fs.unlink".
    //     }
    // })
//
    res.json({msj: "Producto eliminado"})
})

/////////////////////////////////////////////////////////////////////////////////////

router.get("/", (req,res)=>{
    res.render('lista-productos', {products})
})

router.get("/realtimeproducts", (req,res)=>{
    res.render('realTimeProducts', {products})
})

//Exportamos la informacion.
export default router