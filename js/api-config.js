// js/api-config.js
window.HumaderoConfig = {
  API_URL: 'https://humadero-api.onrender.com',
  
  // Funciones de API
  async getMenu() {
    try {
      const response = await fetch(`${this.API_URL}/menu`);
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo menú:', error);
      return null;
    }
  },
  
  async testConnection() {
    try {
      const response = await fetch(`${this.API_URL}/`);
      const text = await response.text();
      return {
        connected: response.ok,
        message: text,
        url: this.API_URL
      };
    } catch (error) {
      return {
        connected: false,
        error: error.message,
        url: this.API_URL
      };
    }
  },
  
  async createOrder(orderData) {
    try {
      // Si tu API tiene endpoint /pedidos
      const response = await fetch(`${this.API_URL}/pedidos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });
      return await response.json();
    } catch (error) {
      console.error('Error creando pedido:', error);
      throw error;
    }
  }
};
