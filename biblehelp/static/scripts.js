const csrftoken = getCookie('csrftoken');
const goalContainer = document.querySelector('.goal-container');
const setGoalBtns = document.querySelectorAll('.set-goal');

// Check to see if setGoalBtns is on the DOM
if (setGoalBtns) {
    setGoalBtns.forEach(btn => btn.addEventListener('click', (e) => {
        console.log(e.target);
    }));
}

// Check to see if goalContainer is on the DOM
if (goalContainer) {
    goalContainer.addEventListener('click', (e) => {
        // See if delete button was clicked
        if (e.target.classList.contains('delete')) {
            const goalId = e.target.parentNode.querySelector('input').value;
            const itemContainer = e.target.parentNode.parentNode;

            // Send fetch request to delete goal
            fetch('/goals', {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'X-CSRFToken': csrftoken },
                body: JSON.stringify({
                    goalId: goalId
                })
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        return Promise.reject(response.statusText);
                    }
                })
                .then(data => {
                    if (data.message === 'success') {
                        itemContainer.remove();
                    }
                })
                // on error would return 'The error is:' + status text
                .catch(error => console.log('The error is:', error));
        };
    })
}




// Acquire csrftoken re django docs
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}