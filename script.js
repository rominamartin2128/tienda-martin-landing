// ---------------------------
// Firebase Configuration
// ---------------------------
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

// ---------------------------
// EmailJS Initialization
// ---------------------------
emailjs.init("LnLdxuoHCqcG4Fdoj"); // Public Key

// ---------------------------
// Variables
// ---------------------------
let productos = [];
let carrito = [];

// ---------------------------
// Login / Registro Firebase
// ---------------------------
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const btnLogin = document.getElementById("btnLogin");
const btnRegister = document.getElementById("btnRegister");

btnRegister.addEventListener("click", () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  auth.createUserWithEmailAndPassword(email, password)
      .then(userCredential => alert("Cuenta creada!"))
      .catch(err => alert(err.message));
});

btnLogin.addEventListener("click", () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  auth.signInWithEmailAndPassword(email, password)
      .then(userCredential => alert("Login exitoso!"))
      .catch(err => alert(err.message));
});

// ---------------------------
// Cargar JSON de productos
// ---------------------------
fetch('productos.json')
  .then(response => response.json())
  .then(data => {
    productos = data;
    mostrarCatalogo();
    cargarCarrito();
  });

// ---------------------------
// Mostrar catálogo
// ---------------------------
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

// ---------------------------
// Carrito
// ---------------------------
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
  if(carritoGuardado) {
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
    div.textContent = `${producto.n

