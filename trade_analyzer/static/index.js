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
        const data = {};
        formData.forEach((value, key) => {
            if (!data[key]) {
                data[key] = formData.getAll(key)
            }
        });

        fetch('/analyze-trade', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            console.log('Response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Received data:', data);
            const resultElement = document.getElementById('result');
            resultElement.innerHTML = '';
            if (resultElement) {
                resultElement.style.display = 'block';
                resultElement.insertAdjacentHTML('beforeend', `<p>Team 1 value: ${data.team1_value}</p>`);
                resultElement.insertAdjacentHTML('beforeend', `<p>Team 2 value: ${data.team2_value}</p>`);
                resultElement.insertAdjacentHTML('beforeend', `<p>Difference: ${data.difference}</p>`);
                resultElement.insertAdjacentHTML('beforeend', `<p>Winner: ${data.winner}</p>`);

            } else {
                console.error('Result element not found');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
