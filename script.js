let carrito = [];
let metodoPagoSeleccionado = '';

// 🛍️ Agregar producto al carrito (sin cantidad en productos)
function agregarCarrito(nombre, precio) {
  // Buscar si el producto ya está en el carrito
  const existente = carrito.find(item => item.nombre === nombre);
  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({ nombre, precio, cantidad: 1 });
  }

  // Actualizar contador total
  const totalProductos = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  document.getElementById('contador').innerText = totalProductos;

  mostrarMensaje(`${nombre} agregado al carrito 🛍️`);
  
  // Si el carrito está abierto, actualizarlo
  if (document.getElementById('modalCarrito').style.display === 'flex') {
    mostrarCarrito();
  }
}

// 🛒 Mostrar modal del carrito
function abrirCarrito() {
  document.getElementById('modalCarrito').style.display = 'flex';
  mostrarCarrito();
}

// ❌ Cerrar modal
function cerrarCarrito() {
  document.getElementById('modalCarrito').style.display = 'none';
}

// 📦 Mostrar contenido del carrito con controles de cantidad
function mostrarCarrito() {
  const lista = document.getElementById('listaCarrito');
  const total = document.getElementById('total');
  lista.innerHTML = '';
  let suma = 0;

  if (carrito.length === 0) {
    lista.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
    total.innerText = '0';
    return;
  }

  carrito.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad;
    suma += subtotal;
    
    lista.innerHTML += `
      <div class="item-carrito">
        <div class="item-info">
          <div class="item-nombre">${item.nombre}</div>
          <div class="item-precio">$${item.precio.toLocaleString()} c/u</div>
        </div>
        <div class="controles-cantidad">
          <button class="btn-cantidad" onclick="cambiarCantidad(${index}, -1)">-</button>
          <span class="cantidad-actual">${item.cantidad}</span>
          <button class="btn-cantidad" onclick="cambiarCantidad(${index}, 1)">+</button>
          <button class="btn-eliminar" onclick="eliminarProducto(${index})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  });

  total.innerText = suma.toLocaleString();
}

// 🔢 Cambiar cantidad de un producto
function cambiarCantidad(index, cambio) {
  const producto = carrito[index];
  producto.cantidad += cambio;
  
  if (producto.cantidad <= 0) {
    carrito.splice(index, 1);
  }
  
  // Actualizar contador total
  const totalProductos = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  document.getElementById('contador').innerText = totalProductos;
  
  mostrarCarrito();
}

// 🗑️ Eliminar producto del carrito
function eliminarProducto(index) {
  carrito.splice(index, 1);
  
  // Actualizar contador total
  const totalProductos = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  document.getElementById('contador').innerText = totalProductos;
  
  mostrarCarrito();
}

// 💳 Seleccionar método de pago
function seleccionarMetodo(metodo) {
  metodoPagoSeleccionado = metodo;
  document.getElementById('metodo-pago').value = metodo;
  
  // Actualizar estilos visuales
  document.querySelectorAll('.metodo-pago').forEach(elemento => {
    elemento.classList.remove('seleccionado');
  });
  
  document.querySelector(`.metodo-pago[onclick="seleccionarMetodo('${metodo}')"]`).classList.add('seleccionado');
}

// 💬 Finalizar compra y enviar a WhatsApp
function finalizarCompra() {
  const nombre = document.getElementById('nombre').value;
  const telefono = document.getElementById('telefono').value;
  const direccion = document.getElementById('direccion').value;
  
  if (!nombre || !telefono || !direccion) {
    alert("Por favor completa todos los datos de envío.");
    return;
  }
  
  if (!metodoPagoSeleccionado) {
    alert("Por favor selecciona un método de pago.");
    return;
  }

  if (carrito.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  let mensaje = `Hola Lunaria ✨%0A`;
  mensaje += `Mi nombre es ${nombre}.%0A`;
  mensaje += `Quisiera hacer el siguiente pedido:%0A%0A`;

  let total = 0;
  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    mensaje += `- ${item.nombre} × ${item.cantidad} — $${subtotal.toLocaleString()}%0A`;
    total += subtotal;
  });

  mensaje += `%0A💰 Total: $${total.toLocaleString()}%0A`;
  mensaje += `📍 Dirección: ${direccion}%0A📞 Teléfono: ${telefono}%0A`;
  mensaje += `💳 Pago: ${metodoPagoSeleccionado === 'nequi' ? 'Nequi' : 'PayPal'}%0A%0A`;
  mensaje += `¡Espero tu confirmación! 🌙`;

  // 🔽 Cambia este número por tu número de WhatsApp (sin + ni espacios)
  const numero = "573153693952";

  const url = `https://wa.me/${numero}?text=${mensaje}`;
  window.open(url, "_blank");

  carrito = [];
  document.getElementById('contador').innerText = 0;
  cerrarCarrito();
  mostrarMensaje("Tu pedido fue enviado a WhatsApp 💬");
}

// ✅ Mensaje visual cuando se agrega al carrito
function mostrarMensaje(mensaje) {
  const mensajeElement = document.createElement('div');
  mensajeElement.textContent = mensaje;
  mensajeElement.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ff65a3;
    color: white;
    padding: 14px 18px;
    border-radius: 10px;
    z-index: 1001;
    font-weight: 500;
    box-shadow: 0 3px 10px rgba(0,0,0,0.2);
    transition: opacity 0.3s;
    max-width: 80%;
  `;

  document.body.appendChild(mensajeElement);

  setTimeout(() => {
    mensajeElement.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(mensajeElement);
    }, 300);
  }, 2500);
}

// 💫 Mostrar carrito solo al llegar a la sección "coleccion"
const carritoFlotante = document.querySelector('.carrito-flotante');
const seccionColeccion = document.querySelector('#coleccion');

window.addEventListener('scroll', () => {
  const rect = seccionColeccion.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom > 0) {
    carritoFlotante.classList.add('visible');
  } else {
    carritoFlotante.classList.remove('visible');
  }
});

// 🌙 Animación suave para secciones al hacer scroll
const secciones = document.querySelectorAll('.seccion');

const mostrarSeccion = () => {
  secciones.forEach(seccion => {
    const rect = seccion.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      seccion.classList.add('visible');
    }
  });
};

window.addEventListener('scroll', mostrarSeccion);
window.addEventListener('load', mostrarSeccion);

// 🧭 Navegación suave para enlaces de la barra lateral
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Remover clase activa de todos los enlaces
    document.querySelectorAll('.nav-link').forEach(item => {
      item.classList.remove('active');
    });
    
    // Agregar clase activa al enlace clickeado
    this.classList.add('active');
    
    // Navegación suave
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      window.scrollTo({
        top: targetSection.offsetTop - 20,
        behavior: 'smooth'
      });
    }
    
    // En móviles, cerrar el menú después de hacer clic
    if (window.innerWidth <= 768) {
      document.getElementById('navbar-lateral').classList.remove('active');
    }
  });
});

// 📱 Menú hamburguesa para móviles
document.getElementById('hamburger').addEventListener('click', function() {
  document.getElementById('navbar-lateral').classList.toggle('active');
});

// Cerrar menú al hacer clic fuera de él en móviles
document.addEventListener('click', function(event) {
  const navbar = document.getElementById('navbar-lateral');
  const hamburger = document.getElementById('hamburger');
  
  if (window.innerWidth <= 768 && 
      navbar.classList.contains('active') && 
      !navbar.contains(event.target) && 
      !hamburger.contains(event.target)) {
    navbar.classList.remove('active');
  }
});

// Mostrar/ocultar menú hamburguesa en móviles
function checkScreenSize() {
  const hamburger = document.getElementById('hamburger');
  const navbar = document.getElementById('navbar-lateral');
  
  if (window.innerWidth <= 768) {
    hamburger.style.display = 'block';
    navbar.classList.remove('active');
  } else {
    hamburger.style.display = 'none';
    navbar.classList.remove('active');
  }
}

window.addEventListener('resize', checkScreenSize);
window.addEventListener('load', checkScreenSize);

// Cerrar modal del carrito al hacer clic fuera de él
document.getElementById('modalCarrito').addEventListener('click', function(e) {
  if (e.target === this) {
    cerrarCarrito();
  }
});