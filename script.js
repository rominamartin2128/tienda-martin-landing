// ------------------ IMPORTS ------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import emailjs from "https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js";

// ------------------ FIREBASE LOGIN ------------------
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_BUCKET",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginBtn = document.getElementById("btnLogin");
const logoutBtn = document.getElementById("btnLogout");
const userDisplay = document.getElementById("userDisplay");

loginBtn.addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, password)
    .then(() => alert("Login exitoso"))
    .catch(err => alert("Error de login: " + err.message));
});

logoutBtn.addEventListener("click", () => signOut(auth));

onAuthStateChanged(auth, (user) => {
  if (user) {
    userDisplay.textContent = `Hola, ${user.email}`;
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
  } else {
    userDisplay.textContent = "";
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
  }
});

// ------------------ EMAILJS ------------------
emailjs.init("TU_PUBLIC_KEY"); // Public key de EmailJS

// ------------------ CARRITO Y CATÁLOGO ------------------
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

// ------------------ FINALIZAR COMPRA ------------------
document.getElementById("btnFinalizarCompra").addEventListener("click", () => {
  if (carrito.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  const lista = carrito.map(p => `${p.nombre} - $${p.precio.toLocaleString()}`).join("\n");
  const total = carrito.reduce((sum, p) => sum + p.precio, 0);

  // Enviar correo con EmailJS
  const templateParams = {
    usuario: userDisplay.textContent || "Invitado",
    pedido: lista,
    total: `$${total.toLocaleString()}`
  };

  emailjs.send("service_sby0arr", "template_onftb26", templateParams)
    .then(() => alert("Orden enviada por correo!"))
    .catch(err => alert("Error enviando correo: " + err));
});

// ------------------ MENU HAMBURGUESA ------------------
const toggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".navbar ul");

toggle.addEventListener("click", () => {
  navMenu.classList.toggle("open");
});

