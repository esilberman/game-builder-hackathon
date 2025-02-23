import { fal } from "@fal-ai/client";

type AIRequest = {
    text: string;
    image: string;
    image_size: number;
}

interface generateImageProps {
    req: AIRequest;
}

type AIResult = { url: string }

let isConfigured = false;
const FAL_AI_API_KEY = import.meta.env.VITE_FAL_AI_API_KEY;
const AUTO_GENERATE_IMAGE_TIMEOUT = 10000;
const model = "fal-ai/fast-turbo-diffusion/image-to-image";

export const initializeImageAI = (apiKey: string) => {
    if (!isConfigured) {
        fal.config({
            credentials: apiKey
        });
        console.log('Initialized Fal.ai provider');
        isConfigured = true;
    }
};

export const generateAIImage = async ({ req }: generateImageProps): Promise<AIResult> => {
    return new Promise((resolve, reject) => {
        if (!FAL_AI_API_KEY) {
            console.error('No API key provided for Fal.ai');
            reject(new Error('Missing API key for Fal.ai'));
            return;
        }

        console.log('Initializing Fal.ai provider with:', {
            model: model,
            hasApiKey: !!FAL_AI_API_KEY,
        });

        // Configure fal if not already done
        if (!isConfigured) initializeImageAI(FAL_AI_API_KEY);

        const id = crypto.randomUUID();
        let timer: ReturnType<typeof setTimeout>;
        let connection: ReturnType<typeof fal.realtime.connect>;
        let isConnectionClosed = false;

        const connect = () => {
            connection = fal.realtime.connect(model, {
                connectionKey: id,
                clientOnly: false,
                onError: (error) => {
                    console.error('Connection error:', error);
                    if (!isConnectionClosed) {
                        cleanup();
                        reject(error);
                    }
                },
                onResult: (result) => {
                    if (result.images && result.images[0]) {
                        const imageData = result.images[0];
                        const base64String = btoa(
                            String.fromCharCode.apply(null, Array.from(imageData.content))
                        );
                        const imageUrl = `data:${imageData.content_type};base64,${base64String}`;
                        console.log('Received image result:', imageUrl);
                        cleanup();
                        resolve({ url: imageUrl });
                    } else {
                        console.warn('Received empty result:', result);
                        cleanup();
                        reject(new Error('Empty result received from AI service'));
                    }
                },
            });
        };

        const send = async () => {
            const append = ' beautiful award-winning professional';
            const prompt = req.text ? req.text + append : 
                'a random image, such as a cat, a tree, or a house' + append;

            const negativePrompt = 'amateur, low quality';

            console.log('Sending image generation request:', {
                id,
                prompt,
                hasImage: !!req.image,
                imageSize: req.image_size
            });

            await connection.send({
                prompt: prompt,
                negative_prompt: negativePrompt,
                image_url: req.image,
                image_size: {
                    width: req.image_size,
                    height: req.image_size,
                },
                num_images: 1,
                sync_mode: true,
                expand_prompt: true, // default false
                num_inference_steps: 4, // default 2
                guidance_scale: 1.98, // default 1, max 2: prompt adherence
                strength: 0.748, // default 0.95: image creativity
                seed: 42,
            } as any);
        };

        const cleanup = () => {
            if (timer) {
                clearTimeout(timer);
            }
            if (connection && !isConnectionClosed) {
                try {
                    isConnectionClosed = true;
                    connection.close();
                } catch (e) {
                    console.warn('Error during connection cleanup:', e);
                }
            }
        };

        try {
            connect();

            timer = setTimeout(() => {
                console.error('Image generation timed out after', AUTO_GENERATE_IMAGE_TIMEOUT, 'ms');
                cleanup();
                reject(new Error('Image generation timed out'));
            }, AUTO_GENERATE_IMAGE_TIMEOUT);

            send();
        } catch (error) {
            console.error('Error during image generation:', error);
            cleanup();
            reject(error);
        }
    });
};
