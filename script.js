// script.js — versión completa con carrito funcional

document.addEventListener("DOMContentLoaded", () => {
  // Encontrar contenedor de productos (como antes)
  const posiblesIds = [
    "productosContainer",
    "catalogoContainer",
    "catalogo",
    "productos-container",
    "catalogo-container"
  ];
  let contenedor = null;
  for (const id of posiblesIds) {
    contenedor = document.getElementById(id);
    if (contenedor) {
      console.log("[script.js] contenedor encontrado:", id);
      break;
    }
  }
  if (!contenedor) {
    console.error("[script.js] No se encontró contenedor de productos");
    return;
  }

  // Carrito como array de objetos
  let carrito = [];

  // Función para actualizar la UI del carrito
  function actualizarCarritoUI() {
    const carritoLista = document.getElementById("carritoLista");
    const carritoTotal = document.getElementById("carritoTotal");
    const cartCount = document.getElementById("cart-count");

    if (!carritoLista || !carritoTotal || !cartCount) {
      console.warn("Elementos del carrito no encontrados en el DOM");
      return;
    }

    // Vaciar lista
    carritoLista.innerHTML = "";
    let total = 0;

    carrito.forEach((producto, idx) => {
      const li = document.createElement("li");
      li.textContent = `${producto.nombre} - $${producto.precio}`;
      carritoLista.appendChild(li);
      total += Number(producto.precio) || 0;
    });

    carritoTotal.textContent = `Total: $${total}`;
    cartCount.textContent = carrito.length;
  }

  // Función para cargar productos desde JSON y renderizarlos
  function cargarProductos() {
    fetch("productos.json")
      .then(res => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(productos => {
        contenedor.innerHTML = ""; // limpiar contenedor
        productos.forEach((producto, idx) => {
          const card = document.createElement("div");
          card.classList.add("producto");

          // Imagen
          const srcImg = producto.imagen || producto.img || producto.image || "";
          const img = document.createElement("img");
          img.alt = producto.nombre || "Producto";
          img.src = srcImg;

          // Nombre
          const h3 = document.createElement("h3");
          h3.textContent = producto.nombre;

          // Precio
          const pPrecio = document.createElement("p");
          pPrecio.classList.add("precio");
          pPrecio.textContent = producto.precio !== undefined ? `$${producto.precio}` : "";

          // Botón toggle descripción
          const btnToggle = document.createElement("button");
          btnToggle.classList.add("toggle-desc");
          btnToggle.textContent = "Ver más";

          // Descripción
          let descTexto = "";
          if (Array.isArray(producto.descripcion)) {
            descTexto = producto.descripcion.join("\n");
          } else {
            descTexto = producto.descripcion || "";
          }
          const pDesc = document.createElement("p");
          pDesc.classList.add("descripcion", "oculto");
          // convertir saltos de línea a <br>
          pDesc.innerHTML = descTexto
            .split("\n")
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .join("<br>");

          // Botón de agregar al carrito
          const btnAgregar = document.createElement("button");
          btnAgregar.classList.add("agregar-carrito");
          btnAgregar.textContent = "Agregar al carrito";

          // Armado de la tarjeta
          card.appendChild(img);
          card.appendChild(h3);
          card.appendChild(pPrecio);
          card.appendChild(btnToggle);
          card.appendChild(pDesc);
          card.appendChild(btnAgregar);

          // Eventos
          btnToggle.addEventListener("click", () => {
            if (pDesc.classList.contains("oculto")) {
              pDesc.classList.remove("oculto");
              btnToggle.textContent = "Ver menos";
            } else {
              pDesc.classList.add("oculto");
              btnToggle.textContent = "Ver más";
            }
          });

          btnAgregar.addEventListener("click", () => {
            // Agregar al carrito
            carrito.push(producto);
            actualizarCarritoUI();
          });

          contenedor.appendChild(card);
        });

        // Inicializar la UI del carrito vacía
        actualizarCarritoUI();
      })
      .catch(error => {
        console.error("Error cargando productos:", error);
        contenedor.innerHTML =
          "<p style='color:red'>No se pudieron cargar los productos.</p>";
      });
  }

  // Cargar productos al inicio
  cargarProductos();
});




