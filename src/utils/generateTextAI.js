import { GoogleGenerativeAI } from '@google/generative-ai';

const generateText = async (input) => {
  if (!input) return '';

  try {
    const genAI = new GoogleGenerativeAI('AIzaSyCzk1Tbx4lW3F4IIZrDvusRj7g3uvNeG-w');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = input;
    const result = await model.generateContent(prompt);
    const text = await result.response.text();
    return text;
  } catch (error) {
    console.error('Error generating text:', error);
    return 'Sorry, something went wrong.';
  }
};

export { generateText };
export default generateText;
