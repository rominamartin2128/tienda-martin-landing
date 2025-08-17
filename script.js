let carrito = [];

// Cargar JSON de productos
fetch('productos.json')
  .then(response => response.json())
  .then(data => {
    productos = data;
    mostrarCatalogo();
    cargarCarrito();
  });

// Mostrar productos en el catálogo
function mostrarCatalogo() {
  const catalogo = document.getElementById('catalogo');
  catalogo.innerHTML = '';
  productos.forEach(producto => {
    const div = document.createElement('div');
    div.classList.add('producto');
    div.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p>Precio: $${producto.precio}</p>
      <button onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
      <details>
        <summary>Ver descripción</summary>
        <ul>${producto.descripcion.map(p => `<li>${p}</li>`).join('')}</ul>
      </details>
    `;
    catalogo.appendChild(div);
  });
}

// Agregar producto al carrito
function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  carrito.push(producto);
  guardarCarrito();
  mostrarCarrito();
}

// Guardar carrito en localStorage
function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Cargar carrito desde localStorage
function cargarCarrito() {
  const carritoGuardado = JSON.parse(localStorage.getItem('carrito'));
  if(carritoGuardado) {
    carrito = carritoGuardado;
    mostrarCarrito();
  }
}

// Mostrar carrito
function mostrarCarrito() {
  const items = document.getElementById('itemsCarrito');
  items.innerHTML = '';
  let total = 0;
  carrito.forEach((producto, index) => {
    const div = document.createElement('div');
    div.textContent = `${producto.nombre} - $${producto.precio}`;
    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.onclick = () => {
      carrito.splice(index, 1);
      guardarCarrito();
      mostrarCarrito();
    };
    div.appendChild(btnEliminar);
    items.appendChild(div);
    total += producto.precio;
  });
  document.getElementById('totalCarrito').textContent = total;
}

// Finalizar compra (solo simulación)
document.getElementById('btnFinalizarCompra').addEventListener('click', () => {
  if(carrito.length === 0) {
    alert('El carrito está vacío');
    return;
  }
  alert('Compra finalizada. Próximamente se enviará un correo y se integrará la pasarela de pago.');
  carrito = [];
  guardarCarrito();
  mostrarCarrito();
});


