import React, { useEffect, useState } from 'react';
import './historyCatalog.css';
import { category } from '../../config/guckflixApi';
import guckflixApi from '../../config/guckflixApi';
import { HoverbleClickableBtn } from './HistoryCatalog';

const HistoryCatalogEdit = ({ catalogItems, setCatalogItems, actorId }) => {
  useEffect(() => {
    if (catalogItems.length !== 0) {
      console.log(catalogItems);
    }
  }, [catalogItems]);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedMovie, setSelectedMovie] = useState({});
  const [searchedItems, setSearchedItems] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  const [focus, setFocus] = useState(-1);
  const [characterName, setCharacterName] = useState('');
  const [editingCreditId, setEditingCreditId] = useState(null);
  const [editingContent, setEditingContent] = useState('');

  const deleteCreditHandle = async (movieId, creditId) => {
    if (window.confirm('삭제합니까?')) {
      const response = await guckflixApi.deleteMovieCredit(movieId, creditId);
      if (response.status === 204 || response.status === 200) {
        setCatalogItems(
          catalogItems.filter((item) => {
            return item.credit_id !== creditId;
          }),
        );
      }
    }
  };

  const patchCreditHandle = async (movieId, creditId) => {
    if (editingContent === '' || editingContent === null) return;

    const response = await guckflixApi.patchMovieCredit(movieId, creditId, {
      character: editingContent,
    });
    if (response.status === 204 || response.status === 200) {
      console.log(response);
      setCatalogItems(
        catalogItems.map((item, index) => {
          if (index === editingCreditId) item.character = editingContent;
          return item;
        }),
      );
      setEditingContent('');
      setEditingCreditId(null);
    }
  };

  const addCreditHandle = async () => {
    if (characterName === '' || characterName === null) return;
    if (!window.confirm(`역할명 ${characterName}으로 제출합니까?`)) return;

    const response = await guckflixApi.postMovieCredit(selectedMovie.id, {
      actor_id: actorId,
      character: characterName,
    });
    if (response.status === 201 || response.status === 200) {
      setCatalogItems([...catalogItems, response.data]);
    }
  };
  const searchInputHandle = (e) => {
    setSearchKeyword(e.target.value);
  };
  const search = async () => {
    const response = await guckflixApi.getSearchResult(category.movies, {
      params: {
        keyword: searchKeyword,
      },
    });
    console.log(response);
    setSearchedItems(response.data.results);
  };

  const keydownHandler = (e) => {
    // 위쪽 화살표를 누른 경우, 포커스를 범위 내에서 -1
    if (e.keyCode === 38 && focus >= 1) setFocus(focus - 1);

    // 아래 화살표를 누른 경우, 포커스를 범위 내에서 +1
    if (e.keyCode === 40 && focus < searchedItems.length - 1)
      setFocus(focus + 1);

    // 엔터를 누른 경우, 사용자의 커서가 위치한 영화를 선택
    if (e.keyCode === 13 && focus >= 0 && focus <= searchedItems.length - 1) {
      setSearchKeyword(searchedItems[focus].title);
      setIsSelected(true);
      setSelectedMovie(searchedItems[focus]);
    }
  };

  useEffect(() => {
    // 검색어가 존재할 때, 사용자가 선택한 것이 없으면 검색하고, 자동완성 박스를 보여줌
    if (searchKeyword !== '' && !isSelected) {
      search();
    }

    // 검색어가 존재할 때, 사용자가 선택한 것이 있으면 자동완성 박스를 보여줄 필요가 없음
    if (searchKeyword !== '' && isSelected) {
      setSearchedItems([]);
      setIsSelected(true);
      setFocus(-1);
    }

    // 검색어가 없으면 자동완성 박스를 보여줄 필요가 없음
    if (searchKeyword === '') {
      setSearchedItems([]);
      setIsSelected(false);
      setSelectedMovie({});
      setFocus(-1);
    }
  }, [searchKeyword]);

  return (
    <div className="historyCatalog__OutlineBox">
      <input
        className="search"
        type="text"
        onChange={searchInputHandle}
        value={searchKeyword}
        onKeyDown={keydownHandler}
        disabled={isSelected}
        placeholder="출연작을 추가하려면 영화명을 검색하세요"
      />
      <br></br>
      <div className="relative">
        <AutoCompleteBox
          items={searchedItems}
          setIsSelected={setIsSelected}
          setSearchKeyword={setSearchKeyword}
          setSelectedItem={setSelectedMovie}
          setFocus={setFocus}
          focus={focus}
        />
      </div>
      {isSelected ? (
        <>
          <div className="margin-bottom-10px">
            <input
              type="text"
              className="search"
              value={characterName}
              placeholder="배역 명을 입력하세요"
              onChange={(e) => setCharacterName(e.target.value)}
            />
          </div>
          <div>
            <HoverbleClickableBtn
              func={addCreditHandle}
              btnName={'배역 추가'}
              className={'margin-right-5px'}
            />
            <HoverbleClickableBtn
              func={() => setIsSelected(false)}
              btnName={'영화 재선택'}
              className={'margin-right-5px'}
            />
          </div>
        </>
      ) : (
        <></>
      )}
      <br />
      <div>
        {catalogItems &&
          catalogItems.map((item, index) => {
            return (
              <div key={item.movie_id} className="historyCatalog__title">
                <div className="flex align-items-center">
                  <span className="flex-grow-1">{item.title}</span>

                  <HoverbleClickableBtn
                    className={'margin-right-5px'}
                    func={() =>
                      deleteCreditHandle(item.movie_id, item.credit_id)
                    }
                    btnName={'삭제'}
                  />
                  {/* <button

                    className="margin-right-5px"
                    onClick={() =>
                      deleteCreditHandle(item.movie_id, item.credit_id)
                    }
                  >
                    삭제
                  </button> */}
                  {editingCreditId === null ? (
                    <HoverbleClickableBtn
                      className={'margin-right-5px'}
                      func={() => setEditingCreditId(index)}
                      btnName={'수정'}
                    />
                  ) : (
                    <></>
                  )}

                  {editingCreditId === index ? (
                    <>
                      <input
                        type="text"
                        value={editingContent}
                        placeholder="바꿀 배역 명을 입력하세요"
                        onChange={(e) => setEditingContent(e.target.value)}
                      />

                      <HoverbleClickableBtn
                        className={'margin-right-5px'}
                        func={() =>
                          patchCreditHandle(item.movie_id, item.credit_id)
                        }
                        btnName={'완료'}
                      />
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="historyCatalog__casting">
                  {item.character}&nbsp;역
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default HistoryCatalogEdit;

export const AutoCompleteBox = ({
  items,
  setSearchKeyword,
  setIsSelected,
  focus,
  setFocus,
  setSelectedItem,
}) => {
  const clickHandler = (item) => {
    setSearchKeyword(item.title || item.name);
    setIsSelected(true);
    setSelectedItem(item);
  };

  return (
    <div className="autoComplete">
      {items.map((item, idx) => (
        <div
          className={
            focus === idx ? 'autoComplete__item' : 'autoComplete__item__focus'
          }
          // 클릭한 경우, 사용자의 커서가 위치한 영화를 선택
          onClick={() => clickHandler(item)}
          // 마우스 커서가 위치하면 Focus
          onMouseEnter={() => setFocus(idx)}
        >
          <div>{item.title || item.name}</div>
        </div>
      ))}
    </div>
  );
};
