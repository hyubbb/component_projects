export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testMatch: ["<rootDir>/tests/jest/**/?(*.)+(spec|test).[tj]s?(x)"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};
