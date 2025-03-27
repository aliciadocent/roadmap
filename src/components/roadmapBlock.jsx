import { useEffect, useRef, useState } from "react";
import "./roadmapBlock.css";

export default function RoadmapBlock() {
  const [semesters, setSemesters] = useState([]);
  const [startSemesters, setStartSemesters] = useState([]);
  const [introductieSemesters, setIntroductieSemesters] = useState([]);
  const [mainSemesters, setMainSemesters] = useState([]);
  const [afstuderenSemesters, setAfstuderenSemesters] = useState([]);
  const [functies, setFuncties] = useState([]);
  const [rowLength, setRowLength] = useState(0);
  const containerRef = useRef();

  // Data laden uit JSON bestanden
  useEffect(() => {
    async function loadData() {
      const semestersResponse = await fetch("json/semesters.json");
      const semJson = await semestersResponse.json();

      const functieResponse = await fetch("json/ad.json");
      const functieJson = await functieResponse.json();

      // Groepeer semesters op type
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

  // Helper functie om klassen van een lijst bij te werken
  const updateClasses = (list, setter, conditionFn) => {
    setter(
      list.map((item) => ({
        ...item,
        class: conditionFn(item),
      }))
    );
  };

  // Afhandelen van klikken op een blok
  const handleBlockClick = (semester, id, listId) => {
    switch (semester) {
      case "start": {
        if (startSemesters[0]?.class === "clickable") {
          updateClasses(
            startSemesters,
            setStartSemesters,
            () => "last-selected"
          );
          updateClasses(
            introductieSemesters,
            setIntroductieSemesters,
            () => "clickable"
          );
        }
        break;
      }

      case "introductie": {
        const clicked = introductieSemesters[listId];
        if (clicked?.class === "clickable") {
          updateClasses(startSemesters, setStartSemesters, () => "passed");

          updateClasses(introductieSemesters, setIntroductieSemesters, (obj) =>
            obj.id === id ? "last-selected" : "not-selected"
          );

          const allowedMainIds = clicked?.ad || [];
          updateClasses(mainSemesters, setMainSemesters, (obj) =>
            allowedMainIds.includes(obj.id) ? "clickable" : "not-selected"
          );
        }
        break;
      }

      case "main": {
        const clicked = mainSemesters[listId];
        if (clicked?.class === "clickable") {
          // Zet de introductie met class 'last-selected' op 'passed'
          setIntroductieSemesters((prev) =>
            prev.map((obj) =>
              obj.class === "last-selected" ? { ...obj, class: "passed" } : obj
            )
          );

          // Zet alle main semesters op 'not-selected', behalve degene die je kiest
          setMainSemesters((prev) =>
            prev.map((obj) =>
              obj.id === id
                ? { ...obj, class: "last-selected" }
                : { ...obj, class: "not-selected" }
            )
          );

          // ✅ Afstuderen mag nu ook groen worden
          setAfstuderenSemesters((prev) =>
            prev.map((s) => ({ ...s, class: "passed" }))
          );

          // Functies bepalen op basis van gekozen introductie en main semester
          const introChoiceObj = introductieSemesters.find(
            (s) => s.class === "passed" || s.class === "last-selected"
          );
          const introChoice = introChoiceObj?.id;

          const mainChoice = id;

          const allowedFunctieIds = functies
            .map((f, index) => {
              if (
                f.semester_2?.includes(introChoice) &&
                f.semester_3 === mainChoice
              ) {
                return index + 1;
              }
              return null;
            })
            .filter((id) => id !== null);

          setFuncties((prev) =>
            prev.map((obj, index) =>
              allowedFunctieIds.includes(index + 1)
                ? { ...obj, class: "passed" }
                : { ...obj, class: "not-selected" }
            )
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
          onClick={() => handleBlockClick("start", startSemesters[0].id)}
        >
          {startSemesters[0].naam}
        </div>
      ) : (
        <div key={`start-placeholder`} className="placeholder grid-row-1" />
      )}

      <div className="intro-rij">
        {introductieSemesters.map((s, i) => (
          <div
            key={`intro-${i}`}
            className={`block ${s.class} intro`}
            data-id={`intro-${s.id}`}
            onClick={() => handleBlockClick("introductie", s.id, i)}
          >
            {s.naam}
          </div>
        ))}
      </div>

      <div className="main-rij">
        {mainSemesters.map((s, i) => (
          <div
            key={`main-${i}`}
            className={`block ${s.class} main`}
            data-id={`main-${s.id}`}
            onClick={() => handleBlockClick("main", s.id, i)}
          >
            {s.naam}
          </div>
        ))}
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
        <div
          key={`afstuderen-placeholder`}
          className="placeholder grid-row-1"
        />
      )}

      <div className="functies-rij">
        {functies.map((f, i) => (
          <div
            key={`functie-${i}`}
            className={`block col-1 functie ${f.class}`}
            data-id={`functie-${i}`}
          >
            {f.functie}
          </div>
        ))}
      </div>
    </div>
  );
}
