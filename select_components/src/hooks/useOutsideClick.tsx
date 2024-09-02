import { useEffect } from "react";

type UseOutsideClickProps = {
  onOutsideClick: () => void;
  ref: React.RefObject<HTMLDivElement>;
};

// 검색창 외부 클릭 시 검색어 초기화 / 검색창 닫기
// 선택된 영화가 있으면 선택된 영화의 제목을 검색어로 보여줌
export const useOutsideClick = ({
  onOutsideClick,
  ref,
}: UseOutsideClickProps) => {
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onOutsideClick();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [ref, onOutsideClick]);
};
