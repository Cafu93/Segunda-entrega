//Importamos
import express, {json, urlencoded} from "express"
import cartsRouter from './routes/carrito.router.js'
import productsRouter from './routes/productos.router.js'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import { Server } from "socket.io" //Este server se creara a partir de nuestro server HTTP.

const app = express()
const PORT = 8080

app.use(json())
app.use(urlencoded({ extended: true }))

//Realizamos la configuracion de los handlebars.
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views') //Llamamos la ruta de vistas ("views").
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public')) //Utilizamos los archivos estaticos q estan en la ruta "/public".

//Usamos los archivos creados.
app.use("/api", productsRouter)
app.use("/api", cartsRouter)

//Le implementamos nuestro server.
const httpServer = app.listen(PORT, () => {
    console.log(`Server funcionando en el puerto ${PORT}`)
})

//Establecemos la comunicacion con el servidor y proximamente con un cliente.
const socketServer = new Server(httpServer)

let productos = []

//".on" hacemos referencia a un evento. 
//"connection" es un nombre donde nos da la comunicacion.
socketServer.on('connection', socketServer => {
    console.log("Nuevo cliente conectado")

    socketServer.on('producto', data => {
        productos.push(data)
        socketServer.emit('lista-productos', productos)
    })
})