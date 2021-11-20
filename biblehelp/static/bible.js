// Globals
const bibleVersion = document.getElementById('translation');
const bibleBook = document.getElementById('bible-books');
const bibleChapters = document.getElementById('bible-chapters');
const verseContainer = document.querySelector('.verse-container');
const bookTitleContainer = document.querySelector('.book-title-container');
const bookTitle = bookTitleContainer.querySelector('h1');
const selections = document.querySelectorAll('.selection');
const previousChapter = document.querySelector('#previous');
const nextChapter = document.querySelector('#next');
const contentWrapper = document.querySelector('.chapter-contents-wrapper');
const loadingIcon = document.querySelector('.loading');

// TODO: Add loading symbol on api calls

// Run code when on bible.html by checking for bibleVersion element
if (bibleVersion) {
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
    bibleBook.addEventListener('change', getBookChapters);

    // Get chapter verses when chapter changes
    bibleChapters.addEventListener('change', getChapterVerses);

    // Add version abbreviation when select is closed
    makeAbbreviations();

    // Navigate to previous/next chapter
    bookTitleContainer.addEventListener('click', toggleChapter);
}

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
                    '<option value="" disabled selected>Book</option>';
                books.forEach((book) => {
                    if (book.id === bookId) {
                        bibleBook.innerHTML += `<option class="book-name" value="${book.id}" data-name="${book.name}" data-abbrv="${book.id}" selected>${book.id}</option>`;
                    } else {
                        bibleBook.innerHTML += `<option class="book-name" value="${book.id}" data-name="${book.name}" data-abbrv="${book.id}">${book.name}</option>`;
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

                // Filter out intro
                const chapters = data.data.filter(
                    (chapter) => chapter.number !== 'intro'
                );
                bibleChapters.innerHTML =
                    '<option class="default-selected" value="" disabled selected>Chapter</option>';
                chapters.forEach((chapter) => {
                    if (chapter.id === chapterId) {
                        bibleChapters.innerHTML += `<option id="${chapter.id}" value="${chapter.id}" selected>${chapter.number}</option>`;
                    } else {
                        bibleChapters.innerHTML += `<option id="${chapter.id}" value="${chapter.id}">${chapter.number}</option>`;
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
                    if (bookTitleContainer.classList.contains('show')) {
                        new bootstrap.Collapse(bookTitleContainer);
                    }
                    getBibleBooks();
                } else {
                    // Retrieve title and verses
                    const title = data.data.reference;
                    const chapterVerses = data.data.content;
                    bookTitle.innerHTML = title;
                    if (!bookTitleContainer.classList.contains('show')) {
                        new bootstrap.Collapse(bookTitleContainer);
                    }
                    verseContainer.innerHTML = chapterVerses;
                    // Make verses visible, hide inputs
                    verseContainer.classList.remove('d-none');
                    getBibleBooks();

                    // Display previous/next chapter
                    const chapters = bibleChapters.childNodes;
                    let low = 160;
                    let high = 0;
                    let selected = 0;
                    chapters.forEach((chapter) => {
                        const value = parseInt(chapter.value.slice(4));
                        if (chapter.value === bibleChapters.value) {
                            selected = value;
                        } else if (value < low) {
                            low = value;
                        } else if (value > high) {
                            high = value;
                        }
                    });
                    if (selected > low) {
                        previousChapter.classList.remove('hidden');
                    } else {
                        previousChapter.classList.add('hidden');
                    }
                    if (selected < high) {
                        nextChapter.classList.remove('hidden');
                    } else {
                        nextChapter.classList.add('hidden');
                    }
                }
                contentWrapper.classList.remove('d-none');
                loadingIcon.classList.add('d-none');
            })
            // on error would return 'The error is:' + status text
            .catch((error) => console.log('The error is:', error));
        contentWrapper.classList.add('d-none');
        loadingIcon.classList.remove('d-none');
    }
}

function makeAbbreviations() {
    selections.forEach((selection) => {
        selection.addEventListener('click', (e) => {
            setAbbrv(selection, e);
        });

        selection.addEventListener('keydown', (e) => {
            if (e.keyCode === 13) {
                setAbbrv(selection, e);
            }
        });

        selection.addEventListener('blur', (e) => {
            setAbbrv(selection, e);
        });
    });

    function setAbbrv(selection, e) {
        const versionOptions = document.querySelectorAll('.version-name');
        const bookOptions = document.querySelectorAll('.book-name');
        let options = '';

        if (selection.id === 'translation') {
            options = versionOptions;
        } else if (selection.id === 'bible-books') {
            options = bookOptions;
        }
        if (options !== '') {
            for (option of options) {
                if (e.target.value === option.value) {
                    if (option.textContent !== option.dataset.abbrv) {
                        option.textContent = option.dataset.abbrv;
                    } else if (e.type === 'blur') {
                        break;
                    } else {
                        option.textContent = option.dataset.name;
                    }
                }
            }
        }
    }
}

function toggleChapter(e) {
    if (e.target.parentElement.classList.contains('chapter-nav')) {
        let element;
        if (e.target.parentElement.id === 'next') {
            element = document.getElementById(
                bibleChapters.value
            ).nextElementSibling;
        } else {
            element = document.getElementById(
                bibleChapters.value
            ).previousElementSibling;
        }
        bibleChapters.value = element.value;
        let event = new Event('change');
        bibleChapters.dispatchEvent(event);
    }
}
