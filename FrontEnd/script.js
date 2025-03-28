document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    const messageDiv = document.getElementById('message');
    const galleryDiv = document.getElementById('gallery');
    
    // Carrega a galeria quando a página é carregada
    loadGallery();
    
    // Configura o evento de submit do formulário
    uploadForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const description = document.getElementById('description').value;
        const imageFile = document.getElementById('image').files[0];
        
        if (!description || !imageFile) {
            showMessage('Por favor, preencha todos os campos', 'error');
            return;
        }
        
        const formData = new FormData();
        formData.append('alternativo', description);
        formData.append('foto', imageFile);
        
        try {
            const response = await fetch('http://localhost:3000/foto', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (response.status === 201) {
                showMessage('Imagem enviada com sucesso!', 'success');
                uploadForm.reset();
                loadGallery();
            } else {
                showMessage(result.mensagem || 'Erro ao enviar imagem', 'error');
            }
        } catch (error) {
            showMessage('Erro ao conectar com o servidor', 'error');
            console.error(error);
        }
    });
    
    // Função para carregar a galeria de imagens
    async function loadGallery() {
        try {
            const response = await fetch('http://localhost:3000/foto');
            const data = await response.json();
            
            galleryDiv.innerHTML = '';
            
            if (Array.isArray(data)) {
                data.forEach(item => {
                    const galleryItem = document.createElement('div');
                    galleryItem.className = 'gallery-item';
                    
                    galleryItem.innerHTML = `
                        <img src="http://localhost:3000/public/img/${item.caminho}" alt="${item.alternativo}">
                        <p>${item.alternativo}</p>
                        <div class="actions">
                            <button class="update-btn" data-id="${item.id_foto}">Editar</button>
                            <button class="delete-btn" data-id="${item.id_foto}">Excluir</button>
                        </div>
                    `;
                    
                    galleryDiv.appendChild(galleryItem);
                });
                
                // Adiciona eventos aos botões de excluir
                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', async function() {
                        const id = this.getAttribute('data-id');
                        if (confirm('Tem certeza que deseja excluir esta imagem?')) {
                            await deleteImage(id);
                            loadGallery();
                        }
                    });
                });
                
                // Adiciona eventos aos botões de editar
                document.querySelectorAll('.update-btn').forEach(button => {
                    button.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        const newDescription = prompt('Digite a nova descrição:');
                        if (newDescription !== null) {
                            updateImageDescription(id, newDescription);
                        }
                    });
                });
            } else {
                showMessage('Nenhuma imagem encontrada', 'error');
            }
        } catch (error) {
            showMessage('Erro ao carregar a galeria', 'error');
            console.error(error);
        }
    }
    
    // Função para excluir uma imagem
    async function deleteImage(id) {
        try {
            const response = await fetch(`http://localhost:3000/foto/${id}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (response.status === 200) {
                showMessage('Imagem excluída com sucesso!', 'success');
            } else {
                showMessage(result.mensagem || 'Erro ao excluir imagem', 'error');
            }
        } catch (error) {
            showMessage('Erro ao conectar com o servidor', 'error');
            console.error(error);
        }
    }
    
    // Função para atualizar a descrição de uma imagem
    async function updateImageDescription(id, newDescription) {
        try {
            const response = await fetch(`http://localhost:3000/foto/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ alternativo: newDescription })
            });
            
            const result = await response.json();
            
            if (response.status === 200) {
                showMessage('Descrição atualizada com sucesso!', 'success');
                loadGallery();
            } else {
                showMessage(result.mensagem || 'Erro ao atualizar descrição', 'error');
            }
        } catch (error) {
            showMessage('Erro ao conectar com o servidor', 'error');
            console.error(error);
        }
    }
    
    // Função para exibir mensagens
    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`;
        
        // Remove a mensagem após 5 segundos
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = 'message';
        }, 5000);
    }
});