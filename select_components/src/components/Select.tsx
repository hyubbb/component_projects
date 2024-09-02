import React, { useRef } from "react";
import "../App.css";

import { useOutsideClick } from "../hooks/useOutsideClick";
import { MovieList } from "./MovieList";
import { useMovieSearch } from "../hooks/useMovieSearch";
import { setListMaxLength } from "../utils/setListMaxLength";
import { SearchInput } from "./SearchInput";

export const Select = React.memo(({ id }: { id: string }) => {
  const searchRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const {
    selectedMovie,
    movieData,
    searchTerm,
    isActive,
    cursorFocus,
    isLoading,
    setCursorFocus,
    setSearchTerm,
    setIsActive,
    setIsTyping,
    handleSelect,
    handleSearchChange,
    handleInputFocus,
    handleClose,
    handleKeyArrow,
  } = useMovieSearch(inputRef, id);

  setListMaxLength({ inputRef, listRef, searchRef, isLoading });

  useOutsideClick({
    ref: searchContainerRef,
    onOutsideClick: () => {
      setSearchTerm(selectedMovie?.title || "");
      setIsTyping(false);
      setIsActive(false);
    },
  });

  return (
    <>
      <div ref={searchContainerRef} className={`search-${id} search-container`}>
        <SearchInput
          isActive={isActive}
          isLoading={isLoading}
          searchTerm={searchTerm}
          inputRef={inputRef}
          searchRef={searchRef}
          onSearchChange={handleSearchChange}
          onInputFocus={handleInputFocus}
          onClear={handleClose}
          onKeyArrow={handleKeyArrow}
        />
        {/* active활성화 시, 리스트 활성 */}
        <MovieList
          id={id}
          ref={listRef}
          isActive={isActive}
          selectedMovie={selectedMovie}
          searchTerm={searchTerm}
          movieData={movieData}
          cursorFocus={cursorFocus}
          onSelect={handleSelect}
          onCursorFocus={(i: number) => setCursorFocus(i)}
        />
      </div>
    </>
  );
});
