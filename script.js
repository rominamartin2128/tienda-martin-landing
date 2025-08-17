// ======= CONFIGURACIÓN (REEMPLAZAR) =======
const FIREBASE_CONFIG = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_ID",
  appId: "TU_APP_ID"
};

// EmailJS: ya se inicializa en index.html con emailjs.init("EMAILJS_PUBLIC_KEY")
const EMAILJS_SERVICE_ID = "TU_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "TU_TEMPLATE_ID";

// Botón de pago de ejemplo (podés usar tu link de preferencia de MP/Stripe/PayPal)
const PAYMENT_LINK = "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=REEMPLAZAR_CON_TU_PREF_ID";

// ======= IMPORTS FIREBASE (CDN) =======
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ======= APP STATE =======
let carrito = [];
let productos = [];
let authUser = null;

// ======= INIT =======
const app = initializeApp(FIREBASE_CONFIG);
const auth = getAuth(app);

// DOM
const contenedor = document.getElementById('productosContainer');
const itemsCarrito = document.getElementById('itemsCarrito');
const totalCarrito = document.getElementById('totalCarrito');
const btnFinalizar = document.getElementById('btnFinalizarCompra');
const btnVaciar = document.getElementById('btnVaciar');
const btnPagar = document.getElementById('btnPagar');
const userInfo = document.getElementById('userInfo');
const btnLogout = document.getElementById('btnLogout');
const btnOpenLogin = document.getElementById('btnOpenLogin');
const btnOpenRegister = document.getElementById('btnOpenRegister');
const loginDialog = document.getElementById('loginDialog');
const registerDialog = document.getElementById('registerDialog');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');

document.addEventListener('DOMContentLoaded', async () => {
  // Cargar productos
  try {
    const res = await fetch('productos.json');
    productos = await res.json();
    renderCatalogo();
  } catch (e) {
    console.error('Error cargando productos.json', e);
  }

  // Cargar carrito guardado
  const saved = localStorage.getItem('carrito');
  carrito = saved ? JSON.parse(saved) : [];
  renderCarrito();
});

// ======= AUTH STATE =======
onAuthStateChanged(auth, (user) => {
  authUser = user || null;
  if (authUser) {
    userInfo.textContent = `Hola, ${authUser.email}`;
    btnLogout.style.display = 'inline-block';
    btnOpenLogin.style.display = 'none';
    btnOpenRegister.style.display = 'none';
  } else {
    userInfo.textContent = '';
    btnLogout.style.display = 'none';
    btnOpenLogin.style.display = 'inline-block';
    btnOpenRegister.style.display = 'inline-block';
  }
});

// ======= UI HANDLERS =======
btnOpenLogin?.addEventListener('click', () => loginDialog.showModal());
btnOpenRegister?.addEventListener('click', () => registerDialog.showModal());

loginBtn?.addEventListener('click', async () => {
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPassword').value.trim();
  try {
    await signInWithEmailAndPassword(auth, email, pass);
    loginDialog.close();
    alert('¡Bienvenido!');
  } catch (e) {
    alert(e.message);
  }
});

registerBtn?.addEventListener('click', async () => {
  const email = document.getElementById('registerEmail').value.trim();
  const pass = document.getElementById('registerPassword').value.trim();
  try {
    await createUserWithEmailAndPassword(auth, email, pass);
    registerDialog.close();
    alert('¡Cuenta creada! Ya podés iniciar sesión.');
  } catch (e) {
    alert(e.message);
  }
});

btnLogout?.addEventListener('click', async () => {
  await signOut(auth);
  alert('Sesión cerrada');
});

// ======= CATÁLOGO =======
function renderCatalogo() {
  if (!contenedor) return;
  contenedor.innerHTML = '';
  productos.forEach(p => {
    const card = document.createElement('div');
    card.className = 'producto';
    card.innerHTML = `
      <img src="${p.imagen}" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <p>$${p.precio}</p>
      <button class="btn primary" data-id="${p.id}">Agregar</button>
      <details>
        <summary>Ver descripción</summary>
        <ul>${p.descripcion.map(d => `<li>${d}</li>`).join('')}</ul>
      </details>
    `;
    contenedor.appendChild(card);
  });

  contenedor.querySelectorAll('button[data-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.getAttribute('data-id'));
      const prod = productos.find(x => x.id === id);
      if (prod) {
        carrito.push(prod);
        persistCarrito();
        renderCarrito();
      }
    });
  });
}

// ======= CARRITO =======
function renderCarrito() {
  if (!itemsCarrito || !totalCarrito) return;
  itemsCarrito.innerHTML = '';
  let total = 0;

  carrito.forEach((p, idx) => {
    total += p.precio;
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <span>${p.nombre} - $${p.precio}</span>
      <button class="btn danger" data-i="${idx}">Eliminar</button>
    `;
    itemsCarrito.appendChild(row);
  });

  itemsCarrito.querySelectorAll('button[data-i]').forEach(b => {
    b.addEventListener('click', () => {
      const i = Number(b.getAttribute('data-i'));
      carrito.splice(i, 1);
      persistCarrito();
      renderCarrito();
    });
  });

  totalCarrito.textContent = String(total);
}

btnVaciar?.addEventListener('click', () => {
  carrito = [];
  persistCarrito();
  renderCarrito();
});

// ======= FINALIZAR COMPRA =======
btnFinalizar?.addEventListener('click', async () => {
  if (carrito.length === 0) return alert('El carrito está vacío.');
  if (!authUser) return alert('Iniciá sesión para recibir el resumen por email.');

  try {
    await enviarOrdenPorEmail(authUser.email, carrito);
    alert('Orden enviada por email. Ahora podés proceder al pago.');
  } catch (e) {
    alert('No se pudo enviar el correo: ' + e);
  }
});

// ======= BOTÓN DE PAGO (EJEMPLO) =======
btnPagar?.addEventListener('click', () => {
  if (carrito.length === 0) return alert('Agregá productos antes de pagar.');
  // Redirige a tu checkout (MercadoPago / Stripe / PayPal)
  window.location.href = PAYMENT_LINK;
});

// ======= EMAILJS =======
function enviarOrdenPorEmail(toEmail, items) {
  const total = items.reduce((acc, p) => acc + p.precio, 0);
  const detalle = items.map(p => `• ${p.nombre} - $${p.precio}`).join('\n');

  const params = {
    to_email: toEmail,
    order_items: detalle,
    order_total: total,
    // podés sumar más campos que definiste en tu template
  };

  return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params);
}

// ======= STORAGE =======
function persistCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}


