import React, { useEffect, useState } from 'react';
import './movieForm.css';
import noImage from './../../img/w500_no_image.png';
import guckflixApi, { category } from '../../config/guckflixApi';
import { AutoCompleteBox } from '../../component/historyCatalog/HistoryCatalogEdit';
import { HoverbleClickableBtn } from '../../component/historyCatalog/HistoryCatalog';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

const MovieupdateForm = () => {
  const image = useState(noImage);

  const [form, setForm] = useState({
    genres: [],
    title: '',
    overview: '',
    release_date: '',
    credits: [],
  });

  const { id } = useParams();

  useEffect(() => {}, [image]);

  useEffect(() => {
    const getApiMovieGenres = async () => {
      const response = await guckflixApi.getGenres();
      setGenreList(response.data);
    };
    getApiMovieGenres();
  }, []);

  useEffect(() => {
    const getInfo = async () => {
      const response = await guckflixApi.getDetail(category.movies, id);
      setForm((prevForm) => ({
        ...prevForm,
        genres: response.data.genres,
        title: response.data.title,
        overview: response.data.overview,
        release_date: response.data.release_date,
      }));
      console.log('받아온 영화 데이터', response);
    };
    getInfo();
  }, [id]);

  useEffect(() => {
    const getCredit = async () => {
      const response = await guckflixApi.getCredit(category.movies, id);
      setForm((prevForm) => ({
        ...prevForm,
        credits: response.data.results,
      }));
      console.log('받아온 출연진 데이터', response);
    };

    getCredit();
  }, [id]);

  const [exampleGenreList, setGenreList] = useState([]);

  const checkboxHandler = (genre) => {
    if (form.genres.some((havingGenre) => havingGenre.id === genre.id)) {
      setForm({
        ...form,
        genres: [...form.genres.filter((num) => num.id !== genre.id)],
      });
    }
    if (!form.genres.some((havingGenre) => havingGenre.id === genre.id)) {
      setForm({ ...form, genres: [...form.genres, genre] });
    }
  };

  const titleHandler = (e) => {
    setForm({ ...form, title: e.target.value });
  };
  const releaseDateHandler = (e) => {
    setForm({ ...form, release_date: e.target.value });
  };
  const overviewHandler = (e) => {
    setForm({ ...form, overview: e.target.value });
  };

  // 검색
  const [searchedItems, setSearchedItems] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  // 키보드나 마우스에 의해 선택된 자동완성 박스 변수
  const [isSelected, setIsSelected] = useState(false);
  const [focus, setFocus] = useState(-1);
  const [focusedActor, setFocusedActor] = useState({});

  const searchInputHandle = (e) => {
    setSearchKeyword(e.target.value);
  };
  const search = async () => {
    const response = await guckflixApi.getSearchResult(category.actors, {
      params: {
        keyword: searchKeyword,
      },
    });
    setSearchedItems(response.data.results);
  };

  const [characterName, setCharacterName] = useState('');

  const addCreditHandler = () => {
    setForm({
      ...form,
      credits: [
        ...form.credits,
        {
          name: focusedActor.name,
          actor_id: focusedActor.id,
          character: characterName,
        },
      ],
    });
    setSearchKeyword('');
  };

  const keydownHandler = (e) => {
    // 위쪽 화살표를 누른 경우, 포커스를 범위 내에서 -1
    if (e.keyCode === 38 && focus >= 1) setFocus(focus - 1);

    // 아래 화살표를 누른 경우, 포커스를 범위 내에서 +1
    if (e.keyCode === 40 && focus < searchedItems.length - 1)
      setFocus(focus + 1);

    // 엔터를 누른 경우, 사용자의 커서가 위치한 배우를 선택
    if (e.keyCode === 13 && focus >= 0 && focus <= searchedItems.length - 1) {
      setSearchKeyword(searchedItems[focus].name);
      setIsSelected(true);
      setFocusedActor(searchedItems[focus]);
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
      setFocus(-1);
      setFocusedActor({});
      setCharacterName('');
    }
  }, [searchKeyword]);

  const deleteCreditHandle = (id) => {
    setForm({
      ...form,
      credits: [...form.credits.filter((credit) => credit.actor_id !== id)],
    });
  };

  const [w500File, setW500File] = useState(null);
  const [w500PrevImage, setW500PrevImage] = useState(null);
  const [backdropPathFile, setBackdropPathFile] = useState(null);
  const [backdropPrevImage, setBackdropPrevImage] = useState(null);

  // img src를 사용자가 업로드하려는 파일로 미리보기 (전송되는 것이 아님)
  const w500ImageHandle = (e) => {
    const file = e.target.files[0];
    setW500File(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setW500PrevImage(event.target.result);
      };
      reader.readAsDataURL(file);
      setErrorMessages({ ...errorMessages, w500File: '' });
    }
  };

  const backdropImageHandle = (e) => {
    const file = e.target.files[0];
    setBackdropPathFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBackdropPrevImage(event.target.result);
        setErrorMessages({ ...errorMessages, backdropPathFile: '' });
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 30);

    const year = maxDate.getFullYear();
    const month = (maxDate.getMonth() + 1).toString().padStart(2, '0');
    const day = maxDate.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const [errorMessages, setErrorMessages] = useState({
    w500File: '',
    backdropPathFile: '',
    title: '',
    overview: '',
    credits: '',
    checkedGenreList: '',
    releaseDate: '',
  });

  const formValidate = () => {
    console.log(form);

    setErrorMessages({
      w500File: '',
      backdropPathFile: '',
      title: '',
      overview: '',
      credits: '',
      checkedGenreList: '',
      releaseDate: '',
    });

    if (w500File === null) {
      setErrorMessages({
        ...errorMessages,
        w500File: '500x750 이미지를 올려주세요',
      });
      document.getElementById('w500File').focus();
      return false;
    }
    if (backdropPathFile === null) {
      setErrorMessages({
        ...errorMessages,
        backdropPathFile: '백그라운드 이미지를 올려주세요',
      });
      document.getElementById('backdropImage').focus();
      return false;
    }

    if (form.title === null || form.title === '' || form.title > 100) {
      setErrorMessages({
        ...errorMessages,
        title: '제목을 100자 미만으로 입력하세요',
      });
      document.getElementById('title').focus();
      return false;
    }

    if (
      form.overview === null ||
      form.overview === '' ||
      form.overview.length > 1000
    ) {
      setErrorMessages({
        ...errorMessages,
        overview: '내용을 1000자 미만으로 입력하세요',
      });
      document.getElementById('overview').focus();
      return false;
    }
    if (form.credits.length === 0 || form.credits.length > 20) {
      setErrorMessages({
        ...errorMessages,
        credits: '출연진은 1명 이상 20명 이하로 입력하세요',
      });
      document.getElementById('credit').focus();
      return false;
    }
    if (form.genres.length === 0 || form.genres.length > 10) {
      setErrorMessages({
        ...errorMessages,
        checkedGenreList: '장르를 1개 이상 10개 이하로 입력하세요',
      });
      document.getElementById('genre').focus();
      return false;
    }

    if (
      form.release_date > new Date() + 30 ||
      new Date('1900-01-01') < form.release_date
    ) {
      setErrorMessages({
        ...errorMessages,
        releaseDate:
          '개봉일은 1900년 1월 1일 이후부터 오늘 날짜로 30일 이후까지만 입력 가능합니다',
      });
      document.getElementById('date').focus();
      return false;
    }
    return true;
  };

  const navigate = useNavigate();

  const formHandler = async () => {
    if (!formValidate()) return;

    console.log(form);

    if (!window.confirm('제출 하시겠습니까?')) return;

    const formData = new FormData();

    formData.append(
      'movieUpdateForm',
      new Blob([JSON.stringify(form)], { type: 'application/json' }),
    );

    formData.append('originFile', backdropPathFile);
    formData.append('w500File', w500File);

    const response = await guckflixApi.patchMovie(formData, id);

    if (response.status === 200) {
      alert('정상적으로 수정되었습니다.');
      navigate('/movies/' + id);
    }
    if (response.status === 401) alert('로그인이 필요한 기능입니다.');
    if (response.status === 403) alert('권한이 없습니다');

    console.log(response);
  };

  return (
    <>
      <div className="movieForm__wrapper">
        <div className="left">
          <h2>세로형 이미지</h2>
          <img src={w500PrevImage ? w500PrevImage : noImage} />
          <input
            type="file"
            accept="image/jpg"
            onChange={w500ImageHandle}
            id="w500File"
          />
          {errorMessages.w500File !== '' ? (
            <div className="color-red">{errorMessages.w500File}</div>
          ) : (
            <></>
          )}
          <h2>백그라운드 이미지</h2>
          <img src={backdropPrevImage ? backdropPrevImage : noImage} />
          <input
            type="file"
            accept="image/jpg"
            id="backdropImage"
            onChange={backdropImageHandle}
          />
          {errorMessages.backdropPathFile !== '' ? (
            <div className="color-red">{errorMessages.backdropPathFile}</div>
          ) : (
            <></>
          )}
        </div>
        <div className="right">
          <div className="title">
            <h2>제목</h2>
            <input
              className="shortTextInput width-100percent box-sizing-border-box"
              maxLength={100}
              type="text"
              id="title"
              placeholder="제목"
              value={form.title}
              onChange={titleHandler}
            ></input>
            {errorMessages.title !== '' ? (
              <div className="color-red">{errorMessages.title}</div>
            ) : (
              <></>
            )}
          </div>
          <div>
            <h2>개봉일</h2>
            <input
              className="date"
              type="date"
              id="date"
              min={'1900-01-01'}
              max={calculateMaxDate()}
              value={form.release_date}
              data-placeholder="날짜 선택"
              onChange={releaseDateHandler}
            />
            {errorMessages.releaseDate !== '' ? (
              <div className="color-red">{errorMessages.releaseDate}</div>
            ) : (
              <></>
            )}
          </div>
          <div>
            <h2>영화 소개</h2>
            <textarea
              className="overview"
              placeholder="영화 소개"
              value={form.overview}
              id="overview"
              onChange={overviewHandler}
            ></textarea>
            {errorMessages.overview !== '' ? (
              <div className="color-red">{errorMessages.overview}</div>
            ) : (
              <></>
            )}
          </div>
          <div>
            <h2 id="genre">장르 선택</h2>
            {exampleGenreList.map((genre) => {
              const isSelected = form.genres.some((havingGenres) => {
                return havingGenres.id === genre.id;
              });
              return (
                <div className="display-inline-block margin-10" key={genre.id}>
                  <input
                    type="checkbox"
                    id={genre.id}
                    onChange={() => checkboxHandler(genre)}
                    checked={isSelected}
                  />
                  <label htmlFor={genre.id}>{genre.genre}</label>
                </div>
              );
            })}
            {errorMessages.checkedGenreList !== '' ? (
              <div className="color-red">{errorMessages.checkedGenreList}</div>
            ) : (
              <></>
            )}
          </div>
          <div>
            <h2>출연진 등록</h2>
            <div className="historyCatalog__OutlineBox">
              <input
                className="search"
                type="text"
                onChange={searchInputHandle}
                value={searchKeyword}
                onKeyDown={keydownHandler}
                disabled={isSelected}
                id="credit"
                placeholder="출연자를 추가하려면 배우명을 검색하세요"
              />
              <div className="relative">
                <AutoCompleteBox
                  items={searchedItems}
                  setIsSelected={setIsSelected}
                  setSearchKeyword={setSearchKeyword}
                  setSelectedItem={setFocusedActor}
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
                      func={addCreditHandler}
                      btnName={'배역 추가'}
                      className={'margin-right-5px'}
                    />
                    <HoverbleClickableBtn
                      func={() => setSearchKeyword('')}
                      btnName={'배역 재선택'}
                      className={'margin-right-5px'}
                    />
                  </div>
                </>
              ) : (
                <></>
              )}
              <br />
              {form.credits &&
                form.credits.map((credit, index) => {
                  return (
                    <div
                      key={credit.actor_id}
                      className="historyCatalog__title"
                    >
                      <div className="flex align-items-center">
                        <span className="flex-grow-1">{credit.name}</span>
                        <HoverbleClickableBtn
                          className={'margin-right-5px'}
                          func={() => deleteCreditHandle(credit.actor_id)}
                          btnName={'삭제'}
                        />
                      </div>
                      <div className="historyCatalog__casting">
                        {credit.character}&nbsp;역
                      </div>
                    </div>
                  );
                })}
            </div>
            {errorMessages.credits !== '' ? (
              <div className="color-red">{errorMessages.credits}</div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <div className="text-align-center background-color-black padding-bottom-3vh">
        <HoverbleClickableBtn func={formHandler} btnName={'수정'} />
      </div>
    </>
  );
};
export default MovieupdateForm;
