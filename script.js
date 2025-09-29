// ------------------ CARRITO ------------------
let carrito = [];

function actualizarCarrito() {
  const itemsCarrito = document.getElementById("itemsCarrito");
  const totalCarrito = document.getElementById("totalCarrito");
  const cartCount = document.getElementById("cart-count");

  itemsCarrito.innerHTML = "";
  let total = 0;

  carrito.forEach((producto, index) => {
    const div = document.createElement("div");
    div.classList.add("item-carrito");

    div.innerHTML = `
      <p>${producto.nombre} - $${producto.precio.toLocaleString()}</p>
      <button class="btnEliminar" data-index="${index}">❌</button>
    `;

    itemsCarrito.appendChild(div);
    total += producto.precio;
  });

  totalCarrito.textContent = total.toLocaleString();
  cartCount.textContent = carrito.length;

  // Botón eliminar
  document.querySelectorAll(".btnEliminar").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      carrito.splice(index, 1);
      actualizarCarrito();
    });
  });
}

// ------------------ CATALOGO ------------------
document.addEventListener("DOMContentLoaded", () => {
  const catalogo = document.getElementById("catalogo");

  fetch("productos.json")
    .then(res => res.json())
    .then(productos => {
      productos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");

        div.innerHTML = `
          <img src="${producto.imagen}" alt="${producto.nombre}">
          <h3>${producto.nombre}</h3>
          <p class="precio">$${producto.precio.toLocaleString()}</p>
          <button class="btnAgregar">Agregar al carrito</button>
        `;

        const btn = div.querySelector(".btnAgregar");
        btn.addEventListener("click", () => {
          carrito.push(producto);
          actualizarCarrito();
          alert(`${producto.nombre} agregado al carrito`);
        });

        catalogo.appendChild(div);
      });
    })
    .catch(err => console.error("Error cargando productos:", err));
});

// ------------------ EMAILJS ORDEN DE COMPRA ------------------
document.getElementById("btnFinalizarCompra").addEventListener("click", () => {
  if (carrito.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  let lista = carrito.map(p => `- ${p.nombre} ($${p.precio})`).join("\n");
  let total = carrito.reduce((acc, p) => acc + p.precio, 0);

  const templateParams = {
    usuario: document.getElementById("userDisplay").textContent || "Invitado",
    pedido: lista,
    total: `$${total.toLocaleString()}`
  };

  emailjs.send("service_5ro55v9", "template_k4zk30a", templateParams, "bIjrBOVKEdjncZDpG")
    .then(() => {
      alert("✅ Orden enviada por correo!");
      carrito = [];
      actualizarCarrito();
    })
    .catch(err => {
      console.error("Error enviando correo:", err);
      alert("❌ Error al enviar la orden");
    });
});


