
const goalContainer = document.querySelector('.goal-container');
const setGoalBtns = document.querySelectorAll('.set-goal');
const bibleVersion = document.getElementById('translation');
const bibleBook = document.getElementById('bible-books');
const bibleChapters = document.getElementById('bible-chapters');
const verseContainer = document.querySelector('.verse-container');
const bookTitle = document.querySelector('.book-title');
const formContainer = document.querySelector('.form-container');
const showBtn = document.getElementById('show');

// TODO: Make asv default selected
showBtn.addEventListener('click', () => {
    return new bootstrap.Collapse(formContainer);
})


// TODO: When translation is changed, if book and chapter already selected, preserve data

// TODO: When select book is clicked, hide other form elements, and with brief transition,
// Populate the page with the list of Bible Books. Once book selected, reverse the process

// To create List of books, call fetch, then on backend, call bible api again
if (bibleVersion) {
    bibleVersion.addEventListener('change', () => {
        const csrftoken = getCookie('csrftoken');
        const bibleId = bibleVersion.value;
        if (bibleId !== '') {
            fetch('/bible', {
                method: 'POST',
                credentials: 'include',
                headers: { 'X-CSRFToken': csrftoken },
                body: JSON.stringify({
                    bibleId: bibleId
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
                    const books = data.data;
                    bibleBook.innerHTML = '<option value="" disabled selected>Select a Book</option>';
                    books.forEach(book => {
                        bibleBook.innerHTML += `<option value="${book.id}">${book.name}</option>`;
                    });   
                })
                // on error would return 'The error is:' + status text
                .catch(error => console.log('The error is:', error));
        }

    })
}

// TODO: unhide/hide chapter selector until a book is selected
// To create List of chapters, call fetch, then on backend, call bible api again
if (bibleBook) {
    bibleBook.addEventListener('change', () => {
        const csrftoken = getCookie('csrftoken');
        const bibleId = bibleVersion.value;
        const bookId = bibleBook.value;
        if (bookId !== '' && bibleId !== '') {
            fetch('/bible', {
                method: 'POST',
                credentials: 'include',
                headers: { 'X-CSRFToken': csrftoken },
                body: JSON.stringify({
                    bibleId: bibleId,
                    bookId: bookId
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
                    const chapters = data.data;
                    bibleChapters.innerHTML = '<option value="" disabled selected>Select a Chapter</option>';
                    chapters.forEach(chapter => {
                        bibleChapters.innerHTML += `<option value="${chapter.id}">${chapter.number}</option>`;
                    });   
                })
                // on error would return 'The error is:' + status text
                .catch(error => console.log('The error is:', error));
        }
    });
}

// Add verses, call fetch, then on backend, call bible api again
if (bibleChapters) {
    bibleChapters.addEventListener('change', () => {
        const csrftoken = getCookie('csrftoken');
        const bibleId = bibleVersion.value;
        const chapterId = bibleChapters.value;
        if (chapterId !== '' && bibleId !== '') {
            fetch('/bible', {
                method: 'POST',
                credentials: 'include',
                headers: { 'X-CSRFToken': csrftoken },
                body: JSON.stringify({
                    bibleId: bibleId,
                    chapterId: chapterId
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
                    // Retrieve title and verses
                    const title = data.data.reference;
                    const chapterVerses = data.data.content;
                    
                    bookTitle.innerHTML = title;
                    verseContainer.innerHTML = chapterVerses; 

                    // Make verses visible  testing here...............
                    verseContainer.classList.remove('d-none')
                    new bootstrap.Collapse(formContainer);

                })
                // on error would return 'The error is:' + status text
                .catch(error => console.log('The error is:', error));
        }
    });
}



// Autocomplete Bible Books
// Check to see if bible-book input is on the DOM
// if (bibleBook) {
//     bibleBook.addEventListener('input', (e) => {
//         const value = e.target.value;
//         const length = e.target.value.length;
//         let bookArray = '';

//         // Get array of matching books
//         if (value !== '') {
//             bookArray = books.filter(book => book.slice(0, length) === value);
//         }

//         // Create list of elements
//         if (bookArray.length !== 0) {
//             console.log(bookArray);
//         }

//     });
// }

// Set Goal Buttons
// Check to see if setGoalBtns is on the DOM
if (setGoalBtns) {
    setGoalBtns.forEach(btn => btn.addEventListener('click', (e) => {
        console.log(e.target);
    }));
}

// Delete Goals
// Check to see if goalContainer is on the DOM
if (goalContainer) {
    goalContainer.addEventListener('click', (e) => {
        const csrftoken = getCookie('csrftoken');
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


///////////// TESTING BELOW THIS POINT //////////////////////
function fetchRequest() {
    fetch('https://api.scripture.api.bible/v1/bibles', {
        headers: {
            'api-key': '',
        }
    })
        .then(response => console.log(`status code:${response.status}`))

}

function xhrRequest() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = false;

        xhr.addEventListener(`readystatechange`, function () {
            if (this.readyState === this.DONE) {
                const { data } = JSON.parse(this.responseText);
                const versions = data.map((data) => {
                    return {
                        name: data.name,
                        id: data.id,
                        abbreviation: data.abbreviation,
                        description: data.description,
                        language: data.language.name,
                    };
                });

                resolve(versions);
            }
        });

        xhr.open(`GET`, `https://api.scripture.api.bible/v1/bibles`);
        xhr.setRequestHeader(`api-key`, '');

        xhr.onerror = () => reject(xhr.statusText);

        xhr.send();
    });
}