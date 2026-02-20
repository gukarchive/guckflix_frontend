import React, { useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './adminAiEmbed.css';

const AdminAiEmbed = () => {
  const defaultServerUrl = useMemo(
    () => (process.env.REACT_APP_API_URL || '').replace(/\/+$/, ''),
    [],
  );

  const [serverUrl, setServerUrl] = useState(defaultServerUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [statusText, setStatusText] = useState('대기 중');
  const [responsePreview, setResponsePreview] = useState('');

  const requestUrl = `${serverUrl.replace(/\/+$/, '')}/ai/embed`;

  const onEmbedRun = async () => {
    if (!serverUrl.trim()) {
      toast.warning('서버 주소를 입력해 주세요.');
      return;
    }

    setIsLoading(true);
    setStatusText('임베딩 요청 실행 중...');
    setResponsePreview('');

    try {
      const response = await axios.post(
        requestUrl,
        {},
        {
          withCredentials: true,
        },
      );

      const preview =
        typeof response.data === 'string'
          ? response.data
          : JSON.stringify(response.data, null, 2);

      setStatusText(`완료 (${response.status})`);
      setResponsePreview(preview);
      toast.success('AI 임베딩 요청이 완료되었습니다.');
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        '요청 처리 중 오류가 발생했습니다.';

      setStatusText('실패');
      setResponsePreview(errorMessage);
      toast.error(`AI 임베딩 요청 실패: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-ai-embed-page">
      <div className="admin-ai-embed-overlay" />
      <section className="admin-ai-embed-panel">
        <p className="admin-ai-embed-eyebrow">ADMIN CONSOLE</p>
        <h1 className="admin-ai-embed-title">AI Embed Runner</h1>
        <p className="admin-ai-embed-desc">
          버튼을 누르면 입력한 서버 주소에 <code>/ai/embed</code>를 붙여 호출합니다.
        </p>

        <label className="admin-ai-embed-label" htmlFor="server-url">
          서버 주소
        </label>
        <input
          id="server-url"
          className="admin-ai-embed-input"
          value={serverUrl}
          onChange={(e) => setServerUrl(e.target.value)}
          placeholder="https://api.example.com"
        />

        <div className="admin-ai-embed-url-preview">
          요청 URL: <span>{requestUrl}</span>
        </div>

        <button
          className="admin-ai-embed-button"
          type="button"
          onClick={onEmbedRun}
          disabled={isLoading}
        >
          {isLoading ? '요청 중...' : 'AI Embed 실행'}
        </button>

        <div className="admin-ai-embed-status-wrap">
          <div className="admin-ai-embed-status">상태: {statusText}</div>
          <pre className="admin-ai-embed-response">
            {responsePreview || '응답이 여기에 표시됩니다.'}
          </pre>
        </div>
      </section>
    </div>
  );
};

export default AdminAiEmbed;
