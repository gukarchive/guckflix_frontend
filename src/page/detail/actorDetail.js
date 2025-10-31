import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import guckflixApi from '../../config/guckflixApi';
import './actorDetail.css';
import apiConfig from '../../config/apiConfig';
import HistoryCatalog, {
  HoverbleClickableBtn,
} from '../../component/historyCatalog/HistoryCatalog';
import '../../component/heroSlide/heroSlide.css';
import { useSelector } from 'react-redux';

const ActorDetail = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState([]);
  const [image, setImage] = useState();
  const [catalogItems, setCatalogItems] = useState({});
  const [age, setAge] = useState(0);
  const biographyRef = useRef(null);
  const [isOverflow, setIsOverflow] = useState(false);

  const navigate = useNavigate();

  const role = useSelector((state) => state.role);
  const editFormHandle = () => {
    navigate(`/actors/${id}/edit`);
  };

  const getActorDetail = async () => {
    const params = {};
    const response = await guckflixApi.getActorDetail(id, { params });
    console.log(response.data);
    setDetail(response.data);

    setCatalogItems(yearGroups(response.data.credits));
  };

  // 새 ARRAY 안에 연도별로 묶어서 반환
  const yearGroups = (sortedArray) => {
    const returnArr = {};
    sortedArray.forEach((e, i) => {
      const year = e.release_date.split('-')[0];

      // 연도 그룹이 없으면 생성
      if (!returnArr[year]) {
        returnArr[year] = [];
      }
      returnArr[year].push(e);
    });

    return returnArr;
  };

  const calcAge = (birth_day, death_day) => {
    if (birth_day === undefined || birth_day === null) {
      return;
    }

    const birthDate = new Date(birth_day);
    const currentOrDeathDate =
      death_day !== null ? new Date(death_day) : new Date();

    const birthMonth = birthDate.getMonth() + 1;
    const birthYear = birthDate.getFullYear();
    const currentYear = currentOrDeathDate.getFullYear();
    const currentMonth = currentOrDeathDate.getMonth() + 1;

    let age = currentYear - birthYear;

    // 아직 생일이 안 지났으면
    if (
      currentMonth < birthMonth ||
      (currentMonth === birthMonth &&
        currentOrDeathDate.getDate() < birthDate.getDate())
    ) {
      age -= 1;
    }

    return age;
  };

  useEffect(() => {
    getActorDetail();
  }, [id]);

  useEffect(() => {
    setAge(calcAge(detail.birth_day, detail.death_day));
    setImage(apiConfig.profileImage(detail.profile_path));
    checkIsOverflowed();
  }, [detail]);

  const checkIsOverflowed = () => {
    const divElement = biographyRef.current;
    const actualHeight = divElement.scrollHeight; // div 요소 내부의 실제 크기
    const showingHeight = divElement.offsetHeight; // div의 표시 크기

    if (actualHeight > showingHeight) setIsOverflow(true);
  };

  const showMoreBiography = () => {
    setIsOverflow(false);
  };

  return (
    <div className="detail">
      <div className="actorDetail__wrapper">
        <div className="actorDetail__left__side">
          <img src={image}></img>
          <h2>인물 정보</h2>
          <h3>출생지</h3>
          {detail.place_of_birth ? detail.place_of_birth : 'N/A'}
          <h3>생년월일</h3>
          {detail.birth_day ? detail.birth_day : 'N/A'}
          {detail.death_day && (
            <>
              <h3>작고</h3>
              <div>{detail.death_day}</div>
            </>
          )}
          {detail.death_day ? <h3>작고 나이</h3> : <h3>나이</h3>}
          <div>{age ? age : 'N/A'}</div>
          <h3>참여작 수</h3>
          {detail.credits && detail.credits.length}
        </div>
        <div className="actorDetail__right__side">
          <div className="actorDetail__title">{detail.name}</div>
          <h2>약력</h2>
          <div
            className={
              isOverflow
                ? 'actorDetail__biography'
                : 'actorDetail__biography__showup'
            }
            ref={biographyRef}
          >
            {detail.biography ? detail.biography : 'N/A'}
          </div>

          {isOverflow ? (
            <div className="actorDetail__showingBtnDiv">
              <HoverbleClickableBtn
                btnName={'더 보기'}
                className={'actorDetail__showingBtn'}
                func={showMoreBiography}
              />
            </div>
          ) : (
            <></>
          )}
          <div className="actorDetail__credits">
            <h2>크레딧</h2>
            <HistoryCatalog catalogItems={catalogItems} />
          </div>
        </div>
      </div>
      {role === 'ADMIN' ? (
        <div className="text-align-center padding-3vh-updown">
          <HoverbleClickableBtn btnName={'수정'} func={editFormHandle} />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ActorDetail;
