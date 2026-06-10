// main.js
// Scripts personalizados para SkillOnePoint

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM completamente cargado - SkillOnePoint");

    // ---- Lógica de Buscador en Tiempo Real (recursos.html) ----
    const searchInput = document.getElementById('searchInput');

    if (searchInput) {
        const folderSection = document.getElementById('folders-section');
        const sectionTitle = document.getElementById('files-section-title');
        const backBtn = document.getElementById('back-to-folders');
        const allFileCols = document.querySelectorAll('.file-col');

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim().replace(/\s+/g, ' ');

            if (searchTerm !== '') {
                // Modo búsqueda global: ocultar carpetas
                if (folderSection) folderSection.style.display = 'none';

                sectionTitle.innerText = "Resultados de Búsqueda";
                backBtn.style.display = 'inline-block'; // Permitir volver o reiniciar

                // Filtrar todas las columnas a nivel global
                allFileCols.forEach(col => {
                    const cardText = col.innerText.toLowerCase().replace(/\s+/g, ' ');

                    if (cardText.includes(searchTerm)) {
                        col.style.display = '';
                    } else {
                        col.style.display = 'none';
                    }
                });
            } else {
                // Si el usuario borra la búsqueda entera, simular un "Volver"
                backBtn.click();
            }
        });

        // ---- Lógica de Carpetas Interactivas ----
        const folderCards = document.querySelectorAll('.folder-card');

        if (folderCards.length > 0) {

            // Cuando se da click a una carpeta
            folderCards.forEach(folder => {
                folder.addEventListener('click', () => {
                    const targetId = folder.getAttribute('data-folder');
                    const title = folder.getAttribute('data-title');

                    // Mostrar sección de carpetas por si viene de una búsqueda
                    if (folderSection) folderSection.style.display = '';

                    // Ocultar TODOS los archivos
                    allFileCols.forEach(col => col.style.display = 'none');

                    // Mostrar SOLO los del folder específico
                    const targetCols = document.querySelectorAll('.folder-' + targetId);
                    targetCols.forEach(col => col.style.display = '');

                    // Actualizar UI
                    sectionTitle.innerText = title;
                    backBtn.style.display = 'inline-block';

                    // Limpiar buscador sin disparar evento input recursivo
                    searchInput.value = '';

                    document.getElementById('files-section-title').scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
            });

            // Volver atrás (a recientes o reiniciar búsqueda)
            backBtn.addEventListener('click', (e) => {
                if (e) e.preventDefault();

                // Limpiar buscador
                searchInput.value = '';

                // Restaurar área superior
                if (folderSection) folderSection.style.display = '';

                // Restablecer la vista a los "Recientes"
                allFileCols.forEach(col => col.style.display = 'none');
                document.querySelectorAll('.default-recent').forEach(col => col.style.display = '');

                sectionTitle.innerText = "Documentos Recientes";
                backBtn.style.display = 'none';
            });
        }
    }

    // ---- Lógica de Buscador en Tiempo Real (instancias.html) ----
    const instanciaSearchInput = document.getElementById('instanciaSearchInput');

    if (instanciaSearchInput) {
        const instanciaCols = document.querySelectorAll('.instancia-col');
        const noResults = document.getElementById('instancias-no-results');

        instanciaSearchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim().replace(/\s+/g, ' ');
            let visibleCount = 0;

            instanciaCols.forEach(col => {
                const name = (col.getAttribute('data-name') || '').toLowerCase();
                const matches = searchTerm === '' || name.includes(searchTerm);
                col.style.display = matches ? '' : 'none';
                if (matches) visibleCount++;
            });

            if (noResults) {
                noResults.style.display = visibleCount === 0 ? 'block' : 'none';
            }
        });
    }


    // ---- Lógica de Filtrado por Categoría + Búsqueda de Videos (videotutoriales.html) ----
    const videoSearchInput = document.getElementById('videoSearchInput');
    const filterButtonsContainer = document.getElementById('filter-buttons');

    if (filterButtonsContainer) {
        const videoCols = document.querySelectorAll('.video-col');
        const filterBtns = filterButtonsContainer.querySelectorAll('button[data-filter]');
        let activeFilter = 'todos'; // Categoría activa

        // Función central: aplica categoría Y búsqueda juntas
        function applyVideoFilters() {
            const searchTerm = videoSearchInput
                ? videoSearchInput.value.toLowerCase().trim().replace(/\s+/g, ' ')
                : '';

            videoCols.forEach(col => {
                const category = col.getAttribute('data-category') || 'sin-categoria';
                const cardText = col.innerText.toLowerCase().replace(/\s+/g, ' ');

                const matchesCategory = activeFilter === 'todos' || category === activeFilter;
                const matchesSearch = searchTerm === '' || cardText.includes(searchTerm);

                col.style.display = (matchesCategory && matchesSearch) ? '' : 'none';
            });
        }

        // Eventos de los botones de filtro
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Actualizar estado visual de botones
                filterBtns.forEach(b => {
                    b.classList.remove('btn-custom', 'active');
                    b.classList.add('btn-outline-light');
                });
                btn.classList.remove('btn-outline-light');
                btn.classList.add('btn-custom', 'active');

                activeFilter = btn.getAttribute('data-filter');
                applyVideoFilters();
            });
        });

        // Búsqueda en tiempo real respeta el filtro activo
        if (videoSearchInput) {
            videoSearchInput.addEventListener('input', applyVideoFilters);
        }
    }

    // ---- Lógica de Modal de Equipo (index.html) ----
    const teamModal = document.getElementById('teamModal');
    if (teamModal) {
        teamModal.addEventListener('show.bs.modal', function (event) {
            const card = event.relatedTarget;
            const name = card.getAttribute('data-name');
            const role = card.getAttribute('data-role');
            const servicesHTML = card.getAttribute('data-services');

            document.getElementById('modalTeamName').textContent = name;
            document.getElementById('modalTeamRole').textContent = role;
            document.getElementById('modalTeamServices').innerHTML = servicesHTML;
        });
    }

    // ---- Lógica de Auto-reproducción de Modal de Video (videotutoriales.html) ----
    const videoModal = document.getElementById('videoModal');
    if (videoModal) {
        const videoPlayer = document.getElementById('videoPlayer');

        // Al abrir el modal, se inyecta la URL del video del botón seleccionado
        videoModal.addEventListener('show.bs.modal', function (event) {
            const card = event.relatedTarget;
            const videoSrc = card.getAttribute('data-video-src');
            videoPlayer.src = videoSrc;
        });

        // Al cerrar el modal, limpiar la URL corta de inmediato el stream de YouTube (evita bug de audio oculto)
        videoModal.addEventListener('hidden.bs.modal', function () {
            videoPlayer.src = '';
        });
    }
});
