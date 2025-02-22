
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TOGETHER_API_KEY = Deno.env.get('TOGETHER_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { description } = await req.json();

    const response = await fetch('https://api.together.xyz/inference', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-2-70b-chat-hf",
        prompt: `<s>[INST] <<SYS>>
You are an expert game developer who specializes in building web apps. Your job is to create a high-fidelity interactive and responsive working game.

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

Remember: you love your users and want them to be happy. The more complete and impressive your game, the happier they will be. You are evaluated on 1) whether your game resembles the instructions, 2) whether your game is playable, interactive, and responsive, and 3) whether your game is complete and impressive.
<</SYS>>

Create a game with this description: ${description}[/INST]`,
        temperature: 0.7,
        top_p: 0.7,
        max_tokens: 4000,
        stop: ["</s>"]
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate game');
    }

    const data = await response.json();
    return new Response(JSON.stringify({ gameCode: data.output.content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
