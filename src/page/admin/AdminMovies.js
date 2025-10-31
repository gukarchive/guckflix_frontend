import React, { useEffect, useState } from 'react';
import guckflixApi from '../../config/guckflixApi';

const AdminMovies = () => {
  const containerStyle = {
    gridArea: 'center-bottom',
    background: '#ededed',
    padding: '20px',
  };

  const tableStyle = {
    background: 'white',
    padding: '10px',
  };

  // API 부르는 메서드
  const callApi = async () => {
    const response = await guckflixApi.getMovieOrderAndSort(queryCond);
    setContent(response.data);
  };

  // 검색된 결과값
  const [content, setContent] = useState({});
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
  const [queryCond, setQueryCond] = useState({
    limit: 20,
    page: 1,
    direction: 'asc',
    orderBy: 'release_date',
    keyword: '',
  });
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

  return (
    <div style={containerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <select
              onChange={(e) =>
                setQueryCond({
                  ...queryCond,
                  limit: e.target.value,
                  page: 1,
                })
              }
            >
              <option value="20">20개씩</option>
              <option value="40">40개씩</option>
              <option value="100">100개씩</option>
            </select>
            <input
              onKeyDown={(e) =>
                e.keyCode === 13
                  ? setQueryCond({
                      ...queryCond,
                      keyword: e.target.value,
                      page: 1,
                    })
                  : queryCond
              }
            />
            {content &&
              renderNumbers.map((renderNumber, index, arr) =>
                /**
                 * pagingNumberCalc 메서드의 결과에서 [1 ... 8 9 10 11 12 13 (14) 15 16 17 18 19 20 ... 50] 처럼 말줄임표가 필요
                 * 말줄임표 기준은 인덱스와 다음 인덱스의 절대값이 1 초과하는 경우 말줄임표 삽입
                 */
                Math.abs(arr[index] - arr[index - 1]) > 1 ? (
                  <>
                    ...
                    <PagingButton
                      setQueryCond={setQueryCond}
                      queryCond={queryCond}
                      selected={renderNumber === content.page}
                    >
                      {renderNumber}
                    </PagingButton>
                  </>
                ) : (
                  <PagingButton
                    setQueryCond={setQueryCond}
                    queryCond={queryCond}
                    selected={renderNumber === content.page}
                  >
                    {renderNumber}
                  </PagingButton>
                ),
              )}
          </tr>
          <tr>
            <th>ID</th>
            <th>제목</th>
            <th
              onClick={() =>
                setQueryCond({
                  ...queryCond,
                  direction: queryCond.direction === 'asc' ? 'desc' : 'asc',
                  orderBy: 'release_date',
                  page: 1,
                })
              }
            >
              개봉일
            </th>
            <th
              onClick={() =>
                setQueryCond({
                  ...queryCond,
                  direction: queryCond.direction === 'asc' ? 'desc' : 'asc',
                  orderBy: 'vote_average',
                  page: 1,
                })
              }
            >
              평점
            </th>
            <th
              onClick={() =>
                setQueryCond({
                  ...queryCond,
                  direction: queryCond.direction === 'asc' ? 'desc' : 'asc',
                  orderBy: 'popularity',
                  page: 1,
                })
              }
            >
              인기
            </th>
            <th>평가 수</th>
            <th>포스터 경로</th>
            <th>큰 이미지 경로</th>
          </tr>
        </thead>
        <tbody>
          {content.results &&
            content.results.map((movie) => (
              <tr>
                <td>{movie.id}</td>
                <td>{movie.title}</td>
                <td>{movie.release_date}</td>
                <td>{movie.vote_average}</td>
                <td>{movie.popularity}</td>
                <td>{movie.vote_count}</td>
                <td>{movie.poster_path}</td>
                <td>{movie.backdrop_path}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

const PagingButton = ({ children, queryCond, setQueryCond, selected }) => {
  //const [isHover, setIsHover] = useState(false);

  const style = {
    fontSize: selected ? '1.5vh' : '1vh',
    background: 'white',
  };

  const clickHandler = () => {
    setQueryCond({ ...queryCond, page: children });
  };

  return (
    <button
      style={style}
      // onMouseOver={() => setIsHover(true)}
      // onMouseLeave={() => setIsHover(true)}
      onClick={clickHandler}
    >
      {children}
    </button>
  );
};

export default AdminMovies;
