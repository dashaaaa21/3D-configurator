const groq = require('../config/groq');

exports.colorStyleChat = async (req, res) => {
    try {
        const { message, conversationHistory = [] } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Message cannot be empty'
            });
        }

        const messages = [
            {
                role: "system",
                content: `You are an expert designer for a 3D configurator. Your task is to help users choose colors and styles for their 3D models.

When a user describes what they want, you:
1. Ask clarifying questions about their preferences
2. Suggest specific colors (in HEX format)
3. Recommend styles and materials
4. Give advice on color combinations

If the user is ready for a final configuration, respond in this format:
CONFIG: {"color": "#HEXCODE", "material": "name", "style": "style"}

Material examples: glossy, matte, metallic
Style examples: modern, classic, minimalist, futuristic

Communicate in English, friendly and professionally.`
            },
            ...conversationHistory,
            {
                role: "user",
                content: message
            }
        ];

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages,
            temperature: 0.8,
            max_tokens: 500
        });

        const reply = completion.choices[0].message.content;
        
        let configuration = null;
        let cleanReply = reply;
        
        const configMatch = reply.match(/CONFIG:\s*(\{[^}]+\})/);
        if (configMatch) {
            try {
                configuration = JSON.parse(configMatch[1]);
                cleanReply = reply.replace(/CONFIG:\s*\{[^}]+\}/, '').trim();
            } catch (e) {
                console.error('Failed to parse configuration:', e);
            }
        }

        res.json({
            success: true,
            reply: cleanReply,
            configuration,
            conversationHistory: [
                ...conversationHistory,
                { role: "user", content: message },
                { role: "assistant", content: reply }
            ]
        });

    } catch (error) {
        console.error('AI Chat Error:', error);
        res.status(500).json({
            success: false,
            message: 'AI assistant error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
