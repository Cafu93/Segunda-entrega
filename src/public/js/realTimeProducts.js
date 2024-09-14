//Llamamos a socket.
const socket = io()

let lista = document.getElementById('lista')

socket.on('lista-productos', data=>{

    let pro = document.getElementById("lista-productos")
    let productos = ""
    console.log("productos", productos)
    data.forEach(producto => {
        productos = productos + `${producto.title}` + `${producto.price}` + `${producto.description}`
    })
    pro.innerHTML = productos
})

