// Configuración de API
const API_URL = 'https://humadero-api.onrender.com';

// Funciones para usar la API
async function getMenu() {
  try {
    const response = await fetch(`${API_URL}/menu`);
    return await response.json();
  } catch (error) {
    console.error('Error al obtener menú:', error);
    return null;
  }
}

async function getMenuByCategory(category) {
  try {
    const response = await fetch(`${API_URL}/menu/${category}`);
    return await response.json();
  } catch (error) {
    console.error(`Error al obtener menú ${category}:`, error);
    return [];
  }
}

async function createOrder(orderData) {
  try {
    const response = await fetch(`${API_URL}/pedidos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    return await response.json();
  } catch (error) {
    console.error('Error al crear pedido:', error);
    throw error;
  }
}

// Exportar funciones
window.humaderoAPI = {
  getMenu,
  getMenuByCategory,
  createOrder,
  apiUrl: API_URL
};
