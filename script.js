// ===================== CATALOGO =====================
async function cargarProductos() {
  try {
    const response = await fetch("productos.json");
    const productos = await response.json();

    const contenedor = document.getElementById("productosContainer");
    contenedor.innerHTML = "";

    productos.forEach((prod) => {
      const card = document.createElement("div");
      card.classList.add("product-card");

      card.innerHTML = `
        <img src="${prod.imagen}" alt="${prod.nombre}" />
        <h3>${prod.nombre}</h3>
        <p>$${prod.precio}</p>
        <button onclick="agregarAlCarrito(${prod.id}, '${prod.nombre}', ${prod.precio})">
          Agregar al carrito
        </button>
      `;
      contenedor.appendChild(card);
    });
  } catch (err) {
    console.error("Error cargando productos:", err);
  }
}
cargarProductos();

// ===================== CARRITO =====================
let carrito = [];

function agregarAlCarrito(id, nombre, precio) {
  carrito.push({ id, nombre, precio });
  mostrarCarrito();
}

function mostrarCarrito() {
  const lista = document.getElementById("carritoLista");
  const total = document.getElementById("carritoTotal");
  lista.innerHTML = "";

  let suma = 0;
  carrito.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.nombre} - $${item.precio}`;
    lista.appendChild(li);
    suma += item.precio;
  });

  total.textContent = `Total: $${suma}`;
}

// ===================== EMAILJS =====================
document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  emailjs
    .sendForm("service_5ro55v9", "template_k4zk30a", this)
    .then(() => {
      alert("Correo enviado con éxito ✅");
      this.reset();
    })
    .catch((err) => {
      alert("Error al enviar correo ❌");
      console.error("EmailJS error:", err);
    });
});

// ===================== FIREBASE AUTH =====================
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const auth = window.firebaseAuth;

const btnLogin = document.getElementById("btnLogin");
const btnRegister = document.getElementById("btnRegister");
const btnLogout = document.getElementById("btnLogout");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const userDisplay = document.getElementById("userDisplay");

// Registrar
btnRegister.addEventListener("click", async () => {
  try {
    await createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
    alert("Usuario registrado con éxito ✅");
  } catch (error) {
    alert("Error en registro: " + error.message);
  }
});

// Login
btnLogin.addEventListener("click", async () => {
  try {
    await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
    alert("Login exitoso 🎉");
  } catch (error) {
    alert("Error en login: " + error.message);
  }
});

// Logout
btnLogout.addEventListener("click", async () => {
  await signOut(auth);
});

// Detectar sesión
onAuthStateChanged(auth, (user) => {
  if (user) {
    userDisplay.textContent = `Hola, ${user.email}`;
    btnLogout.style.display = "inline-block";
    btnLogin.style.display = "none";
    btnRegister.style.display = "none";
  } else {
    userDisplay.textContent = "";
    btnLogout.style.display = "none";
    btnLogin.style.display = "inline-block";
    btnRegister.style.display = "inline-block";
  }
});


