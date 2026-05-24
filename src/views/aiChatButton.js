import { toggleAiChat } from './aiChat';

export function createAiChatButton() {
    console.log('🤖 Creating AI Chat Button...');
    const button = document.createElement('button');
    button.className = 'ai-chat-toggle-btn';
    button.innerHTML = '🤖';
    button.title = 'Відкрити AI асистента';
    
    button.addEventListener('click', () => {
        console.log('AI Chat button clicked!');
        toggleAiChat();
    });
    
    console.log('✅ AI Chat Button created:', button);
    return button;
}
