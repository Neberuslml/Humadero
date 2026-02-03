// js/auth.js - Sistema completo de autenticación
const SUPABASE_URL = 'https://tu-proyecto.supabase.co'; // REEMPLAZA CON TU URL
const SUPABASE_ANON_KEY = 'tu-clave-anon-publica'; // REEMPLAZA CON TU KEY

// Inicializar Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Estado de autenticación
let currentUser = null;

// ========== FUNCIONES PRINCIPALES ==========

/**
 * Iniciar sesión con email y contraseña
 */
async function login(email, password) {
  try {
    showLoading(true, 'Iniciando sesión...');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      throw new Error(error.message);
    }

    // Guardar usuario
    currentUser = data.user;
    
    // Guardar en localStorage
    localStorage.setItem('humadero_user', JSON.stringify({
      id: currentUser.id,
      email: currentUser.email,
      nombre: currentUser.user_metadata?.full_name || currentUser.email.split('@')[0],
      avatar: currentUser.user_metadata?.avatar_url
    }));

    // Actualizar UI
    updateUIAfterLogin(currentUser);
    
    // Cerrar modal si existe
    closeLoginModal();
    
    showNotification('✅ ¡Bienvenido de nuevo!', 'success');
    
    return { success: true, user: currentUser };
    
  } catch (error) {
    console.error('Error en login:', error);
    showNotification(`❌ ${error.message}`, 'error');
    return { success: false, error: error.message };
  } finally {
    showLoading(false);
  }
}

/**
 * Registrar nuevo usuario
 */
async function register(fullName, email, password) {
  try {
    showLoading(true, 'Creando cuenta...');
    
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName,
          created_at: new Date().toISOString()
        }
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    // Si requiere confirmación por email
    if (data.user?.identities?.length === 0) {
      showNotification('📧 Revisa tu email para confirmar la cuenta', 'info');
      return { success: true, requiresConfirmation: true };
    }

    // Login automático después de registro
    const loginResult = await login(email, password);
    
    if (loginResult.success) {
      showNotification('🎉 ¡Cuenta creada exitosamente!', 'success');
    }
    
    return loginResult;
    
  } catch (error) {
    console.error('Error en registro:', error);
    showNotification(`❌ ${error.message}`, 'error');
    return { success: false, error: error.message };
  } finally {
    showLoading(false);
  }
}

/**
 * Cerrar sesión
 */
async function logout() {
  try {
    showLoading(true, 'Cerrando sesión...');
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw new Error(error.message);
    }

    // Limpiar datos locales
    currentUser = null;
    localStorage.removeItem('humadero_user');
    localStorage.removeItem('humadero_cart'); // Opcional: limpiar carrito
    
    // Actualizar UI
    updateUIAfterLogout();
    
    showNotification('👋 Sesión cerrada correctamente', 'info');
    
    return { success: true };
    
  } catch (error) {
    console.error('Error en logout:', error);
    showNotification(`❌ ${error.message}`, 'error');
    return { success: false, error: error.message };
  } finally {
    showLoading(false);
  }
}

/**
 * Verificar sesión activa al cargar la página
 */
async function checkAuth() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      currentUser = session.user;
      
      // Guardar en localStorage
      localStorage.setItem('humadero_user', JSON.stringify({
        id: currentUser.id,
        email: currentUser.email,
        nombre: currentUser.user_metadata?.full_name || currentUser.email.split('@')[0],
        avatar: currentUser.user_metadata?.avatar_url
      }));
      
      updateUIAfterLogin(currentUser);
      return { isAuthenticated: true, user: currentUser };
    }
    
    // Verificar localStorage como fallback
    const savedUser = localStorage.getItem('humadero_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      updateUIAfterLogin(userData);
      return { isAuthenticated: true, user: userData };
    }
    
    updateUIAfterLogout();
    return { isAuthenticated: false };
    
  } catch (error) {
    console.error('Error verificando autenticación:', error);
    updateUIAfterLogout();
    return { isAuthenticated: false };
  }
}

/**
 * Obtener usuario actual
 */
function getCurrentUser() {
  if (currentUser) return currentUser;
  
  const savedUser = localStorage.getItem('humadero_user');
  return savedUser ? JSON.parse(savedUser) : null;
}

// ========== FUNCIONES DE UI ==========

/**
 * Actualizar UI después de login
 */
function updateUIAfterLogin(user) {
  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario';
  const userInitial = userName.charAt(0).toUpperCase();
  
  // Ocultar botones de guest
  document.querySelectorAll('.guest-only').forEach(el => {
    el.style.display = 'none';
  });
  
  // Mostrar elementos de usuario
  document.querySelectorAll('.user-only').forEach(el => {
    el.style.display = 'block';
  });
  
  // Actualizar nombre de usuario
  document.querySelectorAll('.user-name').forEach(el => {
    el.textContent = userName;
  });
  
  // Actualizar avatar/inicial
  document.querySelectorAll('.user-avatar').forEach(el => {
    el.textContent = userInitial;
  });
  
  // Cambiar botones del menú principal
  const mainButtons = document.querySelector('.auth-buttons');
  if (mainButtons) {
    mainButtons.innerHTML = `
      <a href="menu.html">
        <button class="primary">🍔 Hacer Pedido</button>
      </a>
      <a href="profile.html">
        <button class="primary" style="background: #666;">👤 Mi Perfil</button>
      </a>
      <button onclick="logout()" class="primary" style="background: #f44336;">
        🚪 Cerrar Sesión
      </button>
    `;
  }
}

/**
 * Actualizar UI después de logout
 */
function updateUIAfterLogout() {
  // Mostrar botones de guest
  document.querySelectorAll('.guest-only').forEach(el => {
    el.style.display = 'block';
  });
  
  // Ocultar elementos de usuario
  document.querySelectorAll('.user-only').forEach(el => {
    el.style.display = 'none';
  });
  
  // Restaurar botones del menú principal
  const mainButtons = document.querySelector('.auth-buttons');
  if (mainButtons) {
    mainButtons.innerHTML = `
      <button onclick="openLoginModal()" class="primary">👤 Iniciar Sesión</button>
      <a href="menu.html">
        <button class="primary" style="background: #e65100;">🍔 Ver Menú</button>
      </a>
      <button onclick="openRegisterModal()" class="primary" style="background: #4CAF50;">
        📝 Registrarse
      </button>
    `;
  }
}

/**
 * Mostrar modal de login
 */
function openLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) {
    modal.style.display = 'flex';
    document.getElementById('loginEmail').focus();
  } else {
    // Si no hay modal, redirigir a login.html
    window.location.href = 'login.html';
  }
}

/**
 * Mostrar modal de registro
 */
function openRegisterModal() {
  const modal = document.getElementById('loginModal');
  if (modal) {
    modal.style.display = 'flex';
    showRegisterForm();
  } else {
    window.location.href = 'register.html';
  }
}

/**
 * Cerrar modal de login
 */
function closeLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) {
    modal.style.display = 'none';
    resetLoginForm();
  }
}

// ========== FUNCIONES DE FORMULARIOS ==========

/**
 * Manejar submit del formulario de login
 */
async function handleLoginSubmit(event) {
  if (event) event.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  if (!email || !password) {
    showNotification('📝 Por favor completa todos los campos', 'warning');
    return;
  }
  
  await login(email, password);
}

/**
 * Manejar submit del formulario de registro
 */
async function handleRegisterSubmit(event) {
  if (event) event.preventDefault();
  
  const fullName = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('registerConfirm').value;
  
  // Validaciones
  if (!fullName || !email || !password || !confirmPassword) {
    showNotification('📝 Completa todos los campos', 'warning');
    return;
  }
  
  if (password.length < 6) {
    showNotification('🔒 La contraseña debe tener al menos 6 caracteres', 'warning');
    return;
  }
  
  if (password !== confirmPassword) {
    showNotification('🔒 Las contraseñas no coinciden', 'warning');
    return;
  }
  
  await register(fullName, email, password);
}

/**
 * Cambiar entre login y registro en el modal
 */
function showLoginForm() {
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('loginEmail').focus();
}

function showRegisterForm() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'block';
  document.getElementById('registerName').focus();
}

function resetLoginForm() {
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginPassword').value = '';
  document.getElementById('registerName').value = '';
  document.getElementById('registerEmail').value = '';
  document.getElementById('registerPassword').value = '';
  document.getElementById('registerConfirm').value = '';
}

// ========== FUNCIONES AUXILIARES ==========

function showLoading(show, message = 'Cargando...') {
  let loader = document.getElementById('globalLoader');
  
  if (show) {
    if (!loader) {
      loader = document.createElement('div');
      loader.id = 'globalLoader';
      loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        color: white;
        font-size: 18px;
      `;
      
      loader.innerHTML = `
        <div style="width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #ff9800; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        <p style="margin-top: 20px;">${message}</p>
      `;
      
      document.body.appendChild(loader);
    }
  } else if (loader) {
    loader.remove();
  }
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  
  const colors = {
    success: { bg: '#4CAF50', icon: '✅' },
    error: { bg: '#f44336', icon: '❌' },
    warning: { bg: '#ff9800', icon: '⚠️' },
    info: { bg: '#2196F3', icon: 'ℹ️' }
  };
  
  const style = colors[type] || colors.info;
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${style.bg};
    color: white;
    padding: 15px 25px;
    border-radius: 10px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.3);
    z-index: 9998;
    animation: slideIn 0.3s ease-out;
    font-family: Arial, sans-serif;
    max-width: 300px;
    display: flex;
    align-items: center;
    gap: 10px;
  `;
  
  notification.innerHTML = `
    <span style="font-size: 20px;">${style.icon}</span>
    <div>${message}</div>
  `;
  
  document.body.appendChild(notification);
  
  // Auto-eliminar después de 5 segundos
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// ========== INICIALIZACIÓN ==========

// Añadir estilos de animación
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);

// Verificar autenticación al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
});

// ========== EXPORTAR FUNCIONES GLOBALES ==========

window.auth = {
  login: handleLoginSubmit,
  register: handleRegisterSubmit,
  logout: logout,
  openLoginModal: openLoginModal,
  openRegisterModal: openRegisterModal,
  closeLoginModal: closeLoginModal,
  showLoginForm: showLoginForm,
  showRegisterForm: showRegisterForm,
  getCurrentUser: getCurrentUser,
  checkAuth: checkAuth
};
