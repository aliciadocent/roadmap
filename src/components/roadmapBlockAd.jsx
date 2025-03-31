import { useEffect, useState } from "react";
import "./roadmapBlockAd.css";

export default function RoadmapBlockAd() {
  const [alleSemesters, setAlleSemesters] = useState([]);
  const [functies, setFuncties] = useState([]);
  const [clickedPath, setClickedPath] = useState({});

  useEffect(() => {
    async function laadData() {
      const semestersResponse = await fetch("json/semesters_v2.json");
      const semJson = await semestersResponse.json();

      const functiesResponse = await fetch("json/functies.json");
      let functieJson = await functiesResponse.json();

      const gefilterdeSemesters = semJson
        .filter((s) => s.niveau.includes("AD"))
        .sort((a, b) => a.naam.localeCompare(b.naam))
        .map((s) => ({ ...s, class: s.id === 1 ? "clickable" : "" }));

      functieJson = functieJson.map((f) => ({ ...f, class: "" }));

      setAlleSemesters(gefilterdeSemesters);
      setFuncties(functieJson);
    }

    laadData();
  }, []);

  async function handleSemesterFunctieClick(type, id) {
    if (
      alleSemesters.find(
        (s) =>
          s.id === id && (s.class === "clickable" || s.class === "not-clicked-choice")
      )
    ) {
    }
    else {
      return;
    }

    const nieuwePath = { ...clickedPath, [type]: id };
    setClickedPath(nieuwePath);

    const routesResponse = await fetch("json/routes.json");
    const routesJson = await routesResponse.json();

    // Filter alleen AD-routes
    const matchedRoutes = routesJson.filter((r) => r.niveau === "AD");

    // Vind routes die matchen met huidig pad
    const geldigeRoutes = matchedRoutes.filter((route) => {
      return Object.values(nieuwePath).every((value) =>
        route.semesters.includes(value)
      );
    });

    const mogelijkeIdsPerType = {
      Start: new Set(),
      Introductie: new Set(),
      Main: new Set(),
      Afstuderen: new Set(),
    };

    geldigeRoutes.forEach((r) => {
      r.semesters.forEach((semId, index) => {
        const type = ["Start", "Introductie", "Main", "Afstuderen"][index];
        mogelijkeIdsPerType[type].add(semId);
      });
    });

    const nieuweSemesters = alleSemesters.map((s) => {
      const isClicked = s.id === id;
      const isPrevious = clickedPath[s.type] === s.id;
      const isSameType = s.type === type;
      const isNextColumn =
        Object.keys(mogelijkeIdsPerType).indexOf(s.type) ===
        Object.keys(mogelijkeIdsPerType).indexOf(type) + 1;

      let nieuweClass = "";

      if (isClicked) {
        nieuweClass = "clicked";
      } else if (isPrevious) {
        nieuweClass = "passed-clicked";
      } else if (isSameType) {
        nieuweClass = mogelijkeIdsPerType[s.type].has(s.id)
          ? "not-clicked-choice"
          : "not-clicked";
      } else if (isNextColumn) {
        nieuweClass = mogelijkeIdsPerType[s.type].has(s.id)
          ? "clickable"
          : "not-clickable";
      }

      return { ...s, class: nieuweClass };
    });

    setAlleSemesters(nieuweSemesters);

    // Toon functie pas als het hele pad is ingevuld
    if (
      nieuwePath.Start &&
      nieuwePath.Introductie &&
      nieuwePath.Main &&
      nieuwePath.Afstuderen
    ) {
      const geldigeFunctieIds = geldigeRoutes.map((r) => r.functie);
      setFuncties((prev) =>
        prev.map((f) => ({
          ...f,
          class: geldigeFunctieIds.includes(f.id) ? "chosen" : "not-chosen",
        }))
      );
    } else {
      // Reset functies
      setFuncties((prev) => prev.map((f) => ({ ...f, class: "" })));
    }
  }

  if (!alleSemesters.length) return <div>Laden...</div>;

  return (
    <div className="container" id="roadmap">
      <div className="title year">Jaar 1</div>
      <div className="title year">Jaar 2</div>
      <div className="title function">Functie</div>

      <div className="column" id="start">
        {alleSemesters
          .filter((s) => s.type === "Start")
          .map((s) => (
            <div
              key={`semester-${s.id}`}
              className={`block start ${s.class}`}
              onClick={() => handleSemesterFunctieClick("Start", s.id)}
            >
              {s.naam}
            </div>
          ))}
      </div>

      <div className="column" id="introductie">
        {alleSemesters
          .filter((s) => s.type === "Introductie")
          .map((s) => (
            <div
              key={`semester-${s.id}`}
              className={`block introductie ${s.class}`}
              onClick={() => handleSemesterFunctieClick("Introductie", s.id)}
            >
              {s.naam}
            </div>
          ))}
      </div>

      <div className="column" id="main">
        {alleSemesters
          .filter((s) => s.type === "Main")
          .map((s) => (
            <div
              key={`semester-${s.id}`}
              className={`block main ${s.class}`}
              onClick={() => handleSemesterFunctieClick("Main", s.id)}
            >
              {s.naam}
            </div>
          ))}
      </div>

      <div className="column" id="afstuderen">
        {alleSemesters
          .filter((s) => s.type === "Afstuderen")
          .map((s) => (
            <div
              key={`semester-${s.id}`}
              className={`block afstuderen ${s.class}`}
              onClick={() => handleSemesterFunctieClick("Afstuderen", s.id)}
            >
              {s.naam}
            </div>
          ))}
      </div>

      <div className="column" id="functies">
        {functies.map((f) => (
          <div key={`functie-${f.id}`} className={`block functie ${f.class}`}>
            {f.naam}
          </div>
        ))}
      </div>
    </div>
  );
}
