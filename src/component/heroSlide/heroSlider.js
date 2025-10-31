// 슬라이더 액션
let isPressed = true;
let clientMouseX = 0;
export const mouseDownAction = (e) => {
  e.target.style.cursor = 'grabbing';
  isPressed = true;
  clientMouseX = e.clientX;
};

let currentIdx = 0;
export const mouseUpAction = (e) => {
  if (isPressed) {
    const heroSlide = document.querySelector('.heroSlide');
    const slideItems = document.querySelectorAll('.heroSlide__items');

    // 슬라이더 뒤로
    if (e.clientX - clientMouseX > 80) {
      if (currentIdx !== 0) {
        currentIdx--;
      } else if (currentIdx === 0) {
        currentIdx = slideItems.length - 1;
      }
      // 슬라이더 앞으로
    } else if (clientMouseX - e.clientX > 80) {
      if (currentIdx !== slideItems.length - 1) {
        currentIdx++;
      } else if (currentIdx === slideItems.length - 1) {
        currentIdx = 0;
      }
      // 이동값이 80을 못 넘으면
    } else {
      return;
    }
    heroSlide.style.transform = 'translateX(' + currentIdx * -1 * 100 + 'vw)';
    e.target.style.cursor = 'grab';
  }
  isPressed = false;
};
