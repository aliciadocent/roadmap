import { useEffect, useState } from "react";
import "./roadmapBlockAd.css";

export default function RoadmapBlockAdBackwards() {
  const [alleSemesters, setAlleSemesters] = useState([]);
  const [functies, setFuncties] = useState([]);
  const [clickedPath, setClickedPath] = useState({});

  useEffect(() => {
    async function laadData() {
      const semRes = await fetch("json/semesters_v2.json");
      const semJson = await semRes.json();

      const functieRes = await fetch("json/functies.json");
      const functieJson = await functieRes.json();

      const gefilterdeSemesters = semJson
        .filter((s) => s.niveau.includes("AD"))
        .map((s) => ({ ...s, class: "" }));

      const aangepasteFuncties = functieJson.map((f) => ({
        ...f,
        class: "clickable",
      }));

      setAlleSemesters(gefilterdeSemesters);
      setFuncties(aangepasteFuncties);
    }

    laadData();
  }, []);

  async function handleBackClick(type, id) {
    const routesResponse = await fetch("json/routes.json");
    const routesJson = await routesResponse.json();

    console.log(id);

    const clickedFunctie = functies.find((f) => f.id == id);
    console.log(clickedFunctie);

    const routes = routesJson.filter((r) => {
      return r.functie === clickedFunctie.id;
    });

    const nieuweSemesters = alleSemesters.map((s) => {
      s.class = "";
      const isInRoute = routes.some((r) => r.semesters.includes(s.id));
      return isInRoute ? { ...s, class: "clicked" } : s;
    });

    const nieuweFuncties = functies.map((f) => {  
      f.class = "not-clicked-function";
      return f.id === id ? { ...f, class: "clicked-function" } : f;
    }
    );

    setAlleSemesters(nieuweSemesters);
    setFuncties(nieuweFuncties);

    // === Update functies ===

    //setFuncties(nieuweFuncties);
  }

  if (!alleSemesters.length) return <div>Laden...</div>;

  return (
    <div className="container" id="roadmap">
      <div className="title function">Functie</div>
      <div className="title year">Jaar 1</div>
      <div className="title year">Jaar 2</div>

      <div className="column" id="functies">
        {functies.map((f) => (
          <div
            key={`functie-${f.id}`}
            className={`block functie ${f.class}`}
            onClick={() => handleBackClick("Functie", f.id)}
          >
            {f.naam}
          </div>
        ))}
      </div>

      <div className="column" id="start">
        {alleSemesters
          .filter((s) => s.type === "Start")
          .map((s) => (
            <div key={`semester-${s.id}`} className={`block start ${s.class}`}>
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
            >
              {s.naam}
            </div>
          ))}
      </div>

      <div className="column" id="main">
        {alleSemesters
          .filter((s) => s.type === "Main")
          .map((s) => (
            <div key={`semester-${s.id}`} className={`block main ${s.class}`}>
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
              onClick={() => handleBackClick("Afstuderen", s.id)}
            >
              {s.naam}
            </div>
          ))}
      </div>
    </div>
  );
}
