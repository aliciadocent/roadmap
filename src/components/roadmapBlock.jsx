import { useEffect, useRef, useState } from "react";
import "./roadmapBlock.css";

export default function RoadmapBlock() {
  const [semesters, setSemesters] = useState([]);
  const [introductieSemesters, setIntroductieSemesters] = useState([]);
  const [mainSemesters, setMainSemesters] = useState([]);
  const [startSemesters, setStartSemesters] = useState([]);
  const [afstuderenSemesters, setAfstuderenSemesters] = useState([]);
  const [functies, setFuncties] = useState([]);
  const [rowLength, setRowLength] = useState(0);
  const containerRef = useRef();

  useEffect(() => {
    async function loadData() {
      const semestersResponse = await fetch("json/semesters.json");
      const semJson = await semestersResponse.json();

      const functieResponse = await fetch("json/ad.json");
      const functieJson = await functieResponse.json();

      const start = semJson.filter((s) => s.semester === "start");
      const intro = semJson.filter((s) => s.semester === "introductie");
      const main = semJson.filter((s) => s.semester === "main");
      const afstuderen = semJson.filter((s) => s.semester === "afstuderen");

      setSemesters(semJson);
      setStartSemesters(start);
      setIntroductieSemesters(intro);
      setMainSemesters(main);
      setAfstuderenSemesters(afstuderen);
      setFuncties(functieJson);

      const max = Math.max(intro.length, main.length, functieJson.length);
      setRowLength(max);
    }

    loadData();
  }, []);

  const handleBlockClick = (semester, id, listId) => {
    switch (semester) {
      case "start": {
        if (startSemesters[0]?.class === "clickable") {
          // update startsemester naar 'last-selected'
          setStartSemesters((prev) =>
            prev.map((s) => ({ ...s, class: "last-selected" }))
          );

          // maak introducties clickable
          setIntroductieSemesters((prev) =>
            prev.map((obj) => ({ ...obj, class: "clickable" }))
          );
        }
        break;
      }

      case "introductie": {
        const clicked = introductieSemesters[listId];
        if (clicked?.class === "clickable") {
          // zet start op 'passed'
          setStartSemesters((prev) =>
            prev.map((s) => ({ ...s, class: "passed" }))
          );

          // markeer huidige introductie en de rest als 'not-selected'
          setIntroductieSemesters((prev) =>
            prev.map((obj) =>
              obj.id === id
                ? { ...obj, class: "last-selected" }
                : { ...obj, class: "not-selected" }
            )
          );

          // maak main semesters clickable
          setMainSemesters((prev) =>
            prev.map((obj) => ({ ...obj, class: "clickable" }))
          );
        }
        break;
      }

      case "main": {
        const clicked = mainSemesters[listId];
        if (clicked?.class === "clickable") {
          // update introductie status
          setIntroductieSemesters((prev) =>
            prev.map((obj) =>
              obj.class === "last-selected"
                ? { ...obj, class: "passed" }
                : { ...obj, class: "not-selected" }
            )
          );

          // markeer huidige main als 'last-selected'
          setMainSemesters((prev) =>
            prev.map((obj) =>
              obj.id === id
                ? { ...obj, class: "passed" }
                : { ...obj, class: "not-selected" }
            )
          );

          setAfstuderenSemesters((prev) =>
            prev.map((s) => ({ ...s, class: "passed" }))
          );
        }
        break;
      }

      default:
        console.warn("Onbekend semester:", semester);
    }
  };

  if (!semesters.length) return <div>Loading...</div>;

  return (
    <div className="container" id="roadmapBlock" ref={containerRef}>
      <div className="block grid-col-2 year">Jaar 1</div>
      <div className="block grid-col-2 year">Jaar 2</div>
      <div className="block grid-col-1 function">Functie</div>

      {startSemesters[0] ? (
        <div
          key={`start-${0}`}
          className={`block ${startSemesters[0].class} grid-col-1 grid-row-1 start`}
          data-id={`start-${startSemesters[0].id}`}
          onClick={() => {
            handleBlockClick("start", startSemesters[0].id);
          }}
        >
          {startSemesters[0].naam}
        </div>
      ) : (
        <div key={`start-placeholder grid-row-1`} className="placeholder" />
      )}

      <div className="intro-rij">
        {Array.from({ length: rowLength }).map((_, i) =>
          introductieSemesters[i] ? (
            <div
              key={`intro-${i}`}
              className={`block ${introductieSemesters[i].class} intro`}
              data-id={`intro-${introductieSemesters[i].id}`}
              onClick={() => {
                handleBlockClick("introductie", introductieSemesters[i].id, i);
              }}
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
              key={`main-${i} ${mainSemesters[i].class}`}
              className={`block ${mainSemesters[i].class} main`}
              data-id={`main-${mainSemesters[i].id}`}
              onClick={() => {
                handleBlockClick("main", mainSemesters[i].id, i);
              }}
            >
              {mainSemesters[i].naam}
            </div>
          ) : (
            <div key={`main-placeholder-${i}`} className="placeholder" />
          )
        )}
      </div>

      {afstuderenSemesters[0] ? (
        <div
          key={`afstuderen-${0}`}
          className={`block ${afstuderenSemesters[0].class} grid-col-1 grid-row-1 start`}
          data-id={`afstuderen-${afstuderenSemesters[0].id}`}
        >
          {afstuderenSemesters[0].naam}
        </div>
      ) : (
        <div key={`start-placeholder grid-row-1`} className="placeholder" />
      )}

      <div className="functies-rij">
        {Array.from({ length: rowLength }).map((_, i) =>
          functies[i] ? (
            <div
              key={`functie-${i}`}
              className={`block col-1 functie`}
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
