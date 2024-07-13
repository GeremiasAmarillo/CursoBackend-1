const socket = io();

socket.on("productos", (productos) => {
  if (Array.isArray(productos)) {
    const tbody = document.getElementById("productos-body");
    tbody.innerHTML = "";

    productos.forEach((producto) => {
      const row = tbody.insertRow();

      row.innerHTML = `
        <td>${producto._id}</td>
        <td>${producto.title}</td>
        <td>${producto.description}</td>
        <td>${producto.price}</td>
        <td>
          ${
            producto.thumbnail && producto.thumbnail.length > 0
              ? `<img src="${producto.thumbnail[0]}" alt="Imagen del producto" />`
              : "No hay imagen"
          }
        </td>
        <td>${producto.code}</td>
        <td>${producto.stock}</td>
        <td>${producto.status ? "Activo" : "Desactivado"}</td>
        <td>${producto.category}</td>
        <td class="eliminar-button">
          <button onclick="eliminarProducto('${
            producto._id
          }')">Eliminar</button>
        </td>`;
    });
  } else {
    console.error("Los datos recibidos no son un array:", productos);
  }
});

const formulario = document.getElementById("producto-form");

formulario.addEventListener("submit", function (event) {
  event.preventDefault();

  const titulo = document.getElementById("titulo").value;
  const descripcion = document.getElementById("descripcion").value;
  const precio = document.getElementById("precio").value;
  const codigo = document.getElementById("codigo").value;
  const stock = document.getElementById("stock").value;
  const categoria = document.getElementById("categoria").value;

  const producto = {
    title: titulo,
    description: descripcion,
    price: precio,
    code: codigo,
    stock: stock,
    category: categoria,
  };

  socket.emit("agregarProducto", producto);

  formulario.reset();
});

function eliminarProducto(id) {
  socket.emit("eliminarProducto", id);
}
