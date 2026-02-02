const API_URL = 'https://humadero-api.onrender.com';

fetch(`${API_URL}/menu`)
  .then(res => res.json())
  .then(data => {
    console.log(data);
    document.getElementById('menu').innerHTML =
      data.map(item => `
        <div>
          <h3>${item.nombre}</h3>
          <p>$${item.precio}</p>
          <button>Agregar</button>
        </div>
      `).join('');
  })
  .catch(err => console.error(err));
