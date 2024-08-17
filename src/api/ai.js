import axios from 'axios';

// Ensure you securely store your API key
const geminiApiKey = ''; // Replace with your Gemini API key
const pexelsApiKey = ''; // Replace with your Pexels API key

const geminiClient = axios.create({
    headers: {
        'x-goog-api-key': geminiApiKey,
        'Content-Type': 'application/json'
    }
});

const pexelsClient = axios.create({
    headers: {
        'Authorization': pexelsApiKey,
    }
});

const geminiEndpoint = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';
const pexelsEndpoint = 'https://api.pexels.com/v1/search';

export const apiCall = async (prompt) => {
    console.log("api called Prompt:", prompt);
    try {
        const res = await geminiClient.post(geminiEndpoint, {
            contents: [{
                role: 'user',
                parts: [{ text: `Does this message want to generate an AI picture, image, art, or anything similar? ${prompt}. Simply answer with yes or no` }]
            }]
        });

        // Log the entire response data for inspection
        console.log("Full Response Data:", res.data);

        // Extract and log the specific content
        const content = res.data.candidates[0].content;
        const text = content.parts[0].text;
        console.log("Extracted Text:", text);

        // If the response indicates image generation, call the Pexels API
        if (text.toLowerCase().includes('yes')) {
            console.log("Image generation prompt detected. Calling Pexels API...");
            await callPexelsApi(prompt);
        } else {
            console.log("No image generation detected. Handling the response from Gemini...");
            handleNoImageResponse(prompt);
        }

    } catch (err) {
        console.log("Error:", err);
        return err;
    }
}

const callPexelsApi = async (query) => {
    
    try {
        const response = await pexelsClient.get(pexelsEndpoint, {
            params: {
                query: query,
                per_page: 1 // Adjust based on how many images you want to retrieve
            }
        });

        console.log("Pexels API Response:", response.data);
        const imageUrl = response.data.photos[0].src.original;
        console.log("Image URL:", imageUrl);
        return imageUrl;

        // Further processing or displaying the image URL

    } catch (err) {
        console.log("Error calling Pexels API:", err);
    }
}

const handleNoImageResponse = async (prompt) => {
    try {
        const response = await geminiClient.post(geminiEndpoint, {
            contents: [{
                role: 'user',
                parts: [{ text: prompt }]
            }]
        });

        console.log("Gemini Response for Non-Image Prompt:", response.data);
        const content = response.data.candidates[0].content.parts[0].text;
        console.log("Answer to the Non-Image Prompt:", content);
        return content;

        // You can further process or display the content

    } catch (err) {
        console.log("Error handling non-image response:", err);
    }
}
