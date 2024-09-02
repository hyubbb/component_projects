import { CSSProperties } from "react";
import "./App.css";
import { Blank } from "./components/Blank";
import { Select } from "./components/Select";

function App() {
  const styled: CSSProperties = {
    display: "flex",
    padding: "30px 0",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };
  return (
    <div style={styled}>
      <Select id='1' />
      <Blank height={600} />
      <Select id='2' />
      <Blank height={600} />
    </div>
  );
}

export default App;
