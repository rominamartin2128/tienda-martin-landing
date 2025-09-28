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

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
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

// ------------------ CARRITO ------------------
const carritoBtn = document.getElementById("carritoBtn");
const carritoCount = document.getElementById("carritoCount");
let carrito = [];

carritoBtn.addEventListener("click", () => {
  alert("Tu carrito tiene " + carrito.length + " productos.");
});

// ------------------ CARGAR PRODUCTOS ------------------
document.addEventListener("DOMContentLoaded", () => {
  const catalogo = document.getElementById("catalogo");

  fetch("productos.json")
    .then(response => response.json())
    .then(productos => {
      productos.forEach(producto => {
        const div = document.createElement("div");
        div.className = "producto";
        div.innerHTML = `
          <img src="${producto.imagen}" alt="${producto.nombre}">
          <h3>${producto.nombre}</h3>
          <p>${producto.descripcion}</p>
          <button>Agregar al carrito</button>
        `;
        catalogo.appendChild(div);

        // Agregar funcionalidad del botón al carrito
        div.querySelector("button").addEventListener("click", () => {
          carrito.push(producto);
          carritoCount.textContent = carrito.length;
          alert(`${producto.nombre} agregado al carrito`);
        });
      });
    })
    .catch(error => console.error("Error al cargar productos:", error));

  // ------------------ MENÚ HAMBURGUESA ------------------
  const toggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".navbar nav ul");

  toggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
  });
});


  if (toggle && navMenu) {
    toggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
    });
  }
});




