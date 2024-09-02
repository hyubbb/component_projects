import DATA from "../../data/movies.json";
import { useCallback, useEffect, useState } from "react";
import { MovieType, MovieTypeWithId } from "../type/type";
import { useKeyboardNav } from "./useKeyboardNav";
import { useInitialData } from "./useInitialData";

export const useMovieSearch = (
  inputRef: React.RefObject<HTMLInputElement>,
  id: string
) => {
  const [movieData, setMovieData] = useState<MovieTypeWithId[]>([]); // 검색된 영화 데이터
  const [selectedMovie, setSelectedMovie] = useState<MovieTypeWithId | null>(
    null
  ); // 선택된 영화
  const [searchTerm, setSearchTerm] = useState<string>(""); // 검색어
  const [isActive, setIsActive] = useState<boolean>(false); // 검색창 활성화 여부
  const [cursorFocus, setCursorFocus] = useState<number>(-1); // 커서 위치
  const [isTyping, setIsTyping] = useState<boolean>(false); // 타이핑 여부

  // 배열타입 데이터
  const fetchData = DATA as MovieType[];

  // 함수타입 데이터
  // const fetchData = async (): Promise<MovieType[]> => {
  //   // 모의 API 호출
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve(DATA as MovieType[]);
  //     }, 1000);
  //   });
  // };

  const { originData, isLoading } = useInitialData(fetchData, setMovieData); // 초기 데이터 로드

  const { handleKeyArrow } = useKeyboardNav({
    isActive,
    setIsActive,
    setCursorFocus,
    movieData,
    cursorFocus,
    selectedMovie,
    handleSelect,
  });

  useEffect(() => {
    // 검색시에는 검색어에 맞는 데이터만 보여주고,
    // 그외에는 전체 데이터를 보여줌
    if (isTyping) {
      setMovieData(
        originData.filter((movie) =>
          movie.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setMovieData(originData);
    }
  }, [searchTerm, isTyping, originData]);

  // 검색어 입력시
  const handleSearchChange = useCallback((value: string) => {
    if (!isActive) {
      setIsActive(true);
    }
    const newValue = value;
    setSearchTerm(newValue);

    setIsTyping(true);
  }, []);

  // 검색어 입력시 커서 위치 설정
  useEffect(() => {
    if (searchTerm === "") {
      setSelectedMovie(null);
      setCursorFocus(-1);
    } else {
      const searchElm = document.querySelector(`.search-${id}`) as HTMLElement;
      const listElm = searchElm.querySelector(`.search-list`) as HTMLElement;
      const selectedItem = listElm.querySelector(
        `li[aria-selected=true]`
      ) as HTMLElement;

      if (listElm && selectedItem) {
        const items = Array.from(listElm.querySelectorAll("li"));
        const index = items.indexOf(selectedItem as HTMLLIElement);
        setCursorFocus(index);
      }
    }
  }, [movieData]);

  // 검색창 포커스
  const handleInputFocus = () => {
    inputRef?.current?.focus();
    setIsActive((prev) => !prev);
    setCursorFocus(selectedMovie ? selectedMovie.id : -1);
  };

  const handleClose = useCallback(() => {
    setSearchTerm("");
    setSelectedMovie(null);
    setIsTyping(false);
    setCursorFocus(-1);
  }, []);

  // 선택한 영화를 검색어로 설정
  function handleSelect(movie: MovieTypeWithId) {
    if (!movie) return;
    setSelectedMovie(movie);
    setSearchTerm(movie?.title);
    setCursorFocus(movie.id);
    setIsActive(false);
    setIsTyping(false);
  }

  return {
    selectedMovie,
    movieData,
    searchTerm,
    cursorFocus,
    isActive,
    isLoading,
    setSearchTerm,
    setSelectedMovie,
    setIsActive,
    setCursorFocus,
    setIsTyping,
    handleSelect,
    handleSearchChange,
    handleInputFocus,
    handleClose,
    handleKeyArrow,
  };
};
