const createPickInput = (teamName) => {
  const div = document.createElement('div');
  div.className = 'pick-input';
  div.innerHTML = `
            <input type="number" name="${teamName}_picks[]" min="1" max="260" required>
            <button type="button" class="remove-pick" aria-label="Remove pick">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
            </button>
        `;
  return div;
}

const addPickInput = (event, teamPicks) => {
  event.preventDefault();
  teamPicks.appendChild(createPickInput(teamPicks.id === 'team1Picks' ? 'team1' : 'team2'));
}

const removePick = (event) => {
  if (event.target.closest('.remove-pick')) {
    const pickInput = event.target.closest('.pick-input');
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
        const data = {
            team1_picks: formData.getAll('team1_picks[]'),
            team2_picks: formData.getAll('team2_picks[]'),
            value_chart: formData.get('value_chart')
        };

        fetch('/analyze-trade', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            const resultElement = document.getElementById('result');
            if (resultElement) {
                const maxScale = 5000;
                const team1Bar = document.getElementById('team1-bar');
                const team2Bar = document.getElementById('team2-bar');

                team1Bar.style.width = `${(data.team1_value / maxScale) * 100}%`;
                team2Bar.style.width = `${(data.team2_value / maxScale) * 100}%`;

                document.getElementById('team1-value').textContent = data.team1_value;
                document.getElementById('team2-value').textContent = data.team2_value;

                const winnerElement = document.getElementById('winner');
                const differenceElement = document.getElementById('difference');

                winnerElement.textContent = `Winner: ${data.winner}`;

                const absoluteDifference = Math.abs(data.difference);
                differenceElement.textContent = `Won by ${absoluteDifference} points`;

                if (absoluteDifference > 500) {
                    differenceElement.style.color = '#e74c3c'; // Red color for difference > 500
                } else {
                    differenceElement.style.color = '#f39c12'; // Yellow color for difference <= 500
                }

                resultElement.style.display = 'block';
            } else {
                console.error('Result element not found');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
