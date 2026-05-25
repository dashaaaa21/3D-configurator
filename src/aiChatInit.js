let conversationHistory = [];

function initAiChat() {
    const chatBtn = document.getElementById('ai-chat-btn');
    const chatContainer = document.getElementById('ai-chat-container');
    const closeBtn = document.getElementById('ai-chat-close');
    const sendBtn = document.getElementById('ai-send');
    const input = document.getElementById('ai-input');
    const messagesContainer = document.getElementById('ai-messages');
    
    if (!chatBtn || !chatContainer) {
        return;
    }
    
    chatBtn.addEventListener('click', () => {
        chatContainer.classList.toggle('active');
        if (chatContainer.classList.contains('active')) {
            chatBtn.classList.add('hidden');
        }
    });
    
    closeBtn.addEventListener('click', () => {
        chatContainer.classList.remove('active');
        chatBtn.classList.remove('hidden');
    });
    
    sendBtn.addEventListener('click', () => {
        sendMessage();
    });
    
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    addMessage('Hello! I will help you choose the perfect color and style for your model. Tell me what you like!', 'ai');
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
    
    if (!message) {
        return;
    }
    
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
            addMessage('Sorry, an error occurred. Please try again.', 'ai');
        }
    } catch (error) {
        addMessage('Failed to connect to AI. Please check your connection.', 'ai');
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
    console.log('applyConfiguration called with:', config);
    if (config.color) {
        const event = new CustomEvent('ai-color-change', {
            detail: { color: config.color }
        });
        console.log('Dispatching ai-color-change event');
        window.dispatchEvent(event);
    }
}

function showConfigurationCard(config) {
    const messagesContainer = document.getElementById('ai-messages');
    const configCard = document.createElement('div');
    configCard.className = 'ai-config-card';
    
    configCard.innerHTML = `
        <div class="config-header">Generated Configuration</div>
        <div class="config-item">
            <span class="config-label">Color:</span>
            <div class="config-value">
                <span class="color-preview" style="background: ${config.color}"></span>
                ${config.color}
            </div>
        </div>
        ${config.material ? `
            <div class="config-item">
                <span class="config-label">Material:</span>
                <span class="config-value">${config.material}</span>
            </div>
        ` : ''}
        ${config.style ? `
            <div class="config-item">
                <span class="config-label">Style:</span>
                <span class="config-value">${config.style}</span>
            </div>
        ` : ''}
        <button class="config-apply-btn" onclick="window.applyAiConfigFromCard('${config.color}', '${config.material}', '${config.style}')">
            Apply to Model
        </button>
    `;
    
    messagesContainer.appendChild(configCard);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

window.applyAiConfigFromCard = function(color, material, style) {
    const config = { color, material, style };
    applyConfiguration(config);
    addMessage(`Configuration applied! Color: ${color}`, 'ai');
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAiChat);
} else {
    initAiChat();
}

export { initAiChat };
