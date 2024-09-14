import { Router } from 'express'
import fs from 'fs'

const router = Router()

//Arreglo para el carrito.
const carts = []

//ENDPOINTS para el carrito.

//En router.post creamos un "carrito", donde la informacion va a ser guardada en un archivo "carrito.json".
router.post("/carts", (req, res)=>{
    
    const newCart = { 
        cid: carts.length + 1,
        products: []
    } //Creamos un nuevo carrito.
//
    fs.writeFile('carrito.json', JSON.stringify(newCart, null, 2), (error)=>{
        if(error){
            console.error(error);
            return res.status(500).json({error: 'Error interno en el servidor'})
        }
        carts.push(newCart) //Agregamos la nueva cart.
        res.status(200).json({message: 'Carrito cargado'})
    })
//
})

//En router.get buscamos el carrito con un "id" especifico.
router.get("/carts/:cid", (req,res)=>{
    const cartId = parseInt(req.params.cid) //Recibimos el cart id por parametro.
    const cart = carts.find((c => c.cid === cartId)) //Buscamos el cart con el id.
//
    fs.readFile('carrito.json', 'utf-8', (error)=>{
        if(error){
            console.error(error);
            return res.status(500).json({error: 'Error interno en el servidor'})
        }
//
        if (!cart) return res.status(404).json({ error: "No existe el carrito" });
        res.json(cart)
    })
})

//En router.post agregamos un producto al carrito asignado mediante su "id" y el producto con su respectivo "id".
router.post("/carts/:cid/products/:pid", (req,res)=>{

    const cartId = parseInt(req.params.cid) //Recibimos el cart id por parametro.
    const productId = parseInt(req.params.pid) //Recibimos el product id por parametro.
// 
fs.readFile('carrito.json', 'utf-8', (error)=>{

    if(error){
        console.error(error);
        return res.status(500).json({error: 'Error interno en el servidor'})
    }

    const cart = carts.find((c => c.cid === cartId)) //Buscamos el cart con el id.
    if (!cart) return res.status(404).json({ error: "No existe el carrito" });

    //const product = products.find((p => p.pid === productId)) //Buscamos el producto con el id.
    //if (!product) return res.status(404).json({ error: "No existe el producto" });
    fs.writeFile('carrito.json', JSON.stringify(carts, null, 2), (error)=>{

        if(error){
            console.error(error);
            return res.status(500).json({error: 'Error interno en el servidor'})
        }
    
        const cart = carts.find((c => c.cid === cartId)) //Buscamos el cart con el id.
    
        const productInCart = {product: productId}
        if(productInCart) {
            productInCart.quantity += 1 //Le agregas el valor quantity y lo concatenas.
        } else {
            cart.productId.push({pid: productId, quantity: 1}) //Si no existe, lo agregamos al carrito.
        }
        res.status(200).json({message: 'Producto cargado al carrito'})
    })
}) //Leemos el archivo "carrito.json" y agregamos el producto con su "id".
})

//Exportamos la informacion.
export default router