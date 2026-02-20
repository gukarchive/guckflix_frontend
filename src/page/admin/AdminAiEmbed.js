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
  const [movieId, setMovieId] = useState('');
  const [isRunLoading, setIsRunLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [statusText, setStatusText] = useState('대기 중');
  const [responsePreview, setResponsePreview] = useState('');

  const normalizedServerUrl = serverUrl.trim().replace(/\/+$/, '');
  const requestUrl = `${normalizedServerUrl}/ai/embed`;
  const deleteUrl = movieId.trim()
    ? `${requestUrl}/${encodeURIComponent(movieId.trim())}`
    : `${requestUrl}/{movieId}`;

  const buildPreview = (data) =>
    typeof data === 'string' ? data : JSON.stringify(data, null, 2);

  const hasServerUrl = () => {
    if (normalizedServerUrl) {
      return true;
    }
    toast.warning('서버 주소를 입력해 주세요.');
    return false;
  };

  const onEmbedRun = async () => {
    if (!hasServerUrl()) {
      return;
    }

    setIsRunLoading(true);
    setStatusText('AI Embed 실행 요청 중...');
    setResponsePreview('');

    try {
      const response = await axios.post(
        requestUrl,
        {},
        {
          withCredentials: true,
        },
      );

      setStatusText(`완료 (${response.status})`);
      setResponsePreview(buildPreview(response.data));
      toast.success('AI Embed 실행 요청이 완료되었습니다.');
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        '요청 처리 중 오류가 발생했습니다.';

      setStatusText('실패');
      setResponsePreview(errorMessage);
      toast.error(`AI Embed 실행 요청 실패: ${errorMessage}`);
    } finally {
      setIsRunLoading(false);
    }
  };

  const onDeleteOne = async () => {
    if (!hasServerUrl()) {
      return;
    }

    if (!movieId.trim()) {
      toast.warning('삭제할 movieId를 입력해 주세요.');
      return;
    }

    setIsDeleteLoading(true);
    setStatusText(`movieId ${movieId.trim()} 삭제 요청 중...`);
    setResponsePreview('');

    try {
      const response = await axios.delete(deleteUrl, {
        withCredentials: true,
      });

      setStatusText(`삭제 완료 (${response.status})`);
      setResponsePreview(buildPreview(response.data));
      toast.success(`movieId ${movieId.trim()} 삭제가 완료되었습니다.`);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        '삭제 처리 중 오류가 발생했습니다.';

      setStatusText('삭제 실패');
      setResponsePreview(errorMessage);
      toast.error(`movieId ${movieId.trim()} 삭제 실패: ${errorMessage}`);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <div className="admin-ai-embed-page">
      <div className="admin-ai-embed-overlay" />
      <section className="admin-ai-embed-panel">
        <p className="admin-ai-embed-eyebrow">ADMIN CONSOLE</p>
        <h1 className="admin-ai-embed-title">AI Embed Runner</h1>
        <p className="admin-ai-embed-desc">
          서버 주소를 기준으로 전체 Embed 실행과 movieId 단건 삭제를 처리합니다.
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
          POST URL: <span>{requestUrl}</span>
        </div>

        <label className="admin-ai-embed-label" htmlFor="movie-id">
          삭제할 movieId
        </label>
        <input
          id="movie-id"
          className="admin-ai-embed-input"
          value={movieId}
          onChange={(e) => setMovieId(e.target.value)}
          placeholder="예: 12345"
          inputMode="numeric"
        />

        <div className="admin-ai-embed-url-preview">
          DELETE URL: <span>{deleteUrl}</span>
        </div>

        <div className="admin-ai-embed-actions">
          <button
            className="admin-ai-embed-button"
            type="button"
            onClick={onEmbedRun}
            disabled={isRunLoading || isDeleteLoading}
          >
            {isRunLoading ? '요청 중...' : 'AI Embed 실행'}
          </button>

          <button
            className="admin-ai-embed-button admin-ai-embed-button-danger"
            type="button"
            onClick={onDeleteOne}
            disabled={isRunLoading || isDeleteLoading}
          >
            {isDeleteLoading ? '삭제 중...' : 'movieId 단건 삭제'}
          </button>
        </div>

        <div className="admin-ai-embed-status-wrap">
          <div className="admin-ai-embed-status">상태: {statusText}</div>
          <pre className="admin-ai-embed-response">
            {responsePreview || '응답 결과가 여기에 표시됩니다.'}
          </pre>
        </div>
      </section>
    </div>
  );
};

export default AdminAiEmbed;
