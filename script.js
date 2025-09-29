// ------------------ FIREBASE LOGIN ------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA1bik0TgeAcBNcCSSIJwVCSSylj8skhOc",
  authDomain: "tienda-martin.firebaseapp.com",
  projectId: "tienda-martin",
  storageBucket: "tienda-martin.firebasestorage.app",
  messagingSenderId: "813249212381",
  appId: "1:813249212381:web:92472c9f06c029f7e79034",
  measurementId: "G-MEEYZ95EG6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginBtn = document.getElementById("btnLogin");
const registerBtn = document.getElementById("btnRegister");
const logoutBtn = document.getElementById("btnLogout");
const userDisplay = document.getElementById("userDisplay");

loginBtn.addEventListener("click", ()=>{
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  signInWithEmailAndPassword(auth,email,password).catch(err=>alert(err.message));
});

registerBtn.addEventListener("click", ()=>{
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  createUserWithEmailAndPassword(auth,email,password).catch(err=>alert(err.message));
});

logoutBtn.addEventListener("click", ()=>signOut(auth));

onAuthStateChanged(auth,user=>{
  if(user){
    userDisplay.textContent=`Hola, ${user.email}`;
    loginBtn.style.display="none";
    registerBtn.style.display="none";
    logoutBtn.style.display="inline-block";
  } else {
    userDisplay.textContent="";
    loginBtn.style.display="inline-block";
    registerBtn.style.display="inline-block";
    logoutBtn.style.display="none";
  }
});

// ------------------ CARRITO Y CATALOGO ------------------
let carrito=[];
const catalogo=document.getElementById("catalogo");
const cartCount=document.getElementById("cart-count");
const btnFinalizar=document.getElementById("btnFinalizarCompra");
const btnPagar=document.getElementById("btnPagar");

// Crear contenedor visible del carrito
let carritoContainer = document.getElementById("itemsCarrito");
if(!carritoContainer){
  carritoContainer = document.createElement("div");
  carritoContainer.id = "itemsCarrito";
  document.body.insertBefore(carritoContainer, btnFinalizar);
}

// Función para actualizar la vista del carrito
function actualizarCarrito(){
  cartCount.textContent = carrito.length;
  carritoContainer.innerHTML = "";
  carrito.forEach((p,index)=>{
    const div = document.createElement("div");
    div.classList.add("carrito-item");
    div.innerHTML = `
      <span>${p.nombre} - $${p.precio.toLocaleString()}</span>
      <button data-index="${index}">Eliminar</button>
    `;
    const btn = div.querySelector("button");
    btn.addEventListener("click",()=>{
      carrito.splice(index,1);
      actualizarCarrito();
    });
    carritoContainer.appendChild(div);
  });
  // Mostrar total
  let totalDiv = document.getElementById("totalCarrito");
  if(!totalDiv){
    totalDiv = document.createElement("p");
    totalDiv.id = "totalCarrito";
    carritoContainer.appendChild(totalDiv);
  }
  totalDiv.textContent = "Total: $" + carrito.reduce((sum,p)=>sum+p.precio,0).toLocaleString();
}

// Cargar productos desde JSON
fetch("productos.json")
  .then(res=>res.json())
  .then(productos=>{
    productos.forEach(p=>{
      const div=document.createElement("div");
      div.classList.add("producto");
      div.innerHTML=`
        <img src="${p.imagen}" alt="${p.nombre}">
        <h3>${p.nombre}</h3>
        <ul>${p.descripcion.map(d=>`<li>${d}</li>`).join("")}</ul>
        <p class="precio">$${p.precio.toLocaleString()}</p>
        <button>Agregar al carrito</button>
      `;
      // Toggle descripción al clickear el título
      const ul=div.querySelector("ul");
      div.querySelector("h3").addEventListener("click",()=>ul.style.display=ul.style.display==="none"?"block":"none");

      const btn=div.querySelector("button");
      btn.addEventListener("click",()=>{
        carrito.push(p);
        actualizarCarrito();
      });
      catalogo.appendChild(div);
    });
  });

// ------------------ FINALIZAR COMPRA + EmailJS ------------------
btnFinalizar.addEventListener("click",()=>{
  if(carrito.length===0){alert("El carrito está vacío"); return;}
  const lista=carrito.map(p=>`${p.nombre} - $${p.precio.toLocaleString()}`).join("\n");
  const total=carrito.reduce((sum,p)=>sum+p.precio,0);
  
  emailjs.send("service_sby0arr","template_onftb26",{
    nombre:userDisplay.textContent||"Invitado",
    email:document.getElementById("email").value||"sin_email",
    productos:lista,
    total:total
  }).then(()=>alert("Orden enviada por correo!"),err=>alert("Error al enviar correo"));

  btnPagar.style.display="inline-block";
  btnPagar.textContent="Pagar";
});

// ------------------ BOTON PAGO SIMULADO ------------------
btnPagar.addEventListener("click",()=>{
  if(carrito.length===0){
    alert("El carrito está vacío");
    return;
  }
  const total=carrito.reduce((sum,p)=>sum+p.precio,0);
  alert("Simulación de pago: Total a pagar $" + total.toLocaleString() + "\nAquí se integraría Mercado Pago.");
});

// ------------------ MENU HAMBURGUESA ------------------
const toggle=document.querySelector(".menu-toggle");
const navMenu=document.querySelector(".navbar ul");
toggle.addEventListener("click",()=>navMenu.classList.toggle("open"));


