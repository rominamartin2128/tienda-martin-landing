// Traemos los productos desde el JSON
fetch("productos.json")
  .then(response => response.json())
  .then(productos => {
    const catalogo = document.getElementById("catalogo");

    productos.forEach(producto => {
      const productoDiv = document.createElement("div");
      productoDiv.classList.add("producto"); // Clase coherente con CSS

      // Solo generamos HTML, NO ponemos estilos inline
      productoDiv.innerHTML = `
        <img src="${producto.img}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p>$${producto.precio}</p>
        <button>Agregar al carrito</button>
        <div class="descripcion">
          <button>Ver descripción</button>
          <div class="desc-text" style="display:none;">
            ${producto.descripcion.join("<br>")}
          </div>
        </div>
      `;

      catalogo.appendChild(productoDiv);
    });

    // Funcionalidad desplegable para las descripciones
    const botonesDesc = document.querySelectorAll(".descripcion button");
    botonesDesc.forEach(btn => {
      btn.addEventListener("click", () => {
        const desc = btn.nextElementSibling;
        desc.style.display = desc.style.display === "none" ? "block" : "none";
      });
    });
  })
  .catch(error => console.error("Error cargando productos:", error));



