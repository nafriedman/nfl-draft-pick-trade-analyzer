document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const resultDiv = document.getElementById('result');

    const validateInput = (input) => {
        // result is a list of picks
        const picks = input.split(',').map(pick => pick.trim());
        // check if every pick is a number between 1 and 260
        return picks.every(pick => {
            const num = parseInt(pick, 10);
            return !isNaN(num) && num >= 1 && num <= 260;
        });
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const team1PicksInput = document.getElementById('team1_picks').value;
        const team2PicksInput = document.getElementById('team2_picks').value;

        if (!validateInput(team1PicksInput) || !validateInput(team2PicksInput)) {
            resultDiv.innerHTML = '<p class="error">Invalid input. Please enter comma-separated numbers between 1 and 260.</p>';
            resultDiv.style.display = 'block';
            return;
        }

        const team1Picks = team1PicksInput.split(',').map(pick => parseInt(pick.trim(), 10));
        const team2Picks = team2PicksInput.split(',').map(pick => parseInt(pick.trim(), 10));

        fetch('/analyze-trade', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                team1_picks: team1Picks,
                team2_picks: team2Picks
            }),
        })
        .then(response => response.json())
        .then(data => {
            resultDiv.innerHTML = `
                <h2>Trade Analysis Results</h2>
                <p><strong>Team 1 Value:</strong> ${data.team1_value}</p>
                <p><strong>Team 2 Value:</strong> ${data.team2_value}</p>
                <p><strong>Difference:</strong> ${data.difference}</p>
                <p><strong>Winner:</strong> ${data.winner}</p>
            `;
            resultDiv.style.display = 'block';
        })
        .catch((error) => {
            console.error('Error:', error);
            resultDiv.innerHTML = '<p>An error occurred while analyzing the trade. Please try again.</p>';
            resultDiv.style.display = 'block';
        });
    });
});
