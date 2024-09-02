import { RefObject, useEffect } from "react";

type RefsProps = {
  listRef: RefObject<HTMLDivElement>;
  searchRef: RefObject<HTMLDivElement>;
  inputRef: RefObject<HTMLInputElement>;
  isLoading: boolean;
};

export const setListMaxLength = ({
  listRef,
  searchRef,
  isLoading,
}: RefsProps) => {
  const getMaxWidth = () => {
    if (listRef.current) {
      // visible인 list의 가로너비를 계산하기 위해서 임시로 노드를 생성
      const clone = listRef.current.cloneNode(true) as HTMLElement;
      clone.style.display = "block";
      clone.style.position = "absolute";
      clone.style.top = "-9999px";
      clone.style.width = "auto";
      document.body.appendChild(clone);

      const listItems = clone.querySelectorAll("li");
      const maxWidth = Math.max(
        ...Array.from(listItems).map((item) => item.clientWidth)
      );
      document.body.removeChild(clone);

      const btnWidth =
        document.querySelector(".btn-container")?.clientWidth || 0;
      const temp = 20; // 여백

      return maxWidth + btnWidth + temp;
    }
  };

  useEffect(() => {
    // 가로 너비가 가장 넓은 요소 기준으로 너비 조정
    const adjustWidth = () => {
      if (!isLoading && listRef.current && searchRef.current) {
        const maxWidth = getMaxWidth() || 500;
        const windowWidth = window.innerWidth;
        const calculatedWidth = Math.min(windowWidth - 20, maxWidth); // 20px 여백
        searchRef.current.style.width = `${calculatedWidth}px`;
        listRef.current.style.width = `${calculatedWidth}px`;
      }
    };

    adjustWidth();

    window.addEventListener("resize", adjustWidth);
    return () => {
      window.removeEventListener("resize", adjustWidth);
    };
  }, [listRef, searchRef, isLoading]);
};
