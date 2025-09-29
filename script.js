// ===================== CATALOGO =====================
async function cargarProductos() {
  try {
    const response = await fetch("productos.json");
    const productos = await response.json();

    const contenedor = document.getElementById("productosContainer");
    contenedor.innerHTML = "";

    productos.forEach((prod) => {
      const card = document.createElement("div");
      card.classList.add("product-card");

      // Crear lista de descripciones
      let descHTML = "";
      if (prod.descripcion && prod.descripcion.length > 0) {
        descHTML = `
          <div class="descripcion">
            <button class="toggle-desc">Ver más</button>
            <ul class="desc-text" style="display:none;">
              ${prod.descripcion.map((d) => `<li>${d}</li>`).join("")}
            </ul>
          </div>
        `;
      }

      card.innerHTML = `
        <img src="${prod.imagen}" alt="${prod.nombre}" />
        <h3>${prod.nombre}</h3>
        <p class="precio">$${prod.precio}</p>
        ${descHTML}
        <button class="btnAgregar" data-id="${prod.id}" data-nombre="${prod.nombre}" data-precio="${prod.precio}">
          Agregar al carrito
        </button>
      `;

      contenedor.appendChild(card);
    });

    // Botones agregar al carrito
    document.querySelectorAll(".btnAgregar").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const nombre = btn.dataset.nombre;
        const precio = parseFloat(btn.dataset.precio);
        agregarAlCarrito(id, nombre, precio);
      });
    });

    // Botones ver más / ver menos
    document.querySelectorAll(".toggle-desc").forEach((btn) => {
      btn.addEventListener("click", () => {
        const descText = btn.nextElementSibling;
        if (descText.style.display === "none") {
          descText.style.display = "block";
          btn.textContent = "Ver menos";
        } else {
          descText.style.display = "none";
          btn.textContent = "Ver más";
        }
      });
    });
  } catch (err) {
    console.error("Error cargando productos:", err);
  }
}
cargarProductos();

// ===================== CARRITO =====================
let carrito = [];

function agregarAlCarrito(id, nombre, precio) {
  carrito.push({ id, nombre, precio });
  mostrarCarrito();
}

function mostrarCarrito() {
  const lista = document.getElementById("carritoLista");
  const total = document.getElementById("carritoTotal");
  lista.innerHTML = "";

  let suma = 0;
  carrito.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.nombre} - $${item.precio}`;
    lista.appendChild(li);
    suma += item.precio;
  });

  total.textContent = `Total: $${suma}`;
}



