const API_URL = 'https://humadero-api.onrender.com/menu';

let datos = {};
let carrito = [];

fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    datos = data;
    mostrarCategoria('comida'); // por defecto
  });

function mostrarCategoria(tipo) {
  const contenedor = document.getElementById('menu');
  contenedor.innerHTML = '';

  datos[tipo].forEach(item => {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <h3>${item.nombre}</h3>
      <p>$${item.precio}</p>
      <button onclick="agregarCarrito('${item.nombre}', ${item.precio})">
        Agregar
      </button>
    `;
    contenedor.appendChild(div);
  });
}

function agregarCarrito(nombre, precio) {
  carrito.push({ nombre, precio });
  renderCarrito();
}

function renderCarrito() {
  const lista = document.getElementById('carrito');
  lista.innerHTML = '';

  carrito.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.nombre} - $${item.precio}`;
    lista.appendChild(li);
  });
}

