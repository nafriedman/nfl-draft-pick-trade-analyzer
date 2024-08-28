document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const resultDiv = document.getElementById('result');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const team1Picks = document.getElementById('team1_picks').value.split(',').map(pick => pick.trim());
        const team2Picks = document.getElementById('team2_picks').value.split(',').map(pick => pick.trim());

        fetch('/api/analyze-trade', {
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
