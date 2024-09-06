import { addPickInput, removePick, validateInputs } from './helpers.js';

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

    // Validate inputs and add input event listeners to validate inputs
    validateInputs();
    team1Picks.addEventListener('input', validateInputs);
    team2Picks.addEventListener('input', validateInputs);

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
