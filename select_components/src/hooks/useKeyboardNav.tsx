import { useCallback } from "react";
import { MovieTypeWithId } from "../type/type";

type UseKeyboardNavProps = {
  isActive: boolean;
  cursorFocus: number;
  movieData: MovieTypeWithId[];
  selectedMovie: MovieTypeWithId | null;
  handleSelect: (movie: MovieTypeWithId) => void;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  setCursorFocus: React.Dispatch<React.SetStateAction<number>>;
};

export const useKeyboardNav = ({
  isActive,
  movieData,
  cursorFocus,
  selectedMovie,
  handleSelect,
  setIsActive,
  setCursorFocus,
}: UseKeyboardNavProps) => {
  const handleKeyArrow = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isActive) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          setIsActive(true);
        }
        return;
      }

      if (e.key === "ArrowDown") {
        setCursorFocus((prevIndex: number) =>
          prevIndex + 1 === movieData.length ? 0 : prevIndex + 1
        );
      }

      if (e.key === "ArrowUp") {
        setCursorFocus((prevIndex: number) =>
          prevIndex - 1 < 0 ? movieData.length - 1 : prevIndex - 1
        );
      }

      if (e.key === "Enter") {
        if (cursorFocus >= 0 && movieData[cursorFocus]) {
          handleSelect(movieData[cursorFocus]);
        }
      }

      if (e.key === "Escape") {
        setIsActive(false);
        setCursorFocus(selectedMovie?.id || 0);
      }
    },
    [isActive, cursorFocus, movieData, selectedMovie, handleSelect]
  );

  return { handleKeyArrow };
};
