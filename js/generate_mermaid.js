async function generateMermaidDiagrams() {
  const ad = await fetch("ad.json").then((res) => res.json());
  const semesters = await fetch("semesters.json").then((res) => res.json());

  const container = document.createElement("section");
  container.className = "container my-5";

  ad.forEach((functie) => {
    const diagramDiv = document.createElement("div");
    diagramDiv.className = "mermaid my-4";

    const naam = functie.functie;
    const sem2 = Array.isArray(functie.semester_2)
      ? functie.semester_2
      : [functie.semester_2];
    const sem3 = semesters.find((s) => s.id === functie.semester_3);
    const sem4 = semesters.find((s) => s.id === functie.semester_4);

    let diagram = `graph TD\n    Start["Startsemester"]\n`;

    // Semester 2 opties
    sem2.forEach((id, i) => {
      const s = semesters.find((s) => s.id === id);
      if (!s) return;
      const label = s.naam.replace(/&amp;/g, "&");
      const idName = `S2_${i}_${label.replace(/[^a-zA-Z0-9]/g, "")}`;
      diagram += `    Start --> ${idName}["${label}"]\n`;
      if (sem3) {
        const s3Name = `S3_${sem3.naam.replace(/[^a-zA-Z0-9]/g, "")}`;
        diagram += `    ${idName} --> ${s3Name}["${sem3.naam.replace(
          /&amp;/g,
          "&"
        )}"]\n`;
      }
    });

    if (sem3 && sem2.length === 0) {
      const s3Name = `S3_${sem3.naam.replace(/[^a-zA-Z0-9]/g, "")}`;
      diagram += `    Start --> ${s3Name}["${sem3.naam.replace(
        /&amp;/g,
        "&"
      )}"]\n`;
    }

    if (sem3 && sem4) {
      const s3Name = `S3_${sem3.naam.replace(/[^a-zA-Z0-9]/g, "")}`;
      diagram += `    ${s3Name} --> Grad["${sem4.naam}"]\n`;
    }

    diagramDiv.textContent = diagram;

    const title = document.createElement("h5");
    title.textContent = naam;
    container.appendChild(title);
    container.appendChild(diagramDiv);
  });

  document.body.appendChild(container);
}

document.addEventListener("DOMContentLoaded", generateMermaidDiagrams);
