import { forwardRef, useRef } from "react";
import { MovieTypeWithId } from "../type/type";
import { setDropdownPosition } from "../utils/setDropdownPosition";
import { scrollInto } from "../utils/scrollInto";

type MovieListProps = {
  id: string;
  isActive: boolean;
  movieData: any[];
  searchTerm: string;
  cursorFocus: number;
  selectedMovie: MovieTypeWithId | null;
  onSelect: (movie: MovieTypeWithId) => void;
  onCursorFocus: (index: number) => void;
};

export const MovieList = forwardRef<HTMLDivElement, MovieListProps>(
  (
    {
      id,
      isActive,
      movieData,
      selectedMovie,
      searchTerm,
      cursorFocus,
      onSelect,
      onCursorFocus,
    },
    ref
  ) => {
    const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

    // 스크린상의 select의 위치에 의해 검색리스트의 포지션을 결정
    setDropdownPosition({ id, isActive, searchTerm });

    // 검색리스트의 커서가 선택된 영화로 이동
    scrollInto({ itemRefs, cursorFocus });

    return (
      <div ref={ref} className={`search-list ${isActive ? "active" : ""}`}>
        <ul>
          {movieData.map((movie, i) => {
            return (
              <li
                key={i}
                ref={(el) => (itemRefs.current[i] = el)}
                className={`item_${i} ${cursorFocus === i ? "cursor" : ""}`}
                onClick={() => onSelect(movie)}
                onMouseOver={() => onCursorFocus(i)}
                aria-selected={
                  selectedMovie?.title === movie.title ? true : false
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onSelect(movie);
                  }
                }}
                tabIndex={0}
              >
                {movie.title}
              </li>
            );
          })}
          {movieData.length === 0 && (
            <li className='no-data'>데이터가 존재 하지 않습니다.</li>
          )}
        </ul>
      </div>
    );
  }
);
