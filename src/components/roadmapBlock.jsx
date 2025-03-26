import { useEffect, useRef, useState } from "react";
import "./roadmapBlock.css";

export default function RoadmapBlock() {
  const [semesters, setSemesters] = useState([]);
  const [introductieSemesters, setIntroductieSemesters] = useState([]);
  const [mainSemesters, setMainSemesters] = useState([]);
  const [functies, setFuncties] = useState([]);
  const [rowLength, setRowLength] = useState(0);
  const [highlightIds, setHighlightIds] = useState([]);
  const [highlightFunctieIds, setHighlightFunctieIds] = useState([]);
  const containerRef = useRef();

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

  const getHighlightPath = (startId, visited = new Set()) => {
    if (visited.has(startId)) return { ids: [], functies: [] };
    visited.add(startId);

    const start = semesters.find((s) => s.id === startId);
    if (!start) return { ids: [], functies: [] };

    let ids = [startId];
    let functies = start.functies || [];

    if (start.ad) {
      start.ad.forEach((nextId) => {
        const result = getHighlightPath(nextId, visited);
        ids = [...ids, ...result.ids];
        functies = [...functies, ...result.functies];
      });
    }

    return { ids: [...new Set(ids.concat(20))], functies: [...new Set(functies)] };
  };

  if (!semesters.length) return <div>Loading...</div>;

  const handleBlockClick = (id) => {
    const result = getHighlightPath(id);
    setHighlightIds(result.ids);
    setHighlightFunctieIds(result.functies);
  };

  return (
    <div className="container" id="roadmapBlock" ref={containerRef}>
      <div className="block grid-col-2">Jaar 1</div>
      <div className="block grid-col-2">Jaar 2</div>
      <div className="block grid-col-1">Functie</div>

      <div
        className={`block grid-col-1 grid-row-1 ${highlightIds.includes(1) ? "highlight" : ""}`}
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
              className={`block ${highlightIds.includes(introductieSemesters[i].id) ? "highlight" : ""}`}
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
              className={`block ${highlightIds.includes(mainSemesters[i].id) ? "highlight" : ""}`}
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
        className={`block grid-col-1 grid-row-1 ${highlightIds.includes(20) ? "highlight" : ""}`}
        data-id="end"
      >
        Afstuderen
      </div>

      <div className="functies-rij">
        {Array.from({ length: rowLength }).map((_, i) =>
          functies[i] ? (
            <div
              key={`functie-${i}`}
              className={`block ${highlightFunctieIds.includes(i + 1) ? "highlight" : ""}`}
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
