// Esta es la URL de la API de SharePoint que te da el archivo limpio de forma directa:
const urlDatos = "datos.json";

async function cargarTablero() {
    try {
        // 1. Ir a buscar el archivo JSON generado por el flujo
        const respuesta = await fetch(urlDatos);
        
        if (!respuesta.ok) {
            throw new Error(`No se pudo leer el archivo JSON. Estado: ${respuesta.status}`);
        }

        // 2. Convertir el archivo de texto a datos legibles por JavaScript
        const datos = await respuesta.json();
        
        // 3. Enviar los datos a la función que los dibuja en la pantalla
        renderizarTabla(datos);

    } catch (error) {
        console.error("Error al cargar el tablero:", error);
        const loadingEl = document.getElementById('loading');
        if (loadingEl) {
            loadingEl.innerText = "Error al cargar los datos del servidor.";
            loadingEl.style.color = "red";
        }
    }
}

function renderizarTabla(items) {
    const contenedor = document.getElementById('contenedor-filas');
    
    // Validar que el contenedor exista en el HTML para evitar errores
    if (!contenedor) return; 
    
    contenedor.innerHTML = ""; // Limpiar cualquier fila vieja o de prueba

    // Si el archivo JSON está vacío
    if (!items || items.length === 0) {
        contenedor.innerHTML = "<tr><td colspan='3' style='text-align:center;'>No hay registros disponibles en la lista.</td></tr>";
        return;
    }

    // 4. Recorrer los registros y crear las filas dinámicamente
    items.forEach(item => {
        const fila = document.createElement('tr');
        
        // IMPORTANTE: Recuerda que los nombres después de 'item.' (como ID, Titulo, Estado) 
        // deben ser EXACTAMENTE las mismas "Claves" que escribiste a la izquierda en tu acción 'Seleccionar'.
        fila.innerHTML = `
            <td>${item.ID || 'N/A'}</td>
            <td>${item.Nombre_curso || 'Sin Nombre_curso'}</td>
            <td>${item.Clave_banner || 'Sin Clave_banner'}</td>
            <td>${item.Tipo_solicitud || 'Sin Tipo_solicitud'}</td>
            <td>${item.Tipo_producto || 'Sin Tipo_producto'}</td>
            <td>${item.Cliente_tipo || 'Sin Cliente_tipo'}</td>
            <td>${item.Solicitante || 'Sin Solicitante'}</td>
            <td>${item.Fecha_solicitud || 'Sin Fecha_solicitud'}</td>
            <td>${item.Prioridad || 'Sin Prioridad'}</td>
            <td>${item.Estatus_solicitud || 'Sin Estatus_solicitud'}</td>
        `;
        contenedor.appendChild(fila);
    });

    // 5. Ocultar el mensaje de "Cargando..." y mostrar la tabla
    const loadingEl = document.getElementById('loading');
    const tablaEl = document.getElementById('tabla-datos');
    
    if (loadingEl) loadingEl.style.display = 'none';
    if (tablaEl) tablaEl.style.display = 'table';
}

// Arrancar el código automáticamente en cuanto el navegador abra el HTML
document.addEventListener('DOMContentLoaded', cargarTablero);