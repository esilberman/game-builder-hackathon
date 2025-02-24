
import { Together } from "together-ai";

type AIResult = { 
    content: string;
    time: number;
};

const TOGETHER_API_KEY = import.meta.env.VITE_TOGETHER_API_KEY;
const model = "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free";
//"deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free";

const systemPrompt = `You are an expert game developer who specializes in building web apps. Your job is to create a high-fidelity interactive and responsive working game.

- Respond with a single HTML file containing the entire game. 
- Put any JavaScript in a script tag with type="module".
- Use Google fonts to pull in any open source fonts you require.
- Load image assets from Unsplash or use shapes as placeholders.
- Dependencies are strictly prohibited.
- Make the game full bleed as large as possible within the window without cutting off key initial content without scrolling.
- Never use alert.
- Make the game usable on all browsers and devices.

If there are any questions or underspecified features, use what you know about applications, user experience, and website design patterns to "fill in the blanks".

Your game should look and feel much more complete and advanced than the instructions provided. Make the game fully playable.

Remember: you love your users and want them to be happy. The more complete and impressive your game, the happier they will be. You are evaluated on 1) whether your game resembles the instructions, 2) whether your game is playable, interactive, and responsive, and 3) whether your game is complete and impressive.`;

export const generateAICode = async (prompt: string): Promise<AIResult> => {
    const startTime = Date.now();

    if (!TOGETHER_API_KEY) {
        console.error('No API key provided for Together.ai');
        throw new Error('No API key provided for Together.ai');
    }

    const together = new Together({ apiKey: TOGETHER_API_KEY });
    console.log('Initialized Together.ai provider with:', {
        model: model,
        hasApiKey: !!TOGETHER_API_KEY,
    });

    const id = crypto.randomUUID();
    console.log('Sending code generation request:', {
        id,
        prompt: prompt,
        system: systemPrompt,
    });

    const stream = await together.chat.completions.create({
        model: model,
        messages: [{
            role: 'system', 
            content: systemPrompt,
        },
        { 
            role: 'user', 
            content: prompt,
        }],
        stream: true,
        max_tokens: 4000,
        temperature: 0.7,
    });

    let accumulatedContent = '';
    for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        accumulatedContent += content;
        if (content) {
            console.log(content);
        }
    }

    const endTime = Date.now();
    const executionTime = endTime - startTime;
    console.log('\nCode generation complete after ' + executionTime/1000 + ' sec');
    
    return {
        content: accumulatedContent,
        time: executionTime,
    };
};
