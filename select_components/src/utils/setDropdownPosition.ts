import { useLayoutEffect } from "react";

type propsType = {
  id: string;
  isActive: boolean;
  searchTerm: string;
};

export const setDropdownPosition = ({
  id,
  isActive,
  searchTerm,
}: propsType) => {
  useLayoutEffect(() => {
    const containerElm = document.querySelector(`.search-${id}`) as HTMLElement;
    const searchElm = containerElm?.querySelector(`.search`) as HTMLElement;
    const listElm = containerElm?.querySelector(`.search-list`) as HTMLElement;

    const handleScroll = () => {
      if (!isActive) return;
      if (searchElm && listElm) {
        const searchRect = searchElm.getBoundingClientRect();

        const middleScreenY =
          Math.abs(window.innerHeight - searchRect.height) / 2;

        // 화면의 중앙을 기준으로 크기를 비교하여 영화 리스트의 위치를 결정
        if (searchRect.y > middleScreenY) {
          // 위쪽에 위치시
          listElm.style.top = "auto";
          listElm.style.bottom = searchRect.height + "px";
        } else {
          listElm.style.top = searchRect.height + "px";
          listElm.style.bottom = "auto";
        }
      }
    };
    handleScroll();

    // 요소의 크기 변화를 감지, 감지시 콜백함수 실행
    const resizeObserver = new ResizeObserver(() => {
      handleScroll();
    });

    if (listElm) {
      resizeObserver.observe(listElm);
    }

    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, [isActive, searchTerm, id]);
};
