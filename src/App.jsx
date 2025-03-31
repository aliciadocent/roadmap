import { useState } from "react";
import "./App.css";
//import RoadmapBlock from "./components/roadmapBlock";
import RoadmapBlockAd from "./components/roadmapBlockAd";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <div className="container">
          <h1>Roadmap studenten Associate degree</h1>
        </div>
        <RoadmapBlockAd />
      </div>
    </>
  );
}

export default App;
