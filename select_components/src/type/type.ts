export type MovieType = {
  title: string;
  year: number;
};

export type MovieTypeWithId = MovieType & {
  id: number;
};

export type MovieData = MovieType[] | (() => Promise<MovieType[]>);
