// URL de tu API en Render (¡VERIFICA QUE SEA CORRECTA!)
const API_URL = 'https://humadero-backend.onrender.com';

async function openCategory(category) {
  try {
    console.log(`Cargando categoría: ${category}`);
    
    // 1. INTENTAR con tu nueva API
    const response = await fetch(`${API_URL}/menu/${category}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const items = await response.json();
    console.log('Datos recibidos:', items);
    
    // Mostrar los items
    displayItems(items);
    
  } catch (apiError) {
    console.log('Error con API, intentando Supabase directo:', apiError);
    
    // 2. FALLBACK: Usar Supabase directamente
    try {
      const { data, error } = await supabase
        .from("menu")
        .select("*")
        .eq("categoria", category);
      
      if (error) throw error;
      
      console.log('Datos de Supabase:', data);
      displayItems(data);
      
    } catch (supabaseError) {
      console.error('Error con Supabase:', supabaseError);
      
      // 3. FALLBACK FINAL: Datos de ejemplo
      const exampleData = {
        comida: [
          { id: 1, nombre: 'Taco al Pastor', precio: 20 },
          { id: 2, nombre: 'Taco de Asada', precio: 22 },
          { id: 3, nombre: 'Quesadilla', precio: 25 }
        ],
        bebidas: [
          { id: 4, nombre: 'Refresco', precio: 18 },
          { id: 5, nombre: 'Agua', precio: 15 }
        ],
        postres: [
          { id: 6, nombre: 'Flan', precio: 25 },
          { id: 7, nombre: 'Gelatina', precio: 20 }
        ]
      };
      
      displayItems(exampleData[category] || []);
      alert('⚠️ Usando datos de ejemplo. Verifica tu conexión.');
    }
  }
}

function displayItems(items) {
  const container = document.getElementById("items");
  if (!container) {
    console.error('No se encontró el contenedor con id="items"');
    return;
  }
  
  console.log(`Mostrando ${items.length} items`);
  container.innerHTML = "";
  
  if (items.length === 0) {
    container.innerHTML = '<p>No hay productos en esta categoría</p>';
    return;
  }
  
  items.forEach(item => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "menu-item";
    itemDiv.innerHTML = `
      <h3>${item.nombre}</h3>
      <p>$${item.precio}</p>
      <button onclick="addToCart(${item.id}, '${item.nombre.replace(/'/g, "\\'")}', ${item.precio})">
        Agregar
      </button>
    `;
    container.appendChild(itemDiv);
  });
}

// Función global para el carrito (temporal)
window.addToCart = function(id, nombre, precio) {
  console.log('Agregando al carrito:', { id, nombre, precio });
  alert(`✅ "${nombre}" agregado al carrito!`);
};
