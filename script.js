// script.js — versión diagnóstica y robusta para depurar y funcionar
document.addEventListener("DOMContentLoaded", () => {
  console.log("[script.js] iniciando...");

  // Buscamos el contenedor donde se deben poner los productos
  const posiblesIds = [
    "productosContainer",
    "catalogoContainer",
    "catalogo",
    "productos-container",
    "catalogo-container"
  ];
  let contenedor = null;
  let contenedorId = null;
  for (const id of posiblesIds) {
    const el = document.getElementById(id);
    if (el) {
      contenedor = el;
      contenedorId = id;
      console.log(`[script.js] contenedor encontrado: #${id}`);
      break;
    }
  }

  if (!contenedor) {
    const msg = `[script.js] ERROR: no se encontró ningún contenedor de productos. Buscados ids: ${posiblesIds.join(", ")}`;
    console.error(msg);
    // Mostrar mensaje visible en la página (si hay un <main>)
    const main = document.querySelector("main") || document.body;
    const aviso = document.createElement("div");
    aviso.style.color = "white";
    aviso.style.background = "#c00";
    aviso.style.padding = "12px";
    aviso.style.borderRadius = "6px";
    aviso.textContent = "Error interno: no se encontró el contenedor de productos. Mirá la consola para detalles.";
    main.prepend(aviso);
    return;
  }

  // Carrito
  let carrito = [];

  function actualizarCarritoUI() {
    const carritoLista = document.getElementById("carritoLista");
    const carritoTotal = document.getElementById("carritoTotal");
    const cartCount = document.getElementById("cart-count");

    if (!carritoLista || !carritoTotal || !cartCount) {
      console.warn("[script.js] Algunos elementos del carrito no se encuentran en el DOM (carritoLista/carritoTotal/cart-count).");
      return;
    }

    carritoLista.innerHTML = "";
    let total = 0;
    carrito.forEach((p, i) => {
      const li = document.createElement("li");
      li.textContent = `${p.nombre || p.title || "Sin nombre"} - $${p.precio || 0}`;
      carritoLista.appendChild(li);
      total += Number(p.precio) || 0;
    });

    carritoTotal.textContent = `Total: $${total}`;
    cartCount.textContent = carrito.length;
  }

  // Intentos de rutas donde puede estar productos.json
  const posiblesRutas = [
    "productos.json",
    "./productos.json",
    window.location.origin + window.location.pathname.replace(/\/[^/]*$/, "/") + "productos.json",
    window.location.origin + "/tienda-martin-landing/productos.json",
    "https://raw.githubusercontent.com/rominamartin2128/tienda-martin-landing/main/productos.json"
  ];

  async function intentarFetch() {
    let lastError = null;
    for (const ruta of posiblesRutas) {
      try {
        console.log(`[script.js] intentando fetch -> ${ruta}`);
        const res = await fetch(ruta, { cache: "no-store" });
        console.log(`[script.js] respuesta ${ruta}: status ${res.status}`);
        if (!res.ok) {
          lastError = `HTTP ${res.status} en ${ruta}`;
          continue;
        }
        const json = await res.json();
        console.log(`[script.js] JSON cargado desde ${ruta} (${Array.isArray(json) ? json.length : "no-array"})`);
        return json;
      } catch (err) {
        console.warn(`[script.js] fallo fetch ${ruta}:`, err);
        lastError = err;
        // continuar con la siguiente ruta
      }
    }
    throw new Error("No fue posible cargar productos.json. Último error: " + lastError);
  }

  function crearCard(producto) {
    const card = document.createElement("div");
    card.className = "producto";

    // imagen (soporte varias claves)
    const srcImg = producto.imagen || producto.img || producto.image || producto.src || "";
    const img = document.createElement("img");
    img.alt = producto.nombre || producto.title || "Producto";
    if (srcImg) img.src = srcImg;
    else img.src = ""; // dejar vacío si no hay ruta

    // nombre
    const h3 = document.createElement("h3");
    h3.textContent = producto.nombre || producto.title || "Sin nombre";

    // precio
    const pPrecio = document.createElement("p");
    pPrecio.className = "precio";
    pPrecio.textContent = producto.precio !== undefined ? `$${producto.precio}` : "";

    // descripción (array -> texto con saltos)
    let descTexto = "";
    if (Array.isArray(producto.descripcion)) descTexto = producto.descripcion.join("\n");
    else descTexto = producto.descripcion || "";

    const btnToggle = document.createElement("button");
    btnToggle.className = "toggle-desc";
    btnToggle.type = "button";
    btnToggle.textContent = "Ver más";

    const pDesc = document.createElement("p");
    pDesc.className = "descripcion oculto";
    pDesc.innerHTML = descTexto.split("\n").map(l => l.trim()).filter(Boolean).join("<br>");

    const btnAgregar = document.createElement("button");
    btnAgregar.className = "agregar-carrito";
    btnAgregar.type = "button";
    btnAgregar.textContent = "Agregar al carrito";

    // Append
    card.appendChild(img);
    card.appendChild(h3);
    card.appendChild(pPrecio);
    card.appendChild(btnToggle);
    card.appendChild(pDesc);
    card.appendChild(btnAgregar);

    // Listeners
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
      carrito.push(producto);
      actualizarCarritoUI();
    });

    return card;
  }

  // Cargar y renderizar productos
  (async () => {
    try {
      const productos = await intentarFetch();
      if (!Array.isArray(productos) || productos.length === 0) {
        contenedor.innerHTML = "<p>No hay productos para mostrar.</p>";
        console.warn("[script.js] productos vacío o no array:", productos);
        return;
      }

      // limpiar
      contenedor.innerHTML = "";
      productos.forEach(prod => {
        const card = crearCard(prod);
        contenedor.appendChild(card);
      });

      // inicializar carrito UI
      actualizarCarritoUI();
      console.log("[script.js] productos renderizados OK.");
    } catch (err) {
      console.error("[script.js] Error definitivo al cargar productos:", err);
      contenedor.innerHTML = `<p style="color:#c00">Error cargando productos. Mirá la consola (F12) para más detalles.</p>`;
    }
  })();
});




