import { useEffect, useRef, useState } from "react";
import "./roadmapBlock.css";

export default function RoadmapBlock() {
  const [semesters, setSemesters] = useState([]);
  const [introductieSemesters, setIntroductieSemesters] = useState([]);
  const [mainSemesters, setMainSemesters] = useState([]);
  const [functies, setFuncties] = useState([]);
  const [rowLength, setRowLength] = useState(0);
  const containerRef = useRef();
  const [roadmap, setRoadmap] = useState([null, null, null]);

  useEffect(() => {
    async function loadData() {
      const semestersResponse = await fetch("json/semesters.json");
      const semJson = await semestersResponse.json();

      const functieResponse = await fetch("json/ad.json");
      const functieJson = await functieResponse.json();

      const intro = semJson.filter((s) => s.semester === "introductie");
      const main = semJson.filter((s) => s.semester === "main");

      setSemesters(semJson);
      setIntroductieSemesters(intro);
      setMainSemesters(main);
      setFuncties(functieJson);

      const max = Math.max(intro.length, main.length, functieJson.length);
      setRowLength(max);
    }

    loadData();
  }, []);

  const handleBlockClick = (id) => {
    const block = semesters.find((s) => s.id === id);
    if (!block) return;

    const newRoadmap = [...roadmap];

    switch (block.semester) {
      case "startsemester":
        newRoadmap[0] = id;
        newRoadmap[1] = null;
        newRoadmap[2] = null;
        break;
      case "introductie":
        newRoadmap[1] = id;
        newRoadmap[2] = null;
        break;
      case "main":
        newRoadmap[2] = id;
        break;
      default:
        break;
    }

    setRoadmap(newRoadmap);
  };

  const getAllFutureIds = (id, visited = new Set()) => {
    if (visited.has(id)) return { ids: [], functies: [] };
    visited.add(id);

    const block = semesters.find((s) => s.id === id);
    if (!block) return { ids: [], functies: [] };

    let ids = [id];
    let functies = block.functies || [];

    if (block.ad) {
      for (const next of block.ad) {
        const result = getAllFutureIds(next, visited);
        ids.push(...result.ids);
        functies.push(...result.functies);
      }
    }

    return { ids: [...new Set(ids)], functies: [...new Set(functies)] };
  };

  const lastChosen = roadmap.slice().reverse().find(Boolean);
  const { ids: futureIds, functies: futureFuncties } = lastChosen
    ? getAllFutureIds(lastChosen)
    : { ids: [], functies: [] };

  const getClass = (id) => {
    if (roadmap.includes(id)) return "block chosen";
    if (futureIds.includes(id)) return "block future";
    return "block";
  };

  if (!semesters.length) return <div>Loading...</div>;

  return (
    <div className="container" id="roadmapBlock" ref={containerRef}>
      <div className="block grid-col-2">Jaar 1</div>
      <div className="block grid-col-2">Jaar 2</div>
      <div className="block grid-col-1">Functie</div>

      <div
        className={`${getClass(1)} grid-col-1 grid-row-1`}
        data-id="start"
        onClick={() => handleBlockClick(1)}
      >
        Startsemester
      </div>

      <div className="intro-rij">
        {Array.from({ length: rowLength }).map((_, i) =>
          introductieSemesters[i] ? (
            <div
              key={`intro-${i}`}
              className={getClass(introductieSemesters[i].id)}
              data-id={`intro-${introductieSemesters[i].id}`}
              onClick={() => handleBlockClick(introductieSemesters[i].id)}
            >
              {introductieSemesters[i].naam}
            </div>
          ) : (
            <div key={`intro-placeholder-${i}`} className="placeholder" />
          )
        )}
      </div>

      <div className="main-rij">
        {Array.from({ length: rowLength }).map((_, i) =>
          mainSemesters[i] ? (
            <div
              key={`main-${i}`}
              className={getClass(mainSemesters[i].id)}
              data-id={`main-${mainSemesters[i].id}`}
              onClick={() => handleBlockClick(mainSemesters[i].id)}
            >
              {mainSemesters[i].naam}
            </div>
          ) : (
            <div key={`main-placeholder-${i}`} className="placeholder" />
          )
        )}
      </div>

      <div
        className={`${getClass(20)} grid-col-1 grid-row-1`}
        data-id="end"
        onClick={() => handleBlockClick(20)}
      >
        Afstuderen
      </div>

      <div className="functies-rij">
        {Array.from({ length: rowLength }).map((_, i) =>
          functies[i] ? (
            <div
              key={`functie-${i}`}
              className={`block col-1 ${
                futureFuncties.includes(i + 1) ? "future" : ""
              }`}
              data-id={`functie-${i}`}
            >
              {functies[i].functie}
            </div>
          ) : (
            <div key={`functie-placeholder-${i}`} className="placeholder" />
          )
        )}
      </div>
    </div>
  );
}
