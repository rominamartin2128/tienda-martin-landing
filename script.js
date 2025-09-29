const contenedor = document.getElementById("productosContainer");

// Cargar productos y renderizarlos
function cargarProductos() {
  fetch("productos.json")
    .then(res => res.json())
    .then(productos => {
      productos.forEach(producto => {
        const card = document.createElement("div");
        card.classList.add("producto");

        // Unir la descripción (que es array) en un string
        const descripcionTexto = Array.isArray(producto.descripcion)
          ? producto.descripcion.join(" • ")
          : producto.descripcion;

        card.innerHTML = `
          <img src="${producto.imagen}" alt="${producto.nombre}">
          <h3>${producto.nombre}</h3>
          <p class="precio">$${producto.precio}</p>
          <button class="toggle-desc">Ver más</button>
          <p class="descripcion oculto">${descripcionTexto}</p>
          <button class="agregar-carrito">Agregar al carrito</button>
        `;

        // Botón para mostrar/ocultar la descripción
        const btnDesc = card.querySelector(".toggle-desc");
        const pDesc = card.querySelector(".descripcion");
        btnDesc.addEventListener("click", () => {
          if (pDesc.classList.contains("oculto")) {
            pDesc.classList.remove("oculto");
            btnDesc.textContent = "Ver menos";
          } else {
            pDesc.classList.add("oculto");
            btnDesc.textContent = "Ver más";
          }
        });

        // Botón para agregar al carrito (mantengo tu lógica previa)
        const btnCarrito = card.querySelector(".agregar-carrito");
        btnCarrito.addEventListener("click", () => {
          agregarAlCarrito(producto);
        });

        contenedor.appendChild(card);
      });
    })
    .catch(error => console.error("Error cargando productos:", error));
}

// Ejecutar al inicio
cargarProductos();


