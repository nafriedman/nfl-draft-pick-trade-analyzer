const createPickInput = (teamName) => {
  const div = document.createElement('div');
  div.className = 'pick-input';
  div.innerHTML = `
            <input type="number" name="${teamName}_picks[]" min="1" max="260" required>
            <button type="button" class="remove-pick">Remove</button>
        `;
  return div;
}

const addPickInput = (event, teamPicks) => {
  event.preventDefault();
  teamPicks.appendChild(createPickInput(teamPicks.id === 'team1Picks' ? 'team1' : 'team2'));
}

const removePick = (event) => {
  if (event.target.classList.contains('remove-pick')) {
    const pickInput = event.target.parentElement;
    const teamPicks = pickInput.parentElement;
    if (teamPicks.children.length > 1) {
      teamPicks.removeChild(pickInput);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('tradeForm');
    const team1Picks = document.getElementById('team1Picks');
    const team2Picks = document.getElementById('team2Picks');
    const addTeam1Pick = document.getElementById('addTeam1Pick');
    const addTeam2Pick = document.getElementById('addTeam2Pick');

    addTeam1Pick.addEventListener('click', (e) => addPickInput(e, team1Picks));
    addTeam2Pick.addEventListener('click', (e) => addPickInput(e, team2Picks));
    team1Picks.addEventListener('click', removePick);
    team2Picks.addEventListener('click', removePick);

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(form);
        // console.log(formData);

        // Convert FormData to a plain Object
        const data = {};
        formData.forEach((value, key) => {
            if (!data[key]) {
                data[key] = formData.getAll(key)
            }
        });

        // console.log(data);

        fetch('/analyze-trade', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('result').innerHTML = data.result;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
