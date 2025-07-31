let carrito = [];

document.addEventListener('DOMContentLoaded', () => {
  fetch('productos.json')
    .then(res => res.json())
    .then(data => mostrarProductos(data));

  document.getElementById('login-form').addEventListener('submit', e => {
    e.preventDefault();
    alert('Inicio de sesión simulado ✅');
  });

  document.getElementById('register-form').addEventListener('submit', e => {
    e.preventDefault();
    alert('Cuenta creada correctamente ✅');
  });

  document.getElementById('vaciar-carrito').addEventListener('click', () => {
    carrito = [];
    renderCarrito();
  });
});

function mostrarProductos(productos) {
  const contenedor = document.getElementById('productos-lista');
  productos.forEach(producto => {
    const div = document.createElement('div');
    div.classList.add('producto');
    div.innerHTML = `
      <img src=\"${producto.imagen}\" alt=\"${producto.nombre}\">
      <h3>${producto.nombre}</h3>
      <p>${producto.descripcion}</p>
      <button onclick='agregarAlCarrito(${JSON.stringify(producto)})'>Agregar al carrito</button>
    `;
    contenedor.appendChild(div);
  });
}

function agregarAlCarrito(producto) {
  carrito.push(producto);
  renderCarrito();
}

function renderCarrito() {
  const contenedor = document.getElementById('carrito-items');
  contenedor.innerHTML = '';
  carrito.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = `${item.nombre}`;
    contenedor.appendChild(li);
  });
  document.getElementById('carrito').classList.remove('oculto');
}

fetch('productos2.json')
  .then(res => res.json())
  .then(data => {
    const contenedor = document.getElementById('productos');
    if (!contenedor) return; // Para que no tire error si no está en esa página
    data.forEach(prod => {
      contenedor.innerHTML += `
        <div class="producto">
          <img src="${prod.imagen}" alt="${prod.nombre}">
          <h3>${prod.nombre}</h3>
          <p>${prod.descripcion}</p>
          <button class="btn-comprar" onclick="agregarAlCarrito('${prod.nombre}')">Comprar</button>
        </div>
      `;
    });
  });

function agregarAlCarrito(nombre) {
  alert(`Agregaste "${nombre}" al carrito`);
}
