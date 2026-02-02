async function openCategory(category) {
  const { data, error } = await supabase
    .from("menu")
    .select("*")
    .eq("categoria", category);

  if (error) return alert(error.message);

  const container = document.getElementById("items");
  container.innerHTML = "";

  data.forEach(item => {
    container.innerHTML += `
      <div>
        <h3>${item.nombre}</h3>
        <p>$${item.precio}</p>
        <button onclick="addToCart(${item.id})">Agregar</button>
      </div>
    `;
  });
}
