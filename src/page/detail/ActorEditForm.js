import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import './actorDetail.css';
import apiConfig from '../../config/apiConfig';
import { HoverbleClickableBtn } from '../../component/historyCatalog/HistoryCatalog';
import '../../component/heroSlide/heroSlide.css';
import './actorDetail.css';
import HistoryCatalogEdit from '../../component/historyCatalog/HistoryCatalogEdit';
import '../../component/historyCatalog/historyCatalog.css';
import guckflixApi from '../../config/guckflixApi';
import './actorEditForm.css';

const ActorEditForm = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState({});
  const [image, setImage] = useState();
  const [catalogItems, setCatalogItems] = useState([]);

  const [birthDay, setBirthDay] = useState('');
  const [deathDay, setDeathDay] = useState('');
  const [biography, setBiography] = useState('');
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [name, setName] = useState('');

  const getActorDetail = async () => {
    const params = {};
    const response = await guckflixApi.getActorDetail(id, { params });
    setDetail(response.data);

    // 바꿀 수 있는 것들
    setName(response.data.name);
    setBiography(response.data.biography);
    setPlaceOfBirth(response.data.place_of_birth);
    setBirthDay(response.data.birth_day);
    setDeathDay(response.data.death_day);
  };

  useEffect(() => {
    getActorDetail();
  }, [id]);

  useEffect(() => {
    if (Object.keys(detail).length !== 0) {
      setImage(apiConfig.profileImage(detail.profile_path));
      setCatalogItems(detail.credits);
    }
  }, [detail]);

  const submitHandler = (e) => {
    e.preventDefault();
  };

  const biographyOnchangeHandler = (e) => setBiography(e.target.value);
  const nameOnchangeHanlder = (e) => setName(e.target.value);
  const placeOfBirthOnchangeHandler = (e) => setPlaceOfBirth(e.target.value);
  const deathDayOnchangeHandler = (e) => setDeathDay(e.target.value);
  const birthDayOnchangeHandler = (e) => setBirthDay(e.target.value);

  // 수정 시에 전송될 파일
  const [selectedFile, setSelectedFile] = useState(null);

  // img src를 사용자가 업로드하려는 파일로 미리보기 (전송되는 것이 아님)
  const fileOnChangeHandle = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const fileSubmitHandle = async () => {
    if (selectedFile != null) {
      if (!window.confirm('이미지를 제출하시겠습니까?')) {
        return;
      }

      const formData = new FormData();
      formData.append('imageFile', selectedFile);
      const response = await guckflixApi.patchActorPhoto(id, formData);
      if (response.status === 201) {
        setImage(response.headers['location']);
        alert('이미지 업로드에 성공했습니다');
      } else {
        alert('이미지 업로드에 실패했습니다.');
      }
    }
  };

  return (
    <div className="detail">
      <div className="actorDetail__wrapper">
        <div className="actorDetail__left__side">
          <form onSubmit={submitHandler}>
            <img src={image}></img>
            <input
              id="file_upload"
              type="file"
              accept="image/jpg"
              onChange={fileOnChangeHandle}
            />
            {selectedFile ? (
              <HoverbleClickableBtn
                btnName={'이미지 업로드'}
                func={fileSubmitHandle}
              />
            ) : (
              // <button onClick={fileSubmitHandle}>이미지 업로드</button>
              <></>
            )}

            <h2>인물 정보</h2>
            <h3>출생지</h3>
            <input
              className="shortTextInput"
              type="text"
              value={placeOfBirth}
              onChange={placeOfBirthOnchangeHandler}
            />
            <h3>생년월일</h3>
            <input
              className="date"
              type="date"
              value={birthDay}
              data-placeholder="날짜 선택"
              onChange={birthDayOnchangeHandler}
            />
            <h3>작고</h3>
            <input
              className="date"
              type="date"
              value={deathDay}
              onChange={deathDayOnchangeHandler}
            />
          </form>
        </div>
        <div className="actorDetail__right__side">
          <form onSubmit={submitHandler}>
            <div className="actorDetail__title">
              <input
                className="shortTextInput"
                type="text"
                value={name}
                onChange={nameOnchangeHanlder}
              />
            </div>
            <h2>약력</h2>
            <div className="actorEditForm__biography__edit">
              <textarea
                className="biography"
                rows={20}
                cols={100}
                value={biography}
                onChange={biographyOnchangeHandler}
              />
            </div>
            <div className="actorDetail__credits">
              <h2>크레딧</h2>
              <HistoryCatalogEdit
                catalogItems={catalogItems}
                setCatalogItems={setCatalogItems}
                actorId={id}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ActorEditForm;
