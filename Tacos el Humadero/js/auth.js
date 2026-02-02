async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    document.getElementById("msg").innerText = error.message;
    return;
  }

  window.location.href = "menu.html";
}
