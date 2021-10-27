// Globals
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

if (bibleVersion) {
    // Get Bible books for default bible on page load
    getBibleBooks();
    // 
    // bibleVersion.addEventListener('change', () => {
    

    // })
}

// TODO: unhide/hide chapter selector until a book is selected
// To create List of chapters, call fetch, then on backend, call bible api again
if (bibleBook) {
    bibleBook.addEventListener('change', () => {
        const csrftoken = getCookie('csrftoken');
        alert(csrftoken)
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

function getBibleBooks() {
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
}