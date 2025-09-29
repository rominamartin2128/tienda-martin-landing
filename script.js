import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

// --- Firebase ---
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

// --- Login ---
const loginBtn = document.getElementById("btnLogin");
const registerBtn = document.getElementById("btnRegister");
const logoutBtn = document.getElementById("btnLogout");
const userDisplay = document.getElementById("userDisplay");

loginBtn.addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, password)
    .then(() => alert("Login exitoso"))
    .catch(err => alert(err.message));
});

registerBtn.addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  createUserWithEmailAndPassword(auth, email, password)
    .then(() => alert("Registro exitoso"))
    .catch(err => alert(err.message));
});

logoutBtn.addEventListener("click", () => signOut(auth));

onAuthStateChanged(auth, user => {
  if(user){
    userDisplay.textContent = `Hola, ${user.email}`;
    loginBtn.style.display = "none";
    registerBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
  } else {
    userDisplay.textContent = "";
    loginBtn.style.display = "inline-block";
    registerBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
  }
});

// --- Carrito ---
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const catalogoDiv = document.getElementById("catalogo");
const itemsCarrito = document.getElementById("itemsCarrito");
const totalCarrito = document.getElementById("totalCarrito");

function actualizarCarrito() {
  itemsCarrito.innerHTML = "";
  let total = 0;
  carrito.forEach((p, idx) => {
    total += p.precio;
    const div = document.createElement("div");
    div.textContent = `${p.nombre} - $${p.precio}`;
    const btnRemove = document.createElement("button");
    btnRemove.textContent = "Eliminar";
    btnRemove.addEventListener("click", () => {
      carrito.splice(idx,1);
      localStorage.setItem("carrito", JSON.stringify(carrito));
      actualizarCarrito();
    });
    div.appendChild(btnRemove);
    itemsCarrito.appendChild(div);
  });
  totalCarrito.textContent = total;
  document.getElementById("cart-count").textContent = carrito.length;
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// --- Cargar productos desde JSON ---
fetch("productos.json")
  .then(res => res.json())
  .then(productos => {
    productos.forEach(producto => {
      const div = document.createElement("div");
      div.classList.add("producto");
      div.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <button class="toggle-desc">Mostrar descripción ▼</button>
        <ul>${producto.descripcion.map(d => `<li>${d}</li>`).join("")}</ul>
        <p class="precio">$${producto.precio}</p>
        <button class="add-cart">Agregar al carrito</button>
      `;
      // Desplegar descripción
      const toggleBtn = div.querySelector(".toggle-desc");
      const ul = div.querySelector("ul");
      toggleBtn.addEventListener("click", () => {
        if(ul.style.display === "block"){
          ul.style.display = "none";
          toggleBtn.textContent = "Mostrar descripción ▼";
        } else {
          ul.style.display = "block";
          toggleBtn.textContent = "Ocultar descripción ▲";
        }
      });
      // Agregar al carrito
      div.querySelector(".add-cart").addEventListener("click", () => {
        carrito.push(producto);
        actualizarCarrito();
        alert(`${producto.nombre} agregado al carrito`);
      });
      catalogoDiv.appendChild(div);
    });
  });

// --- Menu hamburguesa ---
const toggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".navbar nav ul");
toggle.addEventListener("click", ()=> navMenu.classList.toggle("open"));

// --- Finalizar compra / EmailJS ---
document.getElementById("btnFinalizarCompra").addEventListener("click", () => {
  if(carrito.length === 0) return alert("El carrito está vacío");
  if(!auth.currentUser) return alert("Debes iniciar sesión para finalizar la compra");
  
  // EmailJS (suponiendo que ya creaste el servicio y plantilla)
  emailjs.send("TU_SERVICE_ID","TU_TEMPLATE_ID", {
    usuario: auth.currentUser.email,
    productos: carrito.map(p=>p.nombre).join(", "),
    total: totalCarrito.textContent
  }).then(() => alert("Orden enviada por correo!"))
    .catch(err => alert("Error al enviar correo: "+err));
  
  // Mostrar botón Mercado Pago
  document.getElementById("btnPagar").style.display = "inline-block";
});

