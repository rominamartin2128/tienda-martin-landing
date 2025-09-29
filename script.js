const contenedor = document.getElementById("productosContainer");

// Tomo los productos del JSON
fetch("productos.json")
  .then(res => res.json())
  .then(productos => {
    productos.forEach(producto => {
      const card = document.createElement("div");
      card.classList.add("producto");

      // Imagen
      const imagen = document.createElement("img");
      imagen.src = producto.imagen;
      imagen.alt = producto.nombre;

      // Nombre
      const nombre = document.createElement("h3");
      nombre.textContent = producto.nombre;

      // Descripción
      const descripcion = document.createElement("p");
      descripcion.textContent = producto.descripcion;

      // Botón de agregar al carrito
      const boton = document.createElement("button");
      boton.textContent = "Agregar al carrito";

      // Append elementos
      card.appendChild(imagen);
      card.appendChild(nombre);
      card.appendChild(descripcion);
      card.appendChild(boton);

      contenedor.appendChild(card);
    });
  });

