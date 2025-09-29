let carrito = [];
const carritoCount = document.getElementById("cart-count");

document.addEventListener("DOMContentLoaded", () => {
  const catalogo = document.getElementById("catalogo");

  // ------------------ Productos de ejemplo ------------------
  const productos = [
    {
      nombre: "Producto 1",
      precio: 1200,
      imagen: "img/producto1.jpg",
      descripcion: ["Detalle 1", "Detalle 2"]
    },
    {
      nombre: "Producto 2",
      precio: 1500,
      imagen: "img/producto2.jpg",
      descripcion: ["Detalle A", "Detalle B"]
    },
    {
      nombre: "Producto 3",
      precio: 1800,
      imagen: "img/producto3.jpg",
      descripcion: ["Detalle X", "Detalle Y"]
    }
  ];

  productos.forEach(producto => {
    const div = document.createElement("div");
    div.classList.add("producto"); // importante

    div.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <ul>${producto.descripcion.map(d => `<li>${d}</li>`).join("")}</ul>
      <p class="precio">$${producto.precio.toLocaleString()}</p>
      <button>Agregar al carrito</button>
    `;

    div.querySelector("button").addEventListener("click", () => {
      carrito.push(producto);
      carritoCount.textContent = carrito.length;
      alert(`${producto.nombre} agregado al carrito`);
    });

    catalogo.appendChild(div);
  });

  // ------------------ Menú hamburguesa ------------------
  const toggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".navbar .menu");
  toggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
  });
});

