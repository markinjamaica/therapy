// Globals
const bibleVersion = document.getElementById('translation');
const bibleBook = document.getElementById('bible-books');
const bibleChapters = document.getElementById('bible-chapters');
const verseContainer = document.querySelector('.verse-container');
const bookTitle = document.querySelector('.book-title');
const formContainer = document.querySelector('.form-container');
const showBtn = document.getElementById('show');

// Run code when on bible.html by checking for bibleVersion element
if (bibleVersion) {
    showBtn.addEventListener('click', () => {
        new bootstrap.Collapse(formContainer);
    });
    // Get Bible books for default bible on page load
    getBibleBooks();

    // Get Bible books when bible version changes
    bibleVersion.addEventListener('change', () => {
        const chapterId = bibleChapters.value;
        const bookId = bibleBook.value;
        // Check if a book and chapter are already selected
        if (bookId !== '' && chapterId !== '') {
            getChapterVerses();
        } else {
            getBibleBooks();
        }
    });

    // Get book chapters when book changes
    bibleBook.addEventListener('change', () => {
        getBookChapters();
    });

    // Get chapter verses when chapter changes
    bibleChapters.addEventListener('change', () => {
        getChapterVerses();
    });
}

// TODO: unhide/hide chapter selector until a book is selected

function getBibleBooks() {
    const csrftoken = getCookie('csrftoken');
    const bibleId = bibleVersion.value;
    const bookId = bibleBook.value;

    if (bibleId !== '') {
        fetch('/bible', {
            method: 'POST',
            credentials: 'include',
            headers: { 'X-CSRFToken': csrftoken },
            body: JSON.stringify({
                bibleId: bibleId,
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
                const books = data.data;
                bibleBook.innerHTML =
                    '<option value="" disabled selected>Select a Book</option>';
                books.forEach((book) => {
                    if (book.id === bookId) {
                        bibleBook.innerHTML += `<option value="${book.id}" selected>${book.name}</option>`;
                    } else {
                        bibleBook.innerHTML += `<option value="${book.id}">${book.name}</option>`;
                    }
                });
            })
            // on error would return 'The error is:' + status text
            .catch((error) => console.log('The error is:', error));
    }
}

function getBookChapters() {
    const csrftoken = getCookie('csrftoken');
    const bibleId = bibleVersion.value;
    const bookId = bibleBook.value;
    const chapterId = bibleChapters.value;
    if (bookId !== '' && bibleId !== '') {
        fetch('/bible', {
            method: 'POST',
            credentials: 'include',
            headers: { 'X-CSRFToken': csrftoken },
            body: JSON.stringify({
                bibleId: bibleId,
                bookId: bookId,
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
                if (data.data === 'keyError') {
                    alert('key error!');
                }
                const chapters = data.data;
                bibleChapters.innerHTML =
                    '<option value="" disabled selected>Select a Chapter</option>';
                chapters.forEach((chapter) => {
                    if (chapter.id === chapterId) {
                        bibleChapters.innerHTML += `<option value="${chapter.id}" selected>${chapter.number}</option>`;
                    } else {
                        bibleChapters.innerHTML += `<option value="${chapter.id}">${chapter.number}</option>`;
                    }
                });
            })
            // on error would return 'The error is:' + status text
            .catch((error) => console.log('The error is:', error));
    }
}

function getChapterVerses() {
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
                chapterId: chapterId,
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
                if (data.data === 'keyError') {
                    // Selected bible has no chapter & verses, reset and getBibleBooks
                    verseContainer.classList.add('d-none');
                    bibleBook.value = '';
                    bibleChapters.value = '';
                    if (bookTitle.classList.contains('show')) {
                        new bootstrap.Collapse(bookTitle);
                    }
                    getBibleBooks();
                } else {
                    // Retrieve title and verses
                    const title = data.data.reference;
                    const chapterVerses = data.data.content;
                    bookTitle.innerHTML = title;
                    if (!bookTitle.classList.contains('show')) {
                        new bootstrap.Collapse(bookTitle);
                    }
                    verseContainer.innerHTML = chapterVerses;
                    // Make verses visible, hide inputs
                    verseContainer.classList.remove('d-none');
                    new bootstrap.Collapse(formContainer);
                    getBibleBooks();
                }
            })
            // on error would return 'The error is:' + status text
            .catch((error) => console.log('The error is:', error));
    }
}