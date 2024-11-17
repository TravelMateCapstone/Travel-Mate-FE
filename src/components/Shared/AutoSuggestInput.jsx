import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

function AutoSuggestInput() {
  const [inputText, setInputText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Hàm gọi API để lấy gợi ý
  const fetchSuggestions = async () => {
    if (inputText.length === 0) return; // Nếu không có input, không gửi yêu cầu

    setLoading(true); // Bắt đầu quá trình gọi API

    try {
      // Khởi tạo GoogleGenerativeAI với API Key
      const genAI = new GoogleGenerativeAI('AIzaSyCzk1Tbx4lW3F4IIZrDvusRj7g3uvNeG-w');

      // Lấy mô hình generative AI từ Google
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // Cung cấp prompt để tạo nội dung
      const prompt = `Viết mô tả cho nhóm: ${inputText} của tôi bỏ qua chú thích tôi chỉ cần nội dung` ;

      // Gọi API để tạo nội dung
      const result = await model.generateContent(prompt);
      const text = await result.response.text();

      // Lưu kết quả vào state
      setSuggestions([text]);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions(['Sorry, something went wrong.']);
    } finally {
      setLoading(false); // Kết thúc quá trình gọi API
    }
  };

  // Hàm gọi API để viết tiếp nội dung
  const fetchContinuedContent = async () => {
    if (suggestions.length === 0) return; // Nếu không có gợi ý, không gửi yêu cầu

    setLoading(true); // Bắt đầu quá trình gọi API

    try {
      // Khởi tạo GoogleGenerativeAI với API Key
      const genAI = new GoogleGenerativeAI('AIzaSyCzk1Tbx4lW3F4IIZrDvusRj7g3uvNeG-w');

      // Lấy mô hình generative AI từ Google
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // Cung cấp prompt để tạo nội dung tiếp theo
      const prompt = `Viết tiếp nội dung sau: ${suggestions[0]}`;

      // Gọi API để tạo nội dung
      const result = await model.generateContent(prompt);
      const text = await result.response.text();

      // Lưu kết quả vào state
      setSuggestions([...suggestions, text]);
    } catch (error) {
      console.error('Error fetching continued content:', error);
      setSuggestions([...suggestions, 'Sorry, something went wrong.']);
    } finally {
      setLoading(false); // Kết thúc quá trình gọi API
    }
  };

  return (
    <div>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)} // Cập nhật inputText khi người dùng nhập
        placeholder="Enter text for suggestions..."
      />
      <button onClick={fetchSuggestions} disabled={loading}>
        {loading ? 'Loading...' : 'Get Suggestions'}
      </button>
      <button onClick={fetchContinuedContent} disabled={loading || suggestions.length === 0}>
        {loading ? 'Loading...' : 'Continue Content'}
      </button>
      <ul>
        {suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => <li key={index}>{suggestion}</li>)
        ) : (
          <li>No suggestions yet</li>
        )}
      </ul>
    </div>
  );
}

export default AutoSuggestInput;
