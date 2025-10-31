const slideConfig = {
  left: 'left',
  right: 'right',
};
let count = 0;
let divide = 4;
let moved = 0;
const sliderAction = (direction, ref) => {
  const totalWidth = ref.current.scrollWidth;

  // 뒤로(왼쪽) 가는 경우
  if (direction === slideConfig.left && count > 0) {
    moved = moved + totalWidth / divide;
    count = count - 1;
    // 앞으로(오른쪽) 가는 경우
  } else if (direction === slideConfig.right && Math.abs(count) + 1 < divide) {
    moved = moved + -(totalWidth / divide);
    count = count + 1;
  }
  ref.current.style.transform = `translateX(${moved}px)`;
};
