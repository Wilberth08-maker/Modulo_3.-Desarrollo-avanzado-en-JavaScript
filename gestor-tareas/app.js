document.addEventListener('DOMContentLoaded', () => {
    // --- Modo Oscuro/Claro ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Cargar el tema guardado en localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.remove('light-mode', 'dark-mode'); // Asegurarse de remover clases viejas
        body.classList.add(savedTheme);
    } else {
        // Si no hay tema guardado, establecer light-mode por defecto
        body.classList.add('light-mode');
        localStorage.setItem('theme', 'light-mode');
    }

    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('light-mode')) {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark-mode');
        } else {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            localStorage.setItem('theme', 'light-mode');
        }
    });

    // Función para generar un ID único para las tarjetas
    const generateUniqueId = () => {
        return 'card-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    };

    // --- Función para crear un elemento de tarjeta con fecha y prioridad ---
    const createCardElement = (text, cardId, creationDate, priority) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-card-id', cardId);
        card.setAttribute('data-priority', priority); // Guardar prioridad como atributo de datos

        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.textContent = text;
        card.appendChild(cardText);

        const cardMeta = document.createElement('div');
        cardMeta.classList.add('card-meta');

        const dateSpan = document.createElement('span');
        dateSpan.classList.add('card-date');
        // Formatear la fecha para que sea legible (ej: "27/5/2024, 10:30:00")
        dateSpan.textContent = `Creada: ${new Date(creationDate).toLocaleString()}`;
        cardMeta.appendChild(dateSpan);

        const prioritySpan = document.createElement('span');
        prioritySpan.classList.add('card-priority', `priority-${priority.toLowerCase()}`);
        prioritySpan.textContent = priority;
        cardMeta.appendChild(prioritySpan);

        card.appendChild(cardMeta); // Añadir los metadatos a la tarjeta

        const cardActions = document.createElement('div');
        cardActions.classList.add('card-actions');

        const editButton = document.createElement('button');
        editButton.classList.add('edit-card-btn');
        editButton.textContent = 'Editar';
        cardActions.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-card-btn');
        deleteButton.textContent = 'Borrar';
        cardActions.appendChild(deleteButton);

        card.appendChild(cardActions);
        return card;
    };

    // --- Inicializar tarjetas existentes (las de ejemplo del HTML) ---
    // Recorrer las tarjetas de ejemplo para asegurarse de que tengan el formato completo
    document.querySelectorAll('.card').forEach(cardElement => {
        const cardText = cardElement.querySelector('.card-text').textContent;
        const cardId = cardElement.getAttribute('data-card-id');
        let creationDate = cardElement.querySelector('.card-date') ? new Date(cardElement.querySelector('.card-date').textContent.replace('Creada: ', '')).toISOString() : new Date().toISOString();
        let priority = cardElement.getAttribute('data-priority') || 'Media'; // Asignar 'Media' si no hay prioridad

        // Remover contenido existente y recrear con el nuevo formato completo
        cardElement.innerHTML = ''; // Limpiar el contenido actual
        const newCardContent = createCardElement(cardText, cardId, creationDate, priority);

        // Mover los hijos de newCardContent a cardElement
        Array.from(newCardContent.children).forEach(child => {
            cardElement.appendChild(child.cloneNode(true));
        });
        // Asegurarse de que los data attributes estén correctos
        cardElement.setAttribute('data-priority', priority);
        cardElement.setAttribute('data-card-id', cardId); // En caso de que se haya perdido
    });


    // --- Manejo de la adición de tarjetas ---
    document.querySelectorAll('.add-card-btn').forEach(button => {
        button.addEventListener('click', () => {
            const addCardArea = button.closest('.add-card-area');
            addCardArea.querySelector('.add-card-btn').classList.add('hidden');
            addCardArea.querySelector('.add-card-form').classList.remove('hidden');
            addCardArea.querySelector('.add-card-textarea').focus();
        });
    });

    document.querySelectorAll('.add-card-cancel').forEach(button => {
        button.addEventListener('click', () => {
            const addCardArea = button.closest('.add-card-area');
            addCardArea.querySelector('.add-card-btn').classList.remove('hidden');
            addCardArea.querySelector('.add-card-form').classList.add('hidden');
            addCardArea.querySelector('.add-card-textarea').value = ''; // Limpiar el textarea
            addCardArea.querySelector('.add-card-priority-select').value = 'Media'; // Resetear prioridad
        });
    });

    document.querySelectorAll('.add-card-confirm').forEach(button => {
        button.addEventListener('click', () => {
            const addCardArea = button.closest('.add-card-area');
            const textarea = addCardArea.querySelector('.add-card-textarea');
            const cardText = textarea.value.trim();
            const prioritySelect = addCardArea.querySelector('.add-card-priority-select');
            const selectedPriority = prioritySelect.value;

            if (cardText) {
                const cardsContainer = addCardArea.closest('.list').querySelector('.cards-container');
                const newCardId = generateUniqueId();
                const creationTime = new Date().toISOString(); // Fecha y hora actual en formato ISO 8601
                const newCardElement = createCardElement(cardText, newCardId, creationTime, selectedPriority);
                cardsContainer.appendChild(newCardElement);
                textarea.value = '';
                prioritySelect.value = 'Media'; // Resetear prioridad
                addCardArea.querySelector('.add-card-btn').classList.remove('hidden');
                addCardArea.querySelector('.add-card-form').classList.add('hidden');

                sortCardsInList(cardsContainer.closest('.list')); // Ordenar la lista después de añadir
            } else {
                alert('El título de la tarjeta no puede estar vacío.');
            }
        });
    });

    // --- Manejo de la edición y borrado de tarjetas (Delegación de eventos) ---
    document.querySelector('.board-container').addEventListener('click', (event) => {
        // Borrar tarjeta
        if (event.target.classList.contains('delete-card-btn')) {
            const cardToDelete = event.target.closest('.card');
            if (confirm('¿Estás seguro de que quieres borrar esta tarjeta?')) {
                cardToDelete.remove();
            }
        }

        // Editar tarjeta
        if (event.target.classList.contains('edit-card-btn')) {
            const card = event.target.closest('.card');
            const cardTextElement = card.querySelector('.card-text');
            const cardMetaElement = card.querySelector('.card-meta');
            const currentText = cardTextElement.textContent;
            const currentPriority = card.getAttribute('data-priority');

            // Ocultar acciones mientras se edita
            card.querySelector('.card-actions').classList.add('hidden');
            cardMetaElement.classList.add('hidden'); // Ocultar metadatos también

            // Crear un input para edición del texto
            const editTextInput = document.createElement('input');
            editTextInput.type = 'text';
            editTextInput.classList.add('card-edit-input');
            editTextInput.value = currentText;

            // Crear un select para edición de prioridad
            const editPrioritySelect = document.createElement('select');
            editPrioritySelect.classList.add('card-edit-input'); // Reutilizamos el estilo
            editPrioritySelect.innerHTML = `
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
            `;
            editPrioritySelect.value = currentPriority;

            // Contenedor para los campos de edición y botones de guardar/cancelar
            const editForm = document.createElement('div');
            editForm.classList.add('add-card-form'); // Reutilizamos estilos de formulario
            editForm.style.boxShadow = 'none'; // No queremos la sombra en este caso
            editForm.style.marginBottom = '0'; // Eliminar margen inferior extra

            const buttonsContainer = document.createElement('div');
            buttonsContainer.style.display = 'flex';
            buttonsContainer.style.gap = '8px';
            buttonsContainer.style.marginTop = '8px';


            const saveButton = document.createElement('button');
            saveButton.classList.add('add-card-confirm');
            saveButton.textContent = 'Guardar';

            const cancelEditButton = document.createElement('button');
            cancelEditButton.classList.add('add-card-cancel');
            cancelEditButton.textContent = 'X';

            buttonsContainer.appendChild(saveButton);
            buttonsContainer.appendChild(cancelEditButton);


            editForm.appendChild(editTextInput);
            editForm.appendChild(editPrioritySelect);
            editForm.appendChild(buttonsContainer);


            cardTextElement.replaceWith(editForm);
            editTextInput.focus();

            const saveChanges = () => {
                const newText = editTextInput.value.trim();
                const newPriority = editPrioritySelect.value;

                if (newText) {
                    cardTextElement.textContent = newText;
                    card.setAttribute('data-priority', newPriority);
                    // Actualizar el span de prioridad
                    const prioritySpan = card.querySelector('.card-priority');
                    prioritySpan.textContent = newPriority;
                    prioritySpan.className = ''; // Limpiar clases existentes
                    prioritySpan.classList.add('card-priority', `priority-${newPriority.toLowerCase()}`);
                } else {
                    cardTextElement.textContent = currentText; // Volver al original si está vacío
                }
                editForm.replaceWith(cardTextElement);
                card.querySelector('.card-actions').classList.remove('hidden'); // Mostrar acciones de nuevo
                cardMetaElement.classList.remove('hidden'); // Mostrar metadatos de nuevo
                sortCardsInList(card.closest('.list')); // Reordenar después de editar
            };

            saveButton.addEventListener('click', saveChanges);

            cancelEditButton.addEventListener('click', () => {
                editForm.replaceWith(cardTextElement);
                card.querySelector('.card-actions').classList.remove('hidden'); // Mostrar acciones de nuevo
                cardMetaElement.classList.remove('hidden'); // Mostrar metadatos de nuevo
            });

            editTextInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault(); // Evitar salto de línea en input
                    saveChanges();
                } else if (e.key === 'Escape') {
                    editForm.replaceWith(cardTextElement);
                    card.querySelector('.card-actions').classList.remove('hidden');
                    cardMetaElement.classList.remove('hidden');
                }
            });
        }
    });

    // --- Ordenamiento de Tarjetas por Prioridad ---
    const priorityOrder = {
        'Alta': 1,
        'Media': 2,
        'Baja': 3
    };

    const sortCardsInList = (listElement) => {
        const cardsContainer = listElement.querySelector('.cards-container');
        const cards = Array.from(cardsContainer.querySelectorAll('.card'));

        cards.sort((a, b) => {
            const priorityA = a.getAttribute('data-priority');
            const priorityB = b.getAttribute('data-priority');

            return priorityOrder[priorityA] - priorityOrder[priorityB];
        });

        // Volver a añadir las tarjetas en el orden correcto
        cards.forEach(card => cardsContainer.appendChild(card));
    };

    // Ordenar todas las listas al cargar la página
    document.querySelectorAll('.list').forEach(list => {
        sortCardsInList(list);
    });

    // --- Inicialización de SortableJS para arrastrar y soltar tarjetas ---
    document.querySelectorAll('.cards-container').forEach(container => {
        new Sortable(container, {
            group: 'shared', // Permite arrastrar entre diferentes listas
            animation: 150, // Duración de la animación en ms
            ghostClass: 'sortable-ghost', // Clase CSS aplicada al elemento "fantasma" que sigue el ratón
            chosenClass: 'sortable-chosen', // Clase CSS aplicada al elemento que se está arrastrando
            dragClass: 'sortable-drag', // Clase CSS aplicada al elemento arrastrado

            // Eventos para ordenar las tarjetas después de moverlas
            onEnd: function (evt) {
                // `evt.from` es la lista de origen
                // `evt.to` es la lista de destino
                // `evt.item` es el elemento que se movió

                // Si se movió dentro de la misma lista o a una lista diferente,
                // reordenar ambas listas involucradas.
                if (evt.from !== evt.to) {
                    sortCardsInList(evt.from.closest('.list')); // Reordenar lista de origen
                }
                sortCardsInList(evt.to.closest('.list')); // Reordenar lista de destino
            }
        });
    });
}); // Cierre de document.addEventListener('DOMContentLoaded', ...