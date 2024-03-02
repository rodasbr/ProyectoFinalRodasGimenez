
const traerDatos = async () => {
    const response = await fetch("./datos/data.json");
    const productos = await response.json();

    const productosContainer = document.getElementById("productos");

    productos.forEach(item => {
        let div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = `
            <img src="${item.imagen}" alt="${item.nombre}">
            <div class="cardContenido">
            <h3 class="styleId">Id: ${item.id}</h3>
            <p class="styleNombre">Nombre: ${item.nombre}</p>
            <b class="stylePrecio"> Precio: $${item.precio}</b>
            <button class="styleBoton" id="boton${item.id}">Agregar</button>
            <button class="styleEliminar" id="botonEliminar${item.id}">Eliminar</button>
            `;
        productosContainer.appendChild(div);

        let boton = document.getElementById(`boton${item.id}`);
        boton.addEventListener("click", () => agregar(item.id));

        let botonEliminar = document.getElementById(`botonEliminar${item.id}`);
        botonEliminar.addEventListener("click", () => eliminar(item.id));
        ;

        const agregar = (id) => {
            let producto = productos.find((item) => item.id === id);
            carrito.push(producto);
            console.log(carrito);
            guardarEnStorage();
            actualizarCarrito();
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Usted agrego su producto con exito",
                showConfirmButton: false,
                timer: 1500
            });
        };

        const eliminar = (id) => {
            let index = carrito.findIndex((item) => item.id === id);
            if (index !== -1) {
                carrito.splice(index, 1);
                console.log(carrito);
                guardarEnStorage();
                actualizarCarrito();
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Usted elimino su producto con exito",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire({
                    text: "producto no encontrado en el carrito!",
                    icon: "question"
                });
            }
        };

        const actualizarCarrito = () => {
            // Actualizar carrito aquí
        };
    });
};

traerDatos();

const carrito = [];

// guardar el carrito 
const guardarEnStorage = () => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
};

// Traer carrito
let carritoStorage = localStorage.getItem("carrito");
if (carritoStorage) {
    carrito.push(...JSON.parse(carritoStorage));
}


// vaciar el carrito
let vaciar = document.getElementById("vaciar");
vaciar.addEventListener("click", () => {
    carrito.length = 0;
    guardarEnStorage();
    Swal.fire({
        title: "Desea eliminar su carrito?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, borrar!"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Eliminado",
                icon: "success"
            });
        }
    });
});

// calcular el envío
const envio = (precioProducto) => {
    const sumaEnvio = 0.15;
    return precioProducto * sumaEnvio;
};
//total del carrito
const totalCompra = () => {
    return carrito.reduce((acumulador, producto) => acumulador + producto.precio, 0);
};

// alertas en forma de notificacion
const notificacion = (message) => {
    const messageElement = document.createElement("div");
    messageElement.textContent = message;
    messageElement.classList.add("notificacionEmergente");
    document.body.appendChild(messageElement);

    setTimeout(() => {
        document.body.removeChild(messageElement);
    }, 5000);
};
// Botón para mostrar el total de la compra en notificacion
let verTotal = document.getElementById("verTotal");
verTotal.addEventListener("click", () => {

    let totalCarrito = totalCompra();

    //alerta del total de la compra
    Swal.fire({
        text: (`El precio total de la compra es de: $${totalCarrito}`),
        icon: "success"
    });
});
// boton para calcular envio
let calcularEnvioBtn = document.getElementById("calcularEnvioBtn");
calcularEnvioBtn.addEventListener("click", () => {

    let precioProducto = parseFloat(document.getElementById("calcularEnvio").value);

    let finalPrecio = envio(precioProducto);

    // notificaciones de precio final o error
    if (!isNaN(finalPrecio)) {
        Swal.fire(`Su valor adicional de envío es de: $${finalPrecio}`);
    } else {
        Swal.fire("indique el precio de su compra");
    }
});

// boton ver carrito
document.addEventListener("DOMContentLoaded", function () {

    // botón "verCarrito" 
    let verCarritoBtn = document.getElementById("verCarrito");
    verCarritoBtn.addEventListener("click", () => {
        // Muestra los nombres de los productos 
        mostrarNombresProductos();
    });
    const mostrarNombresProductos = () => {

        if (carrito.length === 0) {
            //notificacion("El carrito está vacío");
            Swal.fire("Su carrito esta vacío");
        }
        else {

            const listaProductos = carrito.map((producto, index) => `${index + 1}. ${producto.nombre}`).join("\n");
            Swal.fire(`Productos en el carrito:\n${listaProductos}`);
        }
    };
});
