import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// --- Firebase config ---
const firebaseConfig = {
  apiKey: "AIzaSyA1bik0TgeAcBNcCSSIJwVCSSylj8skhOc",
  authDomain: "tienda-martin.firebaseapp.com",
  projectId: "tienda-martin",
  storageBucket: "tienda-martin.appspot.com",
  messagingSenderId: "813249212381",
  appId: "1:813249212381:web:92472c9f06c029f7e79034"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// --- Variables ---
let productos = [];
let carrito = [];

// --- Elementos ---
const catalogo = document.getElementById('catalogo');
const itemsCarrito = document.getElementById('itemsCarrito');
const totalCarrito = document.getElementById('totalCarrito');

const btnRegistro = document.getElementById('btnRegistro');
const btnLogin = document.getElementById('btnLogin');
const btnLogout = document.getElementById('btnLogout');
const btnFinalizarCompra = document.getElementById('btnFinalizarCompra');
const btnPagar = document.getElementById('btnPagar');

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// --- Cargar JSON de productos ---
fetch('productos.json')
  .then(res => res.json())
  .then(data => { productos = data; mostrarCatalogo(); cargarCarrito(); });

// --- Funciones carrito ---
function mostrarCatalogo() {
  catalogo.innerHTML = '';
  productos.forEach(p => {
    const div = document.createElement('div');
    div.classList.add('producto');
    div.innerHTML = `
      <img src="${p.imagen}" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <p>Precio: $${p.precio}</p>
      <button onclick="agregarAlCarrito(${p.id})">Agregar al carrito</button>
      <details>
        <summary>Ver descripción</summary>
        <ul>${p.descripcion.map(d=>`<li>${d}</li>`).join('')}</ul>
      </details>
    `;
    catalogo.appendChild(div);
  });
}

window.agregarAlCarrito = function(id){
  const producto = productos.find(p => p.id === id);
  carrito.push(producto);
  guardarCarrito();
  mostrarCarrito();
}

function guardarCarrito(){ localStorage.setItem('carrito', JSON.stringify(carrito)); }
function cargarCarrito(){
  const c = JSON.parse(localStorage.getItem('carrito'));
  if(c){ carrito = c; mostrarCarrito(); }
}

function mostrarCarrito(){
  itemsCarrito.innerHTML = '';
  let total = 0;
  carrito.forEach((p,i)=>{
    const div = document.createElement('div');
    div.textContent = `${p.nombre} - $${p.precio}`;
    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.onclick = () => { carrito.splice(i,1); guardarCarrito(); mostrarCarrito(); };
    div.appendChild(btnEliminar);
    itemsCarrito.appendChild(div);
    total += p.precio;
  });
  totalCarrito.textContent = total;
}

// --- Firebase Auth ---
btnRegistro.onclick = async () => {
  try {
    await createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
    alert('Usuario registrado correctamente');
  } catch(e){ alert(e.message); }
}

btnLogin.onclick = async () => {
  try {
    await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
    alert('Login exitoso');
  } catch(e){ alert(e.message); }
}

btnLogout.onclick = () => { signOut(auth); }

// Detectar estado de sesión
onAuthStateChanged(auth, user => {
  if(user){
    btnLogin.style.display = 'none';
    btnRegistro.style.display = 'none';
    btnLogout.style.display = 'inline-block';
  } else {
    btnLogin.style.display = 'inline-block';
    btnRegistro.style.display = 'inline-block';
    btnLogout.style.display = 'none';
  }
});

// --- EmailJS ---
const EMAILJS_SERVICE_ID = "service_sby0arr";
const EMAILJS_TEMPLATE_ID = "template_zwt9vzb";

btnFinalizarCompra.onclick = () => {
  if(carrito.length === 0) return alert('El carrito está vacío');
  if(!auth.currentUser) return alert('Debes estar logueado para finalizar la compra');

  const email = auth.currentUser.email;
  const detalle = carrito.map(p=>`• ${p.nombre} - $${p.precio}`).join('\n');
  const total = carrito.reduce((acc,p)=>acc+p.precio,0);

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, { to_email: email, order_items: detalle, order_total: total })
    .then(()=> alert('Orden enviada por correo!'))
    .catch(err => console.error(err));

  carrito = [];
  guardarCarrito();
  mostrarCarrito();
}

// --- MercadoPago Sandbox ---
const MP_LINK = "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=TEST-5540731994144267-081720-43bb32666c0c868ef8c49f2377c7a124-392810133";

btnPagar.onclick = () => {
  if(carrito.length === 0) return alert('Agregá productos al carrito primero');
  window.location.href = MP_LINK;
}


