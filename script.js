// ===== Variables carrito =====
let carrito = [];
let productos = [];

// ===== Cargar JSON productos =====
fetch('./productos.json')
  .then(res => {
    if (!res.ok) throw new Error('No se pudo cargar productos.json');
    return res.json();
  })
  .then(data => {
    productos = data;
    mostrarCatalogo();
    cargarCarrito();
  })
  .catch(err => console.error('Error cargando productos:', err));

// ===== Mostrar catálogo =====
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

// ===== Carrito =====
function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  carrito.push(producto);
  guardarCarrito();
  mostrarCarrito();
}

function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarrito() {
  const carritoGuardado = JSON.parse(localStorage.getItem('carrito'));
  if (carritoGuardado) {
    carrito = carritoGuardado;
    mostrarCarrito();
  }
}

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


