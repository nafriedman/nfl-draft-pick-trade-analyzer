export const createPickInput = (teamName) => {
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

export const addPickInput = (event, teamPicks) => {
  event.preventDefault();
  teamPicks.appendChild(createPickInput(teamPicks.id === 'team1Picks' ? 'team1' : 'team2'));
}

export const removePick = (event) => {
  if (event.target.closest('.remove-pick')) {
    const pickInput = event.target.closest('.pick-input');
    const teamPicks = pickInput.parentElement;
    if (teamPicks.children.length > 1) {
      teamPicks.removeChild(pickInput);
    }
  }
  validateInputs();
}

export const validateInputs = () => {
  const inputs = document.querySelectorAll('input[type="number"]');
  const analyzeButton = document.getElementById('analyzeButton');
  const errorMessage = document.getElementById('errorMessage');
  let hasError = false;
  let message = '';

  for (let i = 0; i < inputs.length; i++) {
    if (/e/i.test(inputs[i].value)) {
      hasError = true;
      message = "Scientific notation is not allowed. Please enter a regular number.";
      break;
    }
    else if (inputs[i].value.includes('.')) {
      hasError = true;
      message = "Picks must be whole numbers.";
      break;
    }
  }

  if (hasError) {
    analyzeButton.disabled = true;
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
  } else {
    analyzeButton.disabled = false;
    errorMessage.style.display = 'none';
  }
}
