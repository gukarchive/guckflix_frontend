import React, { useState } from 'react';
import guckflixApi from '../../config/guckflixApi';
import './floatingChatbot.css';

const MOVIE_LINE_PATTERN = /^\s*-\s*\[([^\]]+)\]\s*([^:\n]+)(?::\s*(.*))?\s*$/;

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text:
        '안녕하세요. 영화 추천 챗봇입니다.\n' +
        '데이터가 영어로만 적재되어 있어, 제목을 영어로 검색해주시면 감사하겠습니다.\n' +
        '예: "The Dark Knight같은 영화 10개 추천해줘"\n' +
        '영화 추천 외 주제는 제공드리기 어렵습니다.',
    },
  ]);

  const renderBotText = (text, messageIndex) => {
    const source = typeof text === 'string' ? text : String(text || '');
    const lines = source.split('\n');

    return lines.map((line, lineIndex) => {
      const match = line.match(MOVIE_LINE_PATTERN);
      const key = `m-${messageIndex}-${lineIndex}`;

      if (!match) {
        return (
          <React.Fragment key={key}>
            {line}
            {lineIndex < lines.length - 1 ? <br /> : null}
          </React.Fragment>
        );
      }

      const movieId = match[1].trim();
      const title = match[2].trim();
      const description = (match[3] || '').trim();
      const movieHref = `/movies/${encodeURIComponent(movieId)}`;

      return (
        <React.Fragment key={key}>
          -{' '}
          <a className="chatbot-movie-link" href={movieHref}>
            {title}
          </a>
          {description ? `: ${description}` : ''}
          {lineIndex < lines.length - 1 ? <br /> : null}
        </React.Fragment>
      );
    });
  };

  const sendMessage = async () => {
    const text = inputValue.trim();
    if (!text || isLoading) {
      return;
    }

    const nextMessages = [...messages, { role: 'user', text }];
    setMessages(nextMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await guckflixApi.postAiChat({ message: text });
      const data = response?.data;
      const botText =
        data?.message ||
        data?.answer ||
        data?.content ||
        (typeof data === 'string' ? data : JSON.stringify(data));

      setMessages([...nextMessages, { role: 'bot', text: botText }]);
    } catch (error) {
      const errorText =
        error?.response?.data?.message ||
        '챗봇 응답을 가져오지 못했습니다. 잠시 후 다시 시도해 주세요.';
      setMessages([
        ...nextMessages,
        {
          role: 'bot',
          text: errorText,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="floating-chatbot">
      <div className={`chatbot-panel ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-panel-header">
          <span className="chatbot-badge">AI</span>
          <h4>Guckflix Chatbot</h4>
        </div>
        <div className="chatbot-panel-body">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`chatbot-message ${message.role}`}>
              {message.role === 'bot' ? renderBotText(message.text, index) : message.text}
            </div>
          ))}
          {isLoading ? <div className="chatbot-message bot">응답 생성 중...</div> : null}
        </div>
        <div className="chatbot-input-row">
          <input
            type="text"
            placeholder="메시지를 입력하세요"
            className="chatbot-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                sendMessage();
              }
            }}
          />
          <button
            type="button"
            className="chatbot-send"
            onClick={sendMessage}
            disabled={isLoading}
          >
            {'\u27A4'}
          </button>
        </div>
      </div>

      <button
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? '챗봇 닫기' : '챗봇 열기'}
      >
        {isOpen ? (
          <span className="chatbot-toggle-close">{'\u2715'}</span>
        ) : (
          <span className="chatbot-toggle-bubble" />
        )}
      </button>
    </div>
  );
};

export default FloatingChatbot;
