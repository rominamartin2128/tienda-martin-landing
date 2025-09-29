let carrito = [];
const catalogo = document.getElementById("catalogo");
const carritoContainer = document.getElementById("itemsCarrito");
const totalDiv = document.getElementById("totalCarrito");

// Cargar productos desde JSON
fetch("./productos.json")
  .then(res => res.json())
  .then(productos => {
    productos.forEach(p => {
      const div = document.createElement("div");
      div.classList.add("producto");
      div.innerHTML = `
        <img src="${p.imagen}" alt="${p.nombre}">
        <h3>${p.nombre}</h3>
        <ul>${p.descripcion.map(d => `<li>${d}</li>`).join("")}</ul>
        <p class="precio">$${p.precio.toLocaleString()}</p>
        <button>Agregar al carrito</button>
      `;

      // Descripción plegable
      const ul = div.querySelector("ul");
      ul.style.display = "none";
      div.querySelector("h3").addEventListener("click", () => {
        ul.style.display = ul.style.display === "none" ? "block" : "none";
      });

      // Botón agregar al carrito
      div.querySelector("button").addEventListener("click", () => {
        carrito.push(p);
        actualizarCarrito();
      });

      catalogo.appendChild(div);
    });
  })
  .catch(err => console.error("Error cargando productos:", err));

function actualizarCarrito() {
  carritoContainer.innerHTML = "";
  carrito.forEach((p, index) => {
    const div = document.createElement("div");
    div.classList.add("carrito-item");
    div.innerHTML = `
      <span>${p.nombre} - $${p.precio.toLocaleString()}</span>
      <button data-index="${index}">Eliminar</button>
    `;
    div.querySelector("button").addEventListener("click", () => {
      carrito.splice(index, 1);
      actualizarCarrito();
    });
    carritoContainer.appendChild(div);
  });
  totalDiv.textContent = "Total: $" + carrito.reduce((sum, p) => sum + p.precio, 0).toLocaleString();
}

// Botón finalizar compra (solo alerta por ahora)
document.getElementById("btnFinalizarCompra").addEventListener("click", () => {
  if (carrito.length === 0) {
    alert("El carrito está vacío");
    return;
  }
  const lista = carrito.map(p => `${p.nombre} - $${p.precio.toLocaleString()}`).join("\n");
  const total = carrito.reduce((sum, p) => sum + p.precio, 0);
  alert(`Orden:\n${lista}\n\nTotal: $${total.toLocaleString()}\n\nAquí se podría integrar EmailJS o Mercado Pago.`);
});



