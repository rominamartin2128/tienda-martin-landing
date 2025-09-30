document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("productosContainer");

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

  function actualizarCarritoUI() {
    const carritoLista = document.getElementById("carritoLista");
    const carritoTotal = document.getElementById("carritoTotal");
    const cartCount = document.getElementById("cart-count");
    const vaciarCarritoBtn = document.getElementById("vaciarCarrito");

    carritoLista.innerHTML = "";
    let total = 0;

    carrito.forEach((p, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${p.nombre} - $${p.precio}
        <button class="eliminar" data-index="${index}">❌</button>
      `;
      carritoLista.appendChild(li);
      total += Number(p.precio) || 0;
    });

    carritoTotal.textContent = `Total: $${total}`;
    cartCount.textContent = carrito.length;
    vaciarCarritoBtn.style.display = carrito.length > 0 ? "block" : "none";

    document.querySelectorAll(".eliminar").forEach(btn => {
      btn.addEventListener("click", e => {
        const index = e.target.dataset.index;
        carrito.splice(index, 1);
        guardarCarrito();
        actualizarCarritoUI();
      });
    });

    guardarCarrito();
  }

  vaciarCarrito.addEventListener("click", () => {
    carrito = [];
    guardarCarrito();
    actualizarCarritoUI();
  });

  async function cargarProductos() {
    try {
      const res = await fetch("productos.json");
      if (!res.ok) throw new Error("Error HTTP: " + res.status);
      const productos = await res.json();

      contenedor.innerHTML = "";
      productos.forEach(producto => {
        const card = document.createElement("div");
        card.className = "producto";

        const img = document.createElement("img");
        img.src = producto.imagen;
        img.alt = producto.nombre;

        const h3 = document.createElement("h3");
        h3.textContent = producto.nombre;

        const pPrecio = document.createElement("p");
        pPrecio.className = "precio";
        pPrecio.textContent = `$${producto.precio}`;

        const btnDesc = document.createElement("button");
        btnDesc.textContent = "Ver más";
        btnDesc.className = "toggle-desc";

        const pDesc = document.createElement("p");
        pDesc.className = "descripcion oculto";
        pDesc.innerHTML = Array.isArray(producto.descripcion)
          ? producto.descripcion.join("<br>")
          : producto.descripcion;

        const btnAgregar = document.createElement("button");
        btnAgregar.textContent = "Agregar al carrito";
        btnAgregar.className = "agregar-carrito";

        btnDesc.addEventListener("click", () => {
          pDesc.classList.toggle("oculto");
          btnDesc.textContent = pDesc.classList.contains("oculto")
            ? "Ver más"
            : "Ver menos";
        });

        btnAgregar.addEventListener("click", () => {
          carrito.push(producto);
          guardarCarrito();
          actualizarCarritoUI();
        });

        card.appendChild(img);
        card.appendChild(h3);
        card.appendChild(pPrecio);
        card.appendChild(btnDesc);
        card.appendChild(pDesc);
        card.appendChild(btnAgregar);

        contenedor.appendChild(card);
      });

      actualizarCarritoUI();
    } catch (err) {
      console.error("Error cargando productos:", err);
      contenedor.innerHTML = "<p style='color:red'>Error al cargar productos.</p>";
    }
  }

  cargarProductos();

  // ----------------- LOGIN Y REGISTRO -----------------
  const btnAbrirLogin = document.getElementById("btnAbrirLogin");
  const loginModal = document.getElementById("loginModal");
  const cerrarModal = document.getElementById("cerrarModal");

  btnAbrirLogin.addEventListener("click", () => loginModal.style.display = "block");
  cerrarModal.addEventListener("click", () => loginModal.style.display = "none");
  window.addEventListener("click", e => { if(e.target == loginModal) loginModal.style.display = "none"; });

  // Registro
  const formRegistro = document.getElementById("formRegistro");
  formRegistro.addEventListener("submit", e => {
    e.preventDefault();
    const nombre = document.getElementById("regNombre").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    if (usuarios.find(u => u.email === email)) {
      alert("El email ya está registrado");
      return;
    }

    usuarios.push({ nombre, email, password });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    alert("Registro exitoso");
    formRegistro.reset();
  });

  // Login
  const formLogin = document.getElementById("formLogin");
  formLogin.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    let usuario = usuarios.find(u => u.email === email && u.password === password);
    if(usuario){
      localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));
      alert("Login exitoso");
      loginModal.style.display = "none";
      formLogin.reset();
    } else {
      alert("Email o contraseña incorrectos");
    }
  });

  // ----------------- ENVÍO ORDEN EMAILJS -----------------
  function enviarOrdenEmail(productos, total) {
    let usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
    if (!usuario) {
      alert("Debes iniciar sesión para enviar la orden");
      return;
    }

    const templateParams = {
      nombre: usuario.nombre,
      email: usuario.email,
      productos: productos.map(p => `${p.nombre} x1`).join(", "),
      total: total
    };

    emailjs.send('service_5ro55v9', 'template_k4zk30a', templateParams, 'bIjrBOVKEdjncZDpG')
      .then(() => alert("Orden enviada correctamente"))
      .catch(err => alert("Error al enviar la orden: " + err));
  }

  // Botón enviar orden
  const btnEnviarOrden = document.createElement("button");
  btnEnviarOrden.textContent = "Enviar Orden por Email";
  btnEnviarOrden.addEventListener("click", () => {
    let total = carrito.reduce((acc, p) => acc + Number(p.precio || 0), 0);
    enviarOrdenEmail(carrito, total);
  });
  document.getElementById("carrito").appendChild(btnEnviarOrden);

});



