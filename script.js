document.addEventListener("DOMContentLoaded", () => {
  fetch("productos.json")
    .then((response) => response.json())
    .then((productos) => {
      const contenedor = document.getElementById("catalogo");
      productos.forEach((producto) => {
        const productoDiv = document.createElement("div");
        productoDiv.classList.add("producto");

        const imagen = document.createElement("img");
        imagen.src = producto.imagen;
        imagen.alt = producto.nombre;
        productoDiv.appendChild(imagen);

        const nombre = document.createElement("h3");
        nombre.textContent = producto.nombre;
        productoDiv.appendChild(nombre);

        const descripcion = document.createElement("ul");
        producto.descripcion.forEach((linea) => {
          const li = document.createElement("li");
          li.textContent = linea;
          descripcion.appendChild(li);
        });
        productoDiv.appendChild(descripcion);

        const precio = document.createElement("p");
        precio.classList.add("precio");
        precio.textContent = `$${producto.precio.toLocaleString()}`;
        productoDiv.appendChild(precio);

        contenedor.appendChild(productoDiv);
      });
    })
    .catch((error) => console.error("Error al cargar los productos:", error));
});


