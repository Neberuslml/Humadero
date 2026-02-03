// js/menu.js - Versión FINAL que SÍ funciona
const API_URL = 'https://humadero-api.onrender.com';

async function openCategory(category) {
  console.log(`📍 Intentando cargar: ${category}`);
  console.log(`🌐 URL: ${API_URL}/menu/${category}`);
  
  try {
    // 1. Intentar conectar a la API
    const response = await fetch(`${API_URL}/menu/${category}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const items = await response.json();
    console.log(`✅ API respondió con ${items.length} productos`);
    
    // 2. Mostrar los productos
    displayItems(items);
    
    // 3. Actualizar estado
    updateStatus(`✅ Cargados ${items.length} productos desde la API`, 'success');
    
  } catch (error) {
    console.error('❌ Error conectando a la API:', error);
    
    // 4. Fallback: datos locales
    const fallbackItems = getFallbackItems(category);
    console.log(`📦 Usando ${fallbackItems.length} productos de respaldo`);
    
    displayItems(fallbackItems);
    updateStatus(`⚠️ Usando datos de respaldo (${fallbackItems.length} productos)`, 'warning');
  }
}

function getFallbackItems(category) {
  // Datos de respaldo (SIEMPRE disponibles)
  const menu = {
    comida: [
      { id: 1, nombre: '🌮 Taco al Pastor', precio: 20, descripcion: 'Cerdo marinado con piña' },
      { id: 2, nombre: '🥩 Taco de Asada', precio: 22, descripcion: 'Carne asada con cilantro y cebolla' },
      { id: 3, nombre: '🧀 Quesadilla', precio: 25, descripcion: 'Queso Oaxaca derretido' },
      { id: 8, nombre: '🌯 Burrito Gigante', precio: 35, descripcion: 'Con carne, frijoles, arroz y guacamole' }
    ],
    bebidas: [
      { id: 4, nombre: '🥤 Refresco 600ml', precio: 18, descripcion: 'Cola, naranja o limón' },
      { id: 5, nombre: '💧 Agua Natural', precio: 15, descripcion: 'Agua purificada 500ml' },
      { id: 9, nombre: '🍹 Agua de Horchata', precio: 25, descripcion: 'Refrescante horchata 1L' }
    ],
    postres: [
      { id: 6, nombre: '🍮 Flan Napolitano', precio: 25, descripcion: 'Flan casero con caramelo' },
      { id: 7, nombre: '🍓 Gelatina de Frutas', precio: 20, descripcion: 'Con frutas frescas' },
      { id: 10, nombre: '🍰 Pastel de Chocolate', precio: 30, descripcion: 'Porción de pastel belga' }
    ]
  };
  
  return menu[category] || [];
}

function displayItems(items) {
  const container = document.getElementById('items');
  if (!container) {
    console.error('❌ Error: No se encontró el elemento con id="items"');
    return;
  }
  
  // Limpiar contenedor
  container.innerHTML = '';
  
  if (items.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #666;">
        <div style="font-size: 48px;">😔</div>
        <h3>No hay productos en esta categoría</h3>
        <p>Intenta seleccionar otra categoría</p>
      </div>
    `;
    return;
  }
  
  // Crear tarjetas para cada producto
  items.forEach(item => {
    const card = document.createElement('div');
    card.style.cssText = `
      background: white;
      border-radius: 12px;
      padding: 20px;
      margin: 15px;
      width: 280px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
      text-align: center;
      border: 2px solid transparent;
    `;
    
    card.onmouseenter = () => {
      card.style.transform = 'translateY(-8px)';
      card.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
      card.style.borderColor = '#ff9800';
    };
    
    card.onmouseleave = () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
      card.style.borderColor = 'transparent';
    };
    
    // Emoji según categoría
    const emoji = category => {
      const emojis = { comida: '🍔', bebidas: '🥤', postres: '🍰' };
      return emojis[category] || '🍽️';
    };
    
    card.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 10px;">
        ${emoji(item.categoria || 'comida')}
      </div>
      
      <h3 style="color: #e65100; margin: 0 0 10px 0; font-size: 20px; min-height: 48px;">
        ${item.nombre}
      </h3>
      
      <p style="color: #666; font-size: 14px; margin: 0 0 15px 0; min-height: 60px; line-height: 1.4;">
        ${item.descripcion || 'Delicioso producto de Humadero'}
      </p>
      
      <div style="font-size: 32px; font-weight: bold; color: #2e7d32; margin: 15px 0;">
        $${item.precio}
      </div>
      
      <button onclick="addToCart(${item.id}, '${item.nombre.replace(/'/g, "\\'")}', ${item.precio})"
              style="background: linear-gradient(135deg, #ff9800, #e65100);
                     color: white;
                     border: none;
                     padding: 12px 24px;
                     border-radius: 25px;
                     cursor: pointer;
                     font-size: 16px;
                     font-weight: bold;
                     width: 100%;
                     transition: all 0.3s;">
        🛒 Agregar al Carrito
      </button>
    `;
    
    container.appendChild(card);
  });
}

function updateStatus(message, type = 'info') {
  console.log(`📊 Status: ${message}`);
  
  // Buscar o crear barra de estado
  let statusBar = document.getElementById('status-bar');
  if (!statusBar) {
    statusBar = document.createElement('div');
    statusBar.id = 'status-bar';
    const container = document.querySelector('main') || document.body;
    const itemsElement = document.getElementById('items');
    if (itemsElement) {
      container.insertBefore(statusBar, itemsElement);
    } else {
      container.appendChild(statusBar);
    }
  }
  
  // Colores según tipo
  const colors = {
    success: { bg: '#d4edda', color: '#155724', border: '#c3e6cb' },
    warning: { bg: '#fff3cd', color: '#856404', border: '#ffeaa7' },
    error: { bg: '#f8d7da', color: '#721c24', border: '#f5c6cb' },
    info: { bg: '#d1ecf1', color: '#0c5460', border: '#bee5eb' }
  };
  
  const style = colors[type] || colors.info;
  
  statusBar.style.cssText = `
    padding: 12px 20px;
    border-radius: 8px;
    margin: 10px 0;
    font-weight: bold;
    text-align: center;
    background: ${style.bg};
    color: ${style.color};
    border: 1px solid ${style.border};
    transition: all 0.3s;
  `;
  
  statusBar.innerHTML = message;
  
  // Auto-ocultar mensajes de éxito/info
  if (type === 'success' || type === 'info') {
    setTimeout(() => {
      if (statusBar.innerHTML === message) {
        statusBar.style.opacity = '0';
        setTimeout(() => statusBar.remove(), 300);
      }
    }, 5000);
  }
}

// Función global para el carrito
window.addToCart = function(id, nombre, precio) {
  console.log(`🛒 Agregando: ${nombre} - $${precio}`);
  
  // Obtener carrito actual
  let cart = JSON.parse(localStorage.getItem('humadero_cart')) || [];
  
  // Buscar si ya existe
  const existingIndex = cart.findIndex(item => item.id === id);
  
  if (existingIndex >= 0) {
    // Incrementar cantidad
    cart[existingIndex].cantidad = (cart[existingIndex].cantidad || 1) + 1;
    cart[existingIndex].ultimaActualizacion = new Date().toISOString();
  } else {
    // Agregar nuevo
    cart.push({
      id: id,
      nombre: nombre,
      precio: precio,
      cantidad: 1,
      agregado: new Date().toISOString()
    });
  }
  
  // Guardar en localStorage
  localStorage.setItem('humadero_cart', JSON.stringify(cart));
  
  // Mostrar notificación
  showNotification(`✅ "${nombre}" agregado al carrito!`);
  
  // Actualizar contador del carrito (si existe)
  updateCartCount();
};

function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 15px 25px;
    border-radius: 10px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.3);
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
    font-family: Arial, sans-serif;
    max-width: 300px;
  `;
  
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
      <span style="font-size: 24px;">✅</span>
      <div>${message}</div>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Auto-eliminar después de 3 segundos
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('humadero_cart')) || [];
  const totalItems = cart.reduce((sum, item) => sum + (item.cantidad || 1), 0);
  
  // Actualizar en botón del carrito si existe
  const cartButton = document.querySelector('[onclick*="goToCart"]');
  if (cartButton) {
    cartButton.innerHTML = `🛒 Carrito (${totalItems})`;
  }
}

// Añadir estilos de animación
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  
  #items {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 20px;
  }
`;
document.head.appendChild(style);

// Cargar comida automáticamente al abrir la página
document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 Página cargada, verificando API...');
  
  // Verificar conexión
  fetch(`${API_URL}/health`)
    .then(response => response.json())
    .then(data => {
      console.log('✅ Estado API:', data);
      updateStatus('✅ Conectado a Humadero API', 'success');
    })
    .catch(error => {
      console.log('⚠️ API no disponible:', error.message);
      updateStatus('⚠️ Modo offline activado', 'warning');
    });
  
  // Cargar comida después de 500ms
  setTimeout(() => {
    openCategory('comida');
    updateCartCount();
  }, 500);
});

// Función para ir al carrito
window.goToCart = function() {
  const cart = JSON.parse(localStorage.getItem('humadero_cart')) || [];
  
  if (cart.length === 0) {
    alert('🛒 Tu carrito está vacío\nAgrega algunos productos primero.');
    return;
  }
  
  // Redirigir a cart.html (asegúrate de que existe)
  window.location.href = 'cart.html';
};
