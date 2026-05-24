let conversationHistory = [];
let currentChatContainer = null;

export function createAiChat() {
    console.log('💬 Creating AI Chat container...');
    const chatContainer = document.createElement('div');
    chatContainer.className = 'ai-chat-container';
    chatContainer.innerHTML = `
        <div class="ai-chat-header">
            <h3>🎨 AI Дизайн Асистент</h3>
            <button class="ai-chat-close">&times;</button>
        </div>
        <div class="ai-chat-messages" id="ai-messages"></div>
        <div class="ai-chat-input-container">
            <input 
                type="text" 
                class="ai-chat-input" 
                id="ai-input" 
                placeholder="Опишіть колір або стиль який вам подобається..."
            />
            <button class="ai-chat-send" id="ai-send">➤</button>
        </div>
        <div class="ai-chat-loading hidden" id="ai-loading">
            <div class="loading-dots">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;

    currentChatContainer = chatContainer;
    
    const closeBtn = chatContainer.querySelector('.ai-chat-close');
    const sendBtn = chatContainer.querySelector('#ai-send');
    const input = chatContainer.querySelector('#ai-input');
    
    closeBtn.addEventListener('click', () => {
        chatContainer.classList.remove('active');
    });
    
    sendBtn.addEventListener('click', () => sendMessage());
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    addMessage('Привіт! 👋 Я допоможу тобі підібрати ідеальний колір та стиль для твоєї моделі. Розкажи, що тобі подобається?', 'ai');

    console.log('✅ AI Chat created:', chatContainer);
    return chatContainer;
}

function addMessage(text, sender = 'user') {
    const messagesContainer = document.getElementById('ai-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ai-message-${sender}`;
    
    const bubble = document.createElement('div');
    bubble.className = 'ai-message-bubble';
    bubble.textContent = text;
    
    messageDiv.appendChild(bubble);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function sendMessage() {
    const input = document.getElementById('ai-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    addMessage(message, 'user');
    input.value = '';
    
    showLoading(true);
    
    try {
        const response = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message,
                conversationHistory
            })
        });

        const data = await response.json();
        
        if (data.success) {
            addMessage(data.reply, 'ai');
            conversationHistory = data.conversationHistory;
            
            if (data.configuration) {
                applyConfiguration(data.configuration);
                showConfigurationCard(data.configuration);
            }
        } else {
            addMessage('Вибачте, виникла помилка. Спробуйте ще раз.', 'ai');
        }
    } catch (error) {
        console.error('Chat error:', error);
        addMessage('Не вдалося зв\'язатися з AI. Перевірте підключення.', 'ai');
    } finally {
        showLoading(false);
    }
}

function showLoading(show) {
    const loading = document.getElementById('ai-loading');
    if (show) {
        loading.classList.remove('hidden');
    } else {
        loading.classList.add('hidden');
    }
}

function applyConfiguration(config) {
    if (config.color) {
        const event = new CustomEvent('ai-color-change', {
            detail: { color: config.color }
        });
        window.dispatchEvent(event);
    }
    
    console.log('Застосовано конфігурацію:', config);
}

function showConfigurationCard(config) {
    const messagesContainer = document.getElementById('ai-messages');
    const configCard = document.createElement('div');
    configCard.className = 'ai-config-card';
    
    configCard.innerHTML = `
        <div class="config-header">✨ Згенерована конфігурація</div>
        <div class="config-item">
            <span class="config-label">Колір:</span>
            <div class="config-value">
                <span class="color-preview" style="background: ${config.color}"></span>
                ${config.color}
            </div>
        </div>
        ${config.material ? `
            <div class="config-item">
                <span class="config-label">Матеріал:</span>
                <span class="config-value">${config.material}</span>
            </div>
        ` : ''}
        ${config.style ? `
            <div class="config-item">
                <span class="config-label">Стиль:</span>
                <span class="config-value">${config.style}</span>
            </div>
        ` : ''}
        <button class="config-apply-btn" onclick="window.applyAiConfig(${JSON.stringify(config).replace(/"/g, '&quot;')})">
            Застосувати до моделі
        </button>
    `;
    
    messagesContainer.appendChild(configCard);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

window.applyAiConfig = function(config) {
    applyConfiguration(config);
    addMessage(`Конфігурацію застосовано! Колір: ${config.color}`, 'ai');
};

export function toggleAiChat() {
    if (currentChatContainer) {
        currentChatContainer.classList.toggle('active');
    }
}

export function clearChatHistory() {
    conversationHistory = [];
    const messagesContainer = document.getElementById('ai-messages');
    if (messagesContainer) {
        messagesContainer.innerHTML = '';
        addMessage('Історія очищена. Почнемо спочатку! Що тобі подобається?', 'ai');
    }
}
