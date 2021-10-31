// Globals
const goalContainer = document.querySelector('.goal-container');
const setGoalBtns = document.querySelectorAll('.set-goal');
const links = document.querySelectorAll('.nav-link');

// Invoke upon page load
addActiveClassToNavLink();

// Check to see if goalContainer is on the DOM
if (goalContainer) {
    goalContainer.addEventListener('click', (e) => {
        // See if delete button was clicked
        if (e.target.classList.contains('delete')) {
            const goalId = e.target.parentNode.querySelector('input').value;
            const itemContainer = e.target.parentNode.parentNode;
            deleteGoal(goalId, itemContainer);
        }
    });
}

function addActiveClassToNavLink() {
    links.forEach((link) => {
        // remove active classes first
        link.classList.remove('active');
        if (
            link.href === location.href ||
            dropdownLinkHref() === location.href
        ) {
            link.classList.add('active');
        }

        function dropdownLinkHref() {
            let href = false;
            if (link.classList.contains('emotion-link-dropdown')) {
                document.querySelectorAll('.emotion-link').forEach((node) => {
                    if (node.href === location.href) {
                        href = node.href;
                    }
                });
            }
            return href;
        }
    });
}

function deleteGoal(id, item) {
    const csrftoken = getCookie('csrftoken');
    fetch('/goals', {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'X-CSRFToken': csrftoken },
        body: JSON.stringify({
            goalId: id,
        }),
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(response.statusText);
            }
        })
        .then((data) => {
            if (data.message === 'success') {
                // TODO: Bootstrap collapse not smooth, use alternative
                // new bootstrap.Collapse(item);
                item.remove();
            }
        })
        // on error would return 'The error is:' + status text
        .catch((error) => console.log('The error is:', error));
}

// Acquire csrftoken re django docs
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === name + '=') {
                cookieValue = decodeURIComponent(
                    cookie.substring(name.length + 1)
                );
                break;
            }
        }
    }
    return cookieValue;
}
