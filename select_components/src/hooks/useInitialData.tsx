import { useState, useEffect } from "react";
import { MovieData, MovieType, MovieTypeWithId } from "../type/type";

export const useInitialData = (
  DATA: MovieData,
  setMovieData: React.Dispatch<React.SetStateAction<MovieTypeWithId[]>>
) => {
  const [originData, setOriginData] = useState<MovieTypeWithId[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const dataTypeCheck = async (data: MovieData) => {
    let newData: MovieType[];
    if (typeof data === "function") {
      newData = await data();
    } else {
      newData = data;
    }
    return newData;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const INDEX_DATA = await dataTypeCheck(DATA as MovieType[]);
        const indexedData = INDEX_DATA.map((movie, index) => ({
          ...movie,
          id: index,
        }));
        setOriginData(indexedData);
        setMovieData(indexedData);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return { originData, isLoading };
};
