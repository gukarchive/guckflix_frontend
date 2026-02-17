import React from 'react';
import './membersMyPage.css';

const MembersMyPage = () => {
  return (
    <main className="members-my-page">
      <section className="members-my-page__card">
        <p className="members-my-page__badge">PRIVATE</p>
        <h1 className="members-my-page__title">My Page</h1>
        <p className="members-my-page__description">
          로그인 사용자만 접근 가능한 테스트 페이지입니다.
        </p>
      </section>
    </main>
  );
};

export default MembersMyPage;
