import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiConfig from '../../config/apiConfig';
import guckflixApi from '../../config/guckflixApi';
import { toast } from 'react-toastify';
import './adminMovies.css';

const initialQueryCond = {
  limit: 20,
  page: 1,
  direction: 'desc',
  orderBy: 'release_date',
  keyword: '',
};

const AdminMovies = () => {
  const navigate = useNavigate();

  // API 부르는 메서드
  const callApi = async () => {
    const response = await guckflixApi.getMovieOrderAndSort(queryCond);
    setContent(response.data);
  };

  // 검색된 결과값
  const [content, setContent] = useState({});
  const [deletingMovieId, setDeletingMovieId] = useState(null);
  const [openedPosterMovieId, setOpenedPosterMovieId] = useState(null);
  const [openedBackdropMovieId, setOpenedBackdropMovieId] = useState(null);
  /*
  {
    "size": 40,
    "page": 1,
    "results": [{
            "id": 157336
            "title": String
            "overview": String,
            "popularity": 187.751,
            "genres": [ {"id": ..., "genre": ... } ],
            "vote_count": ...,
            "vote_average": ...,
            "release_date": "2014-11-05",
            "backdrop_path": "pbrkL804c8yAv3zBZR4QPEafpAR.jpg",
            "poster_path": "gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"
        } ... ],
    "total_count": 3,
    "total_page": 1
  }
  */

  // 검색에 사용할 조건
  const [queryCond, setQueryCond] = useState(initialQueryCond);
  const [searchInput, setSearchInput] = useState('');
  /**
   * {
   *  direction : 'asc' || 'desc'
   *  orderBy : 'release_date' || 'vote_average' || 'popularity'
   *  keyword : 검색할 단어
   * }
   */

  // 조건이 바뀌면 쿼리하여 검색 결과를 바꾼다.
  useEffect(() => {
    callApi();
  }, [queryCond]);

  // 검색 결과가 바뀌면, 내용물을 가지고 렌더링 할 페이징 버튼을 결정한다.
  useEffect(() => {
    pagingNumberCalc();
  }, [content]);

  const [renderNumbers, setRenderNumbers] = useState([]);
  const pagingNumberCalc = () => {
    // 선택된 페이지 기준 좌우로 몇 개 렌더링 할 건지 결정
    // 14페이지를 선택했고 renderNumber가 6일 때, 결과는 [8 9 10 11 12 13 (14) 15 16 17 18 19 20]
    const renderNumber = 6;
    let renderNumberList = [];

    for (
      let i = content.page - renderNumber;
      i <= content.page + renderNumber;
      i++
    ) {
      if (i <= 0) continue; // 음수와 0이면 continue로 넘어감
      renderNumberList.push(i);
      if (i >= content.total_page) break; // 마지막 페이지에 도달하면 break로 탈출
    }

    // 첫 페이지와 마지막 페이지를 표시해야 함
    // 첫 페이지 1, 마지막 페이지 50일 때 [1 8 9 10 11 12 13 (14) 15 16 17 18 19 20 50] 와 같이
    // 범위 안에 첫 페이지와 마지막 페이지가 없다면 넣어주어야 함
    if (!renderNumberList.includes(1)) {
      renderNumberList.unshift(1);
    }
    if (!renderNumberList.includes(content.total_page)) {
      renderNumberList.push(content.total_page);
    }
    setRenderNumbers([...renderNumberList]);
  };

  const handleSort = (orderBy) => {
    setQueryCond({
      ...queryCond,
      direction: queryCond.direction === 'asc' ? 'desc' : 'asc',
      orderBy,
      page: 1,
    });
  };

  const arrowFor = (orderBy) => {
    if (queryCond.orderBy !== orderBy) {
      return '';
    }
    return queryCond.direction === 'asc' ? '▲' : '▼';
  };

  const deleteMovieHandle = async (movieId) => {
    if (!window.confirm(`영화 ID ${movieId}를 삭제하시겠습니까?`)) {
      return;
    }

    setDeletingMovieId(movieId);
    try {
      const response = await guckflixApi.deleteMovie(movieId);
      if (response.status === 200 || response.status === 204) {
        toast.success(`ID ${movieId} 삭제 완료`);
        await callApi();
        return;
      }
      toast.error(`삭제 실패 (${response.status})`);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        '삭제 중 오류가 발생했습니다.';
      toast.error(`삭제 실패: ${errorMessage}`);
    } finally {
      setDeletingMovieId(null);
    }
  };

  const togglePosterPreview = (movieId) => {
    setOpenedPosterMovieId((prevMovieId) =>
      prevMovieId === movieId ? null : movieId,
    );
  };

  const toggleBackdropPreview = (movieId) => {
    setOpenedBackdropMovieId((prevMovieId) =>
      prevMovieId === movieId ? null : movieId,
    );
  };

  const clearFilters = () => {
    setSearchInput('');
    setQueryCond({ ...initialQueryCond });
  };

  return (
    <div className="admin-movies-page">
      <section className="admin-movies-panel">
        <header className="admin-movies-header">
          <h1>영화 데이터 관리</h1>
          <div className="admin-movies-summary">
            <span>총 {content.total_count || 0}건</span>
            <span>페이지 {content.page || 1}</span>
          </div>
        </header>

        <div className="admin-movies-toolbar">
          <label>
            출력 개수
            <select
              value={queryCond.limit}
              onChange={(e) =>
                setQueryCond({
                  ...queryCond,
                  limit: e.target.value,
                  page: 1,
                })
              }
            >
              <option value="20">20개</option>
              <option value="40">40개</option>
              <option value="100">100개</option>
            </select>
          </label>

          <label className="admin-movies-search">
            제목 검색
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="엔터로 검색 적용"
              onKeyDown={(e) =>
                e.key === 'Enter'
                  ? setQueryCond({
                      ...queryCond,
                      keyword: searchInput,
                      page: 1,
                    })
                  : queryCond
              }
            />
          </label>

          <div className="admin-movies-sort-buttons">
            <button
              type="button"
              className={queryCond.orderBy === 'release_date' ? 'active' : ''}
              onClick={() => handleSort('release_date')}
            >
              개봉일 정렬 {arrowFor('release_date')}
            </button>
            <button
              type="button"
              className={queryCond.orderBy === 'vote_average' ? 'active' : ''}
              onClick={() => handleSort('vote_average')}
            >
              평점 정렬 {arrowFor('vote_average')}
            </button>
            <button
              type="button"
              className={queryCond.orderBy === 'popularity' ? 'active' : ''}
              onClick={() => handleSort('popularity')}
            >
              인기 정렬 {arrowFor('popularity')}
            </button>
            <button
            type="button"
            className="admin-movies-create-btn"
            onClick={clearFilters}
          >
            검색 초기화
          </button>
          </div>

          <button
            type="button"
            className="admin-movies-create-btn"
            onClick={() => navigate('/admin/ai/embed')}
          >
            EMBED 관리
          </button>
          <button
            type="button"
            className="admin-movies-create-btn"
            onClick={() => navigate('/movies/form')}
          >
            등록
          </button>
        </div>

        <div className="admin-movies-table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>제목</th>
                <th>개봉일</th>
                <th>평점</th>
                <th>인기</th>
                <th>평가 수</th>
                <th>포스터 경로</th>
                <th>백드롭 경로</th>
                <th>비고</th>
              </tr>
            </thead>
            <tbody>
              {content.results &&
                content.results.map((movie) => (
                  <tr key={movie.id}>
                    <td>
                      <Link className="movie-id-link" to={`/movies/${movie.id}`}>
                        {movie.id}
                      </Link>
                    </td>
                    <td className="movie-title-cell">{movie.title}</td>
                    <td>{movie.release_date}</td>
                    <td>{movie.vote_average}</td>
                    <td>{movie.popularity}</td>
                    <td>{movie.vote_count}</td>
                    <td className="path-cell poster-path-cell">
                      {movie.poster_path ? (
                        <>
                          <button
                            type="button"
                            className="path-preview-trigger"
                            onClick={() => togglePosterPreview(movie.id)}
                          >
                            {movie.poster_path}
                          </button>
                          {openedPosterMovieId === movie.id ? (
                            <div className="poster-preview-popover">
                              <img
                                src={apiConfig.w500Image(movie.poster_path)}
                                alt={`${movie.title} poster`}
                              />
                            </div>
                          ) : null}
                        </>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="path-cell backdrop-path-cell">
                      {movie.backdrop_path ? (
                        <>
                          <button
                            type="button"
                            className="path-preview-trigger"
                            onClick={() => toggleBackdropPreview(movie.id)}
                          >
                            {movie.backdrop_path}
                          </button>
                          {openedBackdropMovieId === movie.id ? (
                            <div className="backdrop-preview-popover">
                              <img
                                src={apiConfig.originalImage(movie.backdrop_path)}
                                alt={`${movie.title} backdrop`}
                              />
                            </div>
                          ) : null}
                        </>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="remarks-cell">
                      <div className="movie-row-actions">
                        <button
                          type="button"
                          className="movie-row-btn"
                          onClick={() => navigate(`/movies/${movie.id}/edit`)}
                          disabled={deletingMovieId === movie.id}
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          className="movie-row-btn"
                          onClick={() => deleteMovieHandle(movie.id)}
                          disabled={deletingMovieId === movie.id}
                        >
                          {deletingMovieId === movie.id ? '삭제중' : '삭제'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="admin-movies-pagination">
          {content &&
            renderNumbers.map((renderNumber, index, arr) =>
              Math.abs(arr[index] - arr[index - 1]) > 1 ? (
                <React.Fragment key={`ellipsis-${renderNumber}`}>
                  <span className="pagination-ellipsis">...</span>
                  <PagingButton
                    setQueryCond={setQueryCond}
                    queryCond={queryCond}
                    selected={renderNumber === content.page}
                  >
                    {renderNumber}
                  </PagingButton>
                </React.Fragment>
              ) : (
                <PagingButton
                  key={renderNumber}
                  setQueryCond={setQueryCond}
                  queryCond={queryCond}
                  selected={renderNumber === content.page}
                >
                  {renderNumber}
                </PagingButton>
              ),
            )}
        </div>
      </section>
    </div>
  );
};

const PagingButton = ({ children, queryCond, setQueryCond, selected }) => {
  const clickHandler = () => {
    setQueryCond({ ...queryCond, page: children });
  };

  return (
    <button className={`paging-button ${selected ? 'selected' : ''}`} onClick={clickHandler}>
      {children}
    </button>
  );
};

export default AdminMovies;
