import { act, renderHook } from "@testing-library/react";
import { useInitialData } from "../../src/hooks/useInitialData";
import { MovieType } from "../../src/type/type";

const initData = [
  {
    title: "The Matrix",
    year: 1999,
  },
  {
    title: "Seven Samurai",
    year: 1954,
  },
  {
    title: "Star Wars: Episode IV - A New Hope",
    year: 1977,
  },
  {
    title: "City of God",
    year: 2002,
  },
  {
    title: "Se7en",
    year: 1995,
  },
];

const mockFetchData = async (): Promise<MovieType[]> => {
  return initData;
};

const mockArrayData = initData as MovieType[];

describe("useInitialData", () => {
  it("초기값이 함수타입 일때", async () => {
    const mockSetMovieData = jest.fn();
    const { result } = renderHook(() =>
      useInitialData(mockFetchData, mockSetMovieData)
    );

    // 비동기 업데이트 대기
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.originData).toHaveLength(5);

    // 초기값에 id를 추가해주기 때문에 id값이 추가된 데이터와 비교
    for (let i = 0; i < result.current.originData.length; i++) {
      expect(result.current.originData[i]).toEqual({ ...initData[i], id: i });
    }
  });

  it("초기값이 배열타입 일때", async () => {
    const mockSetMovieData = jest.fn();
    const { result } = renderHook(() =>
      useInitialData(mockArrayData, mockSetMovieData)
    );

    // 비동기 업데이트 대기
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.originData).toHaveLength(5);

    // 초기값에 id를 추가해주기 때문에 id값이 추가된 데이터와 비교
    for (let i = 0; i < result.current.originData.length; i++) {
      expect(result.current.originData[i]).toEqual({ ...initData[i], id: i });
    }
  });
});
