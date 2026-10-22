// 1. Navegación del Catálogo al Formulario
function solicitarServicio(nombreServicio) {
    const select = document.getElementById('servicioSelect');
    if (select) {
        select.value = nombreServicio;
    }
    document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
}

// 2. Procesar Formulario de Contacto
function procesarContacto(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const servicio = document.getElementById('servicioSelect').value;
    const form = document.getElementById('formContacto');
    const mensajeConfirmacion = document.getElementById('confirmacionEnvio');
    const textoConfirmacion = document.getElementById('textoConfirmacion');

    form.style.display = 'none';
    textoConfirmacion.innerText = `¡Gracias ${nombre}! Tu solicitud para "${servicio}" ha sido registrada exitosamente en ML Finance & Tax. Nos pondremos en contacto contigo a la brevedad.`;
    mensajeConfirmacion.style.display = 'block';
}

// 3. Cargar las opciones exactas según la Tabla de Retefuente 2026
function actualizarOpcionesConcepto() {
    const tipoPersona = document.getElementById('tipoPersona').value;
    const selectConcepto = document.getElementById('tipoConcepto');

    selectConcepto.innerHTML = '';

    let opciones = [];

    // Opciones basadas exactamente en la tabla 2026
    if (tipoPersona === 'juridica') {
        opciones = [
            { texto: 'Honorarios y Comisiones - P. Jurídicas (11%) [Base: $0]', valor: 0.11, base: 0 },
            { texto: 'Servicios Generales (4%) [Base: $105.000]', valor: 0.04, base: 105000 },
            { texto: 'Compras Generales (2.5%) [Base: $524.000]', valor: 0.025, base: 524000 },
            { texto: 'Arrendamiento Bienes Inmuebles (3.5%) [Base: $524.000]', valor: 0.035, base: 524000 },
            { texto: 'Arrendamiento Bienes Muebles (4%) [Base: $0]', valor: 0.04, base: 0 },
            { texto: 'Licenciamiento / Software (3.5%) [Base: $0]', valor: 0.035, base: 0 },
            { texto: 'Transporte de Carga (1%) [Base: $105.000]', valor: 0.01, base: 105000 }
        ];
    } else if (tipoPersona === 'naturalDeclarante') {
        opciones = [
            { texto: 'Honorarios y Comisiones - Declarante (>3.300 UVT: 11%) [Base: $0]', valor: 0.11, base: 0 },
            { texto: 'Servicios Generales - Declarante (4%) [Base: $105.000]', valor: 0.04, base: 105000 },
            { texto: 'Compras Generales - Declarante (2.5%) [Base: $524.000]', valor: 0.025, base: 524000 },
            { texto: 'Arrendamiento Bienes Inmuebles (3.5%) [Base: $524.000]', valor: 0.035, base: 524000 },
            { texto: 'Otros Ingresos Tributarios (2.5%) [Base: $524.000]', valor: 0.025, base: 524000 },
            { texto: 'Transporte Terrestre Pasajeros (3.5%) [Base: $524.000]', valor: 0.035, base: 524000 }
        ];
    } else if (tipoPersona === 'naturalNoDeclarante') {
        opciones = [
            { texto: 'Honorarios y Comisiones - No Declarante (10%) [Base: $0]', valor: 0.10, base: 0 },
            { texto: 'Servicios Generales - No Declarante (6%) [Base: $105.000]', valor: 0.06, base: 105000 },
            { texto: 'Compras Generales - No Declarante (3.5%) [Base: $524.000]', valor: 0.035, base: 524000 },
            { texto: 'Arrendamiento Bienes Inmuebles (3.5%) [Base: $524.000]', valor: 0.035, base: 524000 },
            { texto: 'Servicios Hoteles y Restaurantes (3.5%) [Base: $105.000]', valor: 0.035, base: 105000 },
            { texto: 'Otros Ingresos Tributarios (3.5%) [Base: $524.000]', valor: 0.035, base: 524000 }
        ];
    }

    // Insertar opciones en el select con la tarifa y base en los atributos del elemento
    opciones.forEach(opt => {
        const optionEl = document.createElement('option');
        optionEl.value = opt.valor;
        optionEl.dataset.base = opt.base; // Guarda la base mínima en el elemento
        optionEl.textContent = opt.texto;
        selectConcepto.appendChild(optionEl);
    });
}

// 4. Lógica de Cálculo que verifica la Base Mínima
function calcularRetencion(event) {
    event.preventDefault();

    const montoBase = parseFloat(document.getElementById('montoBase').value);
    const selectConcepto = document.getElementById('tipoConcepto');
    const tarifa = parseFloat(selectConcepto.value);
    
    // Obtener la base mínima guardada en la opción seleccionada
    const optionSeleccionada = selectConcepto.options[selectConcepto.selectedIndex];
    const baseMinima = parseFloat(optionSeleccionada.dataset.base || 0);

    if (isNaN(montoBase) || montoBase <= 0) {
        alert('Por favor ingresa un monto válido.');
        return;
    }

    const formatoMoneda = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    });

    let valorRetencion = 0;
    let mensajeBase = '';

    // Validación de la base mínima según la normativa colombiana
    if (montoBase < baseMinima) {
        valorRetencion = 0;
        mensajeBase = ` (No aplica retención por estar por debajo de la base mínima de ${formatoMoneda.format(baseMinima)})`;
    } else {
        valorRetencion = montoBase * tarifa;
    }

    const valorNeto = montoBase - valorRetencion;
    const porcentajeTexto = (tarifa * 100).toFixed(1) + '%';

    document.getElementById('resBase').innerText = formatoMoneda.format(montoBase);
    document.getElementById('resTarifa').innerText = porcentajeTexto + mensajeBase;
    document.getElementById('resRetencion').innerText = formatoMoneda.format(valorRetencion);
    document.getElementById('resNeto').innerText = formatoMoneda.format(valorNeto);

    document.getElementById('resultadoSimulador').style.display = 'block';
}

// Ejecutar al cargar para inicializar las opciones con Persona Jurídica
document.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('tipoPersona')) {
        actualizarOpcionesConcepto();
    }
});
// Toggle del menú desplegable en celular
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

function cerrarMenu() {
    if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
    }
}
// ==========================================
// LÓGICA DEL CHATBOT DE INTELIGENCIA ARTIFICIAL
// ==========================================

// Función para abrir y cerrar la ventana del chatbot
function toggleChatbot() {
    const box = document.getElementById('chatbotBox');
    if (box) {
        if (box.style.display === 'none' || box.style.display === '') {
            box.style.display = 'flex';
        } else {
            box.style.display = 'none';
        }
    }
}

// Permitir enviar mensaje presionando la tecla "Enter"
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        enviarMensajeIA();
    }
}

// Función principal para enviar y responder mensajes en tiempo real
function enviarMensajeIA() {
    const input = document.getElementById('userInput');
    if (!input) return;

    const mensajeOriginal = input.value.trim();
    const mensaje = mensajeOriginal.toLowerCase();
    const chatContainer = document.getElementById('chatMessages');

    if (!mensaje) return;

    // 1. Mostrar el mensaje escrito por el usuario en el chat
    const userDiv = document.createElement('p');
    userDiv.className = 'user-msg';
    userDiv.innerText = mensajeOriginal;
    chatContainer.appendChild(userDiv);

    // Limpiar la casilla de entrada
    input.value = '';

    // Desplazar scroll hacia abajo automáticamente
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // 2. Respuesta simulada de la Inteligencia Artificial
    setTimeout(() => {
        const botDiv = document.createElement('p');
        botDiv.className = 'bot-msg';

        if (mensaje.includes('smlmv') || mensaje.includes('salario') || mensaje.includes('minimo')) {
            botDiv.innerText = 'El Salario Mínimo Legal Vigente (SMLMV) para 2026 en Colombia es de $1.750.905.';
        } else if (mensaje.includes('uvt')) {
            botDiv.innerText = 'La Unidad de Valor Tributario (UVT) oficial para 2026 es de $52.374 COP.';
        } else if (mensaje.includes('retefuente') || mensaje.includes('retencion') || mensaje.includes('calcular') || mensaje.includes('simulador')) {
            botDiv.innerText = 'Puedes usar nuestro Simulador Tributario en la sección "Simulador" para calcular de forma exacta tu retención en la fuente según tu perfil.';
        } else if (mensaje.includes('hola') || mensaje.includes('buenas') || mensaje.includes('buenos dias') || mensaje.includes('buenas noches')) {
            botDiv.innerText = '¡Hola! Soy tu asistente de Inteligencia Artificial Contable de ML Finance & Tax. ¿En qué duda financiera o tributaria te puedo colaborar hoy?';
        } else if (mensaje.includes('servicio') || mensaje.includes('asesoria') || mensaje.includes('contacto') || mensaje.includes('telefono')) {
            botDiv.innerText = 'Ofrecemos gestión de nómina, impuestos y estados financieros. ¡Escríbenos en la sección de contacto o directamente al WhatsApp +57 304 546 7957!';
        } else if (mensaje.includes('gracias') || mensaje.includes('chao') || mensaje.includes('adios')) {
            botDiv.innerText = '¡Con mucho gusto! Estoy siempre disponible para resolver tus inquietudes contables y tributarias.';
        } else {
            botDiv.innerText = 'Para consultas más específicas de tu empresa o declaración, te invitamos a dejarnos tus datos en el formulario de contacto o escribirnos al WhatsApp +57 304 546 7957.';
        }

        chatContainer.appendChild(botDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 400);
}
// DETALLE DE SERVICIOS EN VENTANA EMERGENTE (MODAL)
const detallesServicios = {
    salud: {
        titulo: "📊 Diagnóstico de Salud Financiera",
        pasos: `
            <p><strong>¿Qué debemos hacer primero?</strong> Realizamos un escaneo de los estados financieros de tu empresa para evaluar liquidez y endeudamiento.</p>
            <p><strong>¿Cómo sucede el proceso?</strong></p>
            <ul>
                <li><strong>Paso 1:</strong> Recopilación de balances y flujo de caja actual.</li>
                <li><strong>Paso 2:</strong> Cálculo de indicadores de rentabilidad y margen operativo.</li>
                <li><strong>Paso 3:</strong> Entrega de informe ejecutivo con recomendaciones de optimización.</li>
            </ul>
        `,
        mensajeWpp: "Hola Mariana, me interesa un Diagnóstico de Salud Financiera para mi empresa."
    },
    tributaria: {
        titulo: "📄 Planeación y Asesoría Tributaria",
        pasos: `
            <p><strong>¿Qué debemos hacer primero?</strong> Revisamos la carga impositiva y el calendario fiscal para evitar sanciones y pagos en exceso.</p>
            <p><strong>¿Cómo sucede el proceso?</strong></p>
            <ul>
                <li><strong>Paso 1:</strong> Revisión de retenciones en la fuente e IVA aplicado.</li>
                <li><strong>Paso 2:</strong> Proyección tributaria bajo normativa 2026 (UVT $52.374).</li>
                <li><strong>Paso 3:</strong> Aplicación de deducciones legales y beneficios fiscales.</li>
            </ul>
        `,
        mensajeWpp: "Hola Mariana, requiero asesoría en Planeación Tributaria para mi empresa."
    },
    simuladores: {
        titulo: "💻 Simuladores Financieros e IA",
        pasos: `
            <p><strong>¿Qué debemos hacer primero?</strong> Implementamos herramientas digitales a la medida para calcular proyecciones en tiempo real.</p>
            <p><strong>¿Cómo sucede el proceso?</strong></p>
            <ul>
                <li><strong>Paso 1:</strong> Identificación de variables financieras claves de tu negocio.</li>
                <li><strong>Paso 2:</strong> Parametrización de algoritmos de cálculo automático.</li>
                <li><strong>Paso 3:</strong> Capacitación en el uso de simuladores para toma de decisiones.</li>
            </ul>
        `,
        mensajeWpp: "Hola Mariana, quiero información sobre las herramientas digitales y simuladores."
    }
};

function verDetalleServicio(tipo) {
    const modal = document.getElementById('serviceModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');
    const btnWpp = document.getElementById('modalWppBtn');

    if (detallesServicios[tipo]) {
        title.innerText = detallesServicios[tipo].titulo;
        body.innerHTML = detallesServicios[tipo].pasos;
        btnWpp.href = `https://wa.me/573045467957?text=${encodeURIComponent(detallesServicios[tipo].mensajeWpp)}`;
        modal.style.display = 'flex';
    }
}

function cerrarModal() {
    const modal = document.getElementById('serviceModal');
    if (modal) {
        modal.style.display = 'none';
    }
}
// LÓGICA DEL PANEL ADMIN
function loginAdmin() {
    const user = document.getElementById('adminUser').value.trim();
    const pass = document.getElementById('adminPass').value.trim();
    const errorMsg = document.getElementById('loginError');
    const loginForm = document.getElementById('adminLoginForm');
    const dashboard = document.getElementById('adminDashboard');

    // Credenciales de acceso simuladas
    if ((user === 'admin' || user === 'admin@mlfinance.com') && pass === '1234') {
        errorMsg.style.display = 'none';
        loginForm.style.display = 'none';
        dashboard.style.display = 'block';
    } else {
        errorMsg.style.display = 'block';
    }
}

function logoutAdmin() {
    document.getElementById('adminLoginForm').style.display = 'block';
    document.getElementById('adminDashboard').style.display = 'none';
    document.getElementById('adminUser').value = '';
    document.getElementById('adminPass').value = '';
}
