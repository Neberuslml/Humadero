// URL CORRECTA de tu API
const API_URL = 'https://humadero-api.onrender.com';

async function openCategory(category) {
  console.log(`Cargando ${category} desde: ${API_URL}`);
  
  try {
    // 1. Intentar con tu API real
    const response = await fetch(`${API_URL}/menu`);
    
    if (!response.ok) {
      throw new Error(`Error API: ${response.status}`);
    }
    
    const menuData = await response.json();
    console.log('Respuesta completa de API:', menuData);
    
    // Tu API devuelve {comida: [...], bebidas: [...], postres: [...]}
    const items = menuData[category] || [];
    console.log(`Items para ${category}:`, items);
    
    displayItems(items);
    
  } catch (apiError) {
    console.error('Error con API:', apiError);
    
    // 2. Fallback: Datos de ejemplo
    const exampleData = {
      comida: [
        { id: 1, nombre: '🌮 Taco al Pastor', precio: 20 },
        { id: 2, nombre: '🥩 Taco de Asada', precio: 22 },
        { id: 3, nombre: '🧀 Quesadilla', precio: 25 }
      ],
      bebidas: [
        { id: 4, nombre: '🥤 Refresco', precio: 18 },
        { id: 5, nombre: '💧 Agua Natural', precio: 15 }
      ],
      postres: [
        { id: 6, nombre: '🍮 Flan', precio: 25 },
        { id: 7, nombre: '🍓 Gelatina', precio: 20 }
      ]
    };
    
    const items = exampleData[category] || [];
    displayItems(items);
    
    alert('⚠️ Usando datos de ejemplo. La API está funcionando pero necesita más endpoints.');
  }
}

function displayItems(items) {
  const container = document.getElementById("items");
  if (!container) {
    console.error('ERROR: No se encuentra el elemento con id="items"');
    return;
  }
  
  container.innerHTML = "";
  
  if (items.length === 0) {
    container.innerHTML = '<p style="color: #666;">No hay productos en esta categoría</p>';
    return;
  }
  
  items.forEach(item => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "menu-item";
    itemDiv.style.cssText = `
      background: white;
      padding: 15px;
      margin: 15px auto;
      width: 250px;
      border-radius: 10px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.1);
      text-align: center;
    `;
    
    itemDiv.innerHTML = `
      <h3 style="color: #e65100; margin: 0 0 10px 0;">${item.nombre}</h3>
      <p style="font-size: 24px; font-weight: bold; color: #2e7d32; margin: 10px 0;">
        $${item.precio}
      </p>
      <button onclick="addToCart(${item.id}, '${item.nombre.replace(/'/g, "\\'")}', ${item.precio})"
              style="background: #ff9800; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 16px;">
        🛒 Agregar al Carrito
      </button>
    `;
    
    container.appendChild(itemDiv);
  });
}

// Función global para el carrito
window.addToCart = function(id, nombre, precio) {
  console.log(`Agregando: ${nombre} - $${precio}`);
  
  // Obtener carrito actual o crear uno nuevo
  let cart = JSON.parse(localStorage.getItem('humadero_cart')) || [];
  
  // Buscar si ya existe
  const existingIndex = cart.findIndex(item => item.id === id);
  
  if (existingIndex >= 0) {
    // Incrementar cantidad
    cart[existingIndex].cantidad += 1;
  } else {
    // Agregar nuevo
    cart.push({
      id: id,
      nombre: nombre,
      precio: precio,
      cantidad: 1
    });
  }
  
  // Guardar en localStorage
  localStorage.setItem('humadero_cart', JSON.stringify(cart));
  
  // Mostrar confirmación
  alert(`✅ "${nombre}" agregado al carrito!\nTotal en carrito: ${cart.length} productos`);
};

window.goToCart = function() {
  window.location.href = 'cart.html';
};
