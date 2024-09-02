import { RefObject, useEffect, useState } from "react";
import { CloseIcon } from "./Icons/CloseIcon";
import { ChevronUp } from "./Icons/ChevronUp";
import { ChevronDown } from "./Icons/ChevronDown";
import { useDebounce } from "../hooks/useDebounce";

type SearchInputProps = {
  isActive: boolean;
  isLoading: boolean;
  searchTerm: string;
  onSearchChange: (v: string) => void;
  onKeyArrow: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onInputFocus: () => void;
  onClear: () => void;
  inputRef: RefObject<HTMLInputElement>;
  searchRef: RefObject<HTMLDivElement>;
};

export const SearchInput = ({
  isActive,
  isLoading,
  searchTerm,
  onSearchChange,
  onInputFocus,
  onKeyArrow,
  onClear,
  inputRef,
  searchRef,
}: SearchInputProps) => {
  const [inputValue, setInputValue] = useState<string>("");
  const debouncedSearchTerm = useDebounce(inputValue, 200);

  useEffect(() => {
    if (inputRef.current) {
      inputRef?.current?.focus();
    }
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) {
      onSearchChange(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    // has-value 는 label의 설정을 위한 값
    <div
      ref={searchRef}
      className={`search ${isActive ? "active" : ""} ${
        searchTerm ? "has-value" : ""
      }`}
      onClick={onInputFocus}
      tabIndex={0}
      data-loading={isLoading}
    >
      {/* 비활성시 값의 유무에 따라 label의 위치가 달라짐 */}
      <label
        id='search-label'
        className={`${!isActive && !inputValue ? "" : "active"}`}
        htmlFor='searchInput'
      >
        Movie
      </label>
      <input
        ref={inputRef}
        id='search-input'
        type='text'
        onChange={handleInputChange}
        value={inputValue}
        onKeyDown={onKeyArrow}
        autoComplete='off'
        disabled={isLoading}
      />
      {/* 검색어의 존재유무에따른 버튼활성, hover처리는 css */}
      <div className='btn-container'>
        <button
          className={`search-closeBtn ${
            isActive && inputValue ? "active" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
        >
          <CloseIcon />
        </button>
        <button
          className='activeBtn'
          onClick={(e) => {
            e.stopPropagation();
            onInputFocus();
          }}
        >
          {isActive ? <ChevronDown /> : <ChevronUp />}
        </button>
      </div>
    </div>
  );
};
