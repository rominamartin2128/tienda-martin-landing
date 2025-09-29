// ------------------ FIREBASE LOGIN ------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

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
    .then(() => console.log("Login exitoso"))
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

// ------------------ CARRITO Y CATÁLOGO ------------------
let carrito = [];
const carritoCount = document.getElementById("cart-count");

document.addEventListener("DOMContentLoaded", () => {
  const catalogo = document.getElementById("catalogo");

  // ------------------ CARGAR PRODUCTOS DESDE JSON ------------------
  fetch("https://rominamartin2128.github.io/tienda-martin-landing/productos.json")
    .then(res => res.json())
    .then(productos => {
      productos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");

        // HTML del producto con desplegable
        div.innerHTML = `
          <img src="${producto.imagen}" alt="${producto.nombre}">
          <h3>${producto.nombre}</h3>

          <button class="toggle-desc">Mostrar descripción ▼</button>
          <ul class="descripcion" style="display:none;">
            ${producto.descripcion.map(d => `<li>${d}</li>`).join("")}
          </ul>

          <p class="precio">$${producto.precio.toLocaleString()}</p>
          <button>Agregar al carrito</button>
        `;

        // Evento desplegable
        const toggleBtn = div.querySelector(".toggle-desc");
        const desc = div.querySelector(".descripcion");
        toggleBtn.addEventListener("click", () => {
          if (desc.style.display === "none") {
            desc.style.display = "block";
            toggleBtn.textContent = "Ocultar descripción ▲";
          } else {
            desc.style.display = "none";
            toggleBtn.textContent = "Mostrar descripción ▼";
          }
        });

        // Evento botón agregar al carrito
        div.querySelector("button:last-of-type").addEventListener("click", () => {
          carrito.push(producto);
          carritoCount.textContent = carrito.length;
          alert(`${producto.nombre} agregado al carrito`);
        });

        catalogo.appendChild(div);
      });
    })
    .catch(err => console.error("Error al cargar productos:", err));

  // ------------------ MENÚ HAMBURGUESA ------------------
  const toggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".navbar .menu");
  toggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
  });
});

