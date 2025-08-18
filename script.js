// ===== Firebase Config =====
const firebaseConfig = {
  apiKey: "AIzaSyA1bik0TgeAcBNcCSSIJwVCSSylj8skhOc",
  authDomain: "tienda-martin.firebaseapp.com",
  projectId: "tienda-martin",
  storageBucket: "tienda-martin.appspot.com",
  messagingSenderId: "813249212381",
  appId: "1:813249212381:web:92472c9f06c029f7e79034"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// ===== EmailJS Init =====
emailjs.init("LnLdxuoHCqcG4Fdoj");

// ===== Variables carrito =====
let carrito = [];
let productos = [];

// ===== Cargar JSON productos =====
fetch('productos.json')
  .then(res => res.json())
  .then(data => {
    productos = data;
    mostrarCatalogo();
    cargarCarrito();
  });

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

  // Mostrar botón de pago solo si hay usuario logueado
  document.getElementById('btnPagar').style.display = (auth.currentUser && carrito.length) ? 'inline-block' : 'none';
}

// ===== Finalizar compra (simulación correo) =====
document.getElementById('btnFinalizarCompra').addEventListener('click', () => {
  if(carrito.length === 0){
    alert('El carrito está vacío');
    return;
  }
  if(!auth.currentUser){
    alert('Debes estar logueado para finalizar la compra');
    return;
  }
  enviarCorreoCompra();
});

function enviarCorreoCompra() {
  const templateParams = {
    user_email: auth.currentUser.email,
    items: carrito.map(p => p.nombre).join(", "),
    total: carrito.reduce((acc,p)=>acc+p.precio,0)
  };
  emailjs.send('service_sby0arr','template_zwt9vzb', templateParams)
    .then(() => alert('Orden enviada por correo!'))
    .catch(err => alert('Error enviando correo: '+err));
}

// ===== Firebase Auth =====
const emailInput = document.getElementById('email');
const passInput = document.getElementById('password');
const btnLogin = document.getElementById('btnLogin');
const btnRegister = document.getElementById('btnRegister');
const btnLogout = document.getElementById('btnLogout');
const userDisplay = document.getElementById('userDisplay');

btnRegister.onclick = () => {
  auth.createUserWithEmailAndPassword(emailInput.value, passInput.value)
    .then(user => {
      alert('Usuario registrado!');
      actualizarUI(user.user);
    })
    .catch(err => alert(err.message));
};

btnLogin.onclick = () => {
  auth.signInWithEmailAndPassword(emailInput.value, passInput.value)
    .then(user => actualizarUI(user.user))
    .catch(err => alert(err.message));
};

btnLogout.onclick = () => {
  auth.signOut().then(() => actualizarUI(null));
};

auth.onAuthStateChanged(user => actualizarUI(user));

function actualizarUI(user){
  if(user){
    userDisplay.textContent = user.email;
    btnLogout.style.display = 'inline-block';
    btnLogin.style.display = btnRegister.style.display = 'none';
  } else {
    userDisplay.textContent = '';
    btnLogout.style.display = 'none';
    btnLogin.style.display = btnRegister.style.display = 'inline-block';
  }
  mostrarCarrito();
}

// ===== Botón de pago de ejemplo =====
document.getElementById('btnPagar').addEventListener('click', ()=>{
  alert('Aquí iría la integración real con Mercado Pago');
});


