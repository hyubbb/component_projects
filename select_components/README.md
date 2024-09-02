# React + TypeScript + Vite
 
## 실행 명령어
npm run dev
 
## test 명령어
npm run test  -> All test
npm run test:jest
npm run test:playwright

`jest`로 select의 옵션타입을 테스트 하였고
`playwright`로 나머지 테스트를 진행 하였습니다.
playwright는 서버를 실행해야 테스트를 진행 할 수 있습니다.

src
 ┣ components <br/>
 ┃ ┣ Icons                   -> SVG ICON <br/>
 ┃ ┣ Blank                  -> 여백설정을 위한 임시 컴포넌트 <br/>
 ┃ ┣ MovieList.tsx          -> 영화 리스트 컴포넌트 <br/>
 ┃ ┣ SearchInput.tsx        -> 검색 컴포넌트 <br/>
 ┃ ┗ Select.tsx             -> 리스트, 검색 컴포넌트의 부모컴포넌트 <br/>
 ┣ hooks
 ┃ ┣ useDebounce.tsx        -> input 디바운스 훅 <br/>
 ┃ ┣ useInitialData.tsx     -> 초기 데이터 가공을 위한 훅 <br/>
 ┃ ┣ useKeyboardNav.tsx     -> select의 option을 키보드로 제어하기 위한 훅 <br/>
 ┃ ┣ useMovieSearch.tsx     -> 메인 변수관리용 훅 <br/>
 ┃ ┗ useOutsideClick.tsx    -> select 외부를 눌렀을때 창이 닫히게 하기 위한 훅 <br/>
 ┣ type <br/>
 ┃ ┗ type.ts                -> 공용 타입 <br/>
 ┣ utils <br/>
 ┃ ┣ setDropdownPosition.ts -> 옵션이 화면을 벗어나지 않게 하기 위한 유틸함수 <br/>
 ┃ ┗ setListMaxLength.tsx   -> option의 최대넓이로 설정하는 훅 <br/>
 ┣ App.css <br/>
 ┣ App.tsx <br/>
 ┣ main.tsx <br/>
 ┗ vite-env.d.ts <br/>
 <br/>
 tests <br/>
 ┣ jest <br/>
 ┃ ┗ fetchData.spec.tsx   -> select의 옵션타입 테스트를 위한 jest 테스트 파일 <br/>
 ┗ playwright <br/>
 ┃ ┗ playwright.spec.ts   -> 그 외의 테스트를 위한 playwright 테스트 파일 <br/>
