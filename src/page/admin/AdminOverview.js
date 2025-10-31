import React, { memo, useEffect, useState } from 'react';
import guckflixApi from '../../config/guckflixApi';

// const AdminOverview = () => {
//   const containerStyle = {
//     gridArea: 'center-bottom',
//     background: '#ededed',
//     padding: '20px',
//     display: 'grid',
//     gridTemplateColumns: '1fr 1fr 1fr 0.7fr',
//     gap: '20px',
//     gridTemplateAreas: '"a b c g" "d e f g"',
//   };

//   const cardStyle = {
//     background: 'white',
//     border: '2px solid #e1e3e1',
//     padding: '10px',
//     boxSizing: 'border-box',
//   };

//   const [memoList, setMemoList] = useState();

//   useEffect(()=> {
//     getMemos();
//   }, [])

//   useEffect(()=>{
//     console.log(memoList);
//   }, [memoList])

//   const getMemos = async () => {
//     const memoList = await guckflixApi.getMemos().data;
//     setMemoList(memoList);
//   }

//   return (
//     <>
//       <div style={containerStyle}>
//         <div style={{ ...cardStyle, gridArea: 'a' }}>
//           영화사로부터 제공받은 미확인 데이터 n건
//         </div>
//         <div style={{ ...cardStyle, gridArea: 'b' }}>이용자 추이 (그래프)</div>
//         <div style={{ ...cardStyle, gridArea: 'c' }}>알림 (회원가입 등) </div>
//         <div style={{ ...cardStyle, gridArea: 'd' }}>신고접수 리뷰</div>
//         <div style={{ ...cardStyle, gridArea: 'e' }}>급상승 검색어</div>
//         <div style={{ ...cardStyle, gridArea: 'f' }}>컨텐츠 박스</div>
//         <div
//           style={{
//             ...cardStyle,
//             gridArea: 'g',
//             backgroundColor: '#020721',
//           }}
//         >
//           {/* <div>SMS 관련 데이터</div>
//           <div style={{ backgroundColor: '#faff9c' }}>관리자 메모</div>
//           {memoList.map((memo, idx)=> {
//             <div style={{ backgroundColor: '#faff9c' }}>{memo.created_at}, {memo.text}</div>
//           })} */}
//         </div>
//       </div>
//     </>
//   );
// };

// export default AdminOverview;
