import { useState } from "react";
import "./App.css";
import RoadmapBlockAd from "./components/roadmapBlockAd";
import RoadmapBlockAdBackwards from "./components/roadmapBlockAdBackwards";

function App() {
  const [activeTab, setActiveTab] = useState("achteruit");

  return (
    <div className="container">
      <h1>Roadmap studenten Associate degree</h1>

      <div className="tabs">
        <button
          className={activeTab === "achteruit" ? "tab active" : "tab"}
          onClick={() => setActiveTab("achteruit")}
        >
          Vanuit functie
        </button>
        <button
          className={activeTab === "vooruit" ? "tab active" : "tab"}
          onClick={() => setActiveTab("vooruit")}
        >
          Vanuit semesters
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "vooruit" ? (
          <RoadmapBlockAd />
        ) : (
          <RoadmapBlockAdBackwards />
        )}
      </div>
    </div>
  );
}

export default App;
