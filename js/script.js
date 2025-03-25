// Functie om data uit JSON te halen en in de tabel te plaatsen
async function loadTableData() {
    const adData = await fetch('json/ad.json').then(res => res.json());
    const semestersData = await fetch('json/semesters.json').then(res => res.json());

    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';

    adData.forEach(functie => {
        const row = document.createElement('tr');

        // Functienaam
        const functieCell = document.createElement('td');
        functieCell.textContent = functie.functie;
        row.appendChild(functieCell);

        // Semester 1 (Startsemester)
        const sem1Cell = document.createElement('td');
        sem1Cell.textContent = 'Startsemester';
        sem1Cell.rowSpan = adData.length;
        if (tbody.children.length === 0) row.appendChild(sem1Cell);

        // Semester 2, 3 en 4
        [2, 3].forEach(semester => {
            const semCell = document.createElement('td');
            const semIds = Array.isArray(functie[`semester_${semester}`]) 
                ? functie[`semester_${semester}`] 
                : [functie[`semester_${semester}`]];
             
            semIds.filter(id => id !== null).forEach(id => {
                const semesterInfo = semestersData.find(sem => sem.id === id);
                if (semesterInfo) {
                    const badge = document.createElement('span');
                    badge.className = `badge ${semesterInfo.kleur || ''}`;
                    badge.textContent = semesterInfo.naam;
                    semCell.appendChild(badge);
                    semCell.appendChild(document.createTextNode('<br />'));
                }
            });

            const sem4Cell = document.createElement('td');
            sem4Cell.textContent = 'Afstuderen';
            sem4Cell.rowSpan = adData.length;
            if (tbody.children.length === 0) row.appendChild(sem4Cell);

            row.appendChild(semCell);
        });

        tbody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', loadTableData);