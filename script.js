// script.js — versión robusta, lista para pegar
document.addEventListener("DOMContentLoaded", () => {
  // Intento encontrar el contenedor con varios ids posibles
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
    console.error(
      "[script.js] No se encontró el contenedor de productos. Buscados ids:",
      posiblesIds.join(", ")
    );
    return;
  }

  // Cargar productos.json
  fetch("productos.json")
    .then((res) => {
      if (!res.ok) throw new Error("HTTP " + res.status + " - " + res.statusText);
      return res.json();
    })
    .then((productos) => {
      // limpiar contenedor por si hay contenido previo
      contenedor.innerHTML = "";

      if (!Array.isArray(productos) || productos.length === 0) {
        contenedor.innerHTML = "<p>No hay productos para mostrar.</p>";
        return;
      }

      productos.forEach((producto, index) => {
        const card = document.createElement("div");
        card.className = "producto";

        // determinar src de la imagen con soporte a varias claves
        const srcImg =
          producto.imagen ||
          producto.img ||
          producto.image ||
          producto.src ||
          producto.imagenes ||
          producto.picture ||
          "";

        const img = document.createElement("img");
        img.alt = producto.nombre || producto.title || "Producto";
        img.loading = "lazy";
        if (srcImg) {
          img.src = srcImg;
        } else {
          img.src = ""; // dejar en blanco pero visible si hay CSS de fallback
          console.warn(`[script.js] producto ${index} no tiene imagen:`, producto);
        }

        const h3 = document.createElement("h3");
        h3.textContent = producto.nombre || producto.title || "Sin nombre";

        const pPrecio = document.createElement("p");
        pPrecio.className = "precio";
        pPrecio.textContent =
          producto.precio !== undefined && producto.precio !== null
            ? `$${producto.precio}`
            : "";

        // botón toggle descripción
        const btnToggle = document.createElement("button");
        btnToggle.className = "toggle-desc";
        btnToggle.type = "button";
        btnToggle.textContent = "Ver más";

        // descripción: si es array lo uno, si es string lo uso
        let descripcionTexto = "";
        if (Array.isArray(producto.descripcion)) {
          // unir con saltos de línea
          descripcionTexto = producto.descripcion.join("\n");
        } else {
          descripcionTexto = producto.descripcion || "";
        }
        const pDesc = document.createElement("p");
        pDesc.className = "descripcion oculto";
        // convertimos saltos de línea a <br>
        pDesc.innerHTML = descripcionTexto
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .join("<br>");

        // botón agregar al carrito
        const btnAgregar = document.createElement("button");
        btnAgregar.className = "agregar-carrito";
        btnAgregar.type = "button";
        btnAgregar.textContent = "Agregar al carrito";

        // montar card
        card.appendChild(img);
        card.appendChild(h3);
        card.appendChild(pPrecio);
        card.appendChild(btnToggle);
        card.appendChild(pDesc);
        card.appendChild(btnAgregar);

        // listeners
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
          if (typeof window.agregarAlCarrito === "function") {
            try {
              window.agregarAlCarrito(producto);
            } catch (e) {
              console.error("Error en agregarAlCarrito:", e);
            }
          } else {
            console.log("agregarAlCarrito no definida — producto:", producto);
            // si querés, podés mostrar feedback visual pequeño aquí
          }
        });

        contenedor.appendChild(card);
      });
    })
    .catch((err) => {
      console.error("Error cargando productos.json:", err);
      // Mensaje visible en la página
      if (contenedor) {
        contenedor.innerHTML =
          "<p style='color:#c00'>Error cargando los productos. Mirá la consola para más info.</p>";
      }
    });
});



