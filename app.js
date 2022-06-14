let selectCategories = document.querySelector("#select-category");
let selectAuthors = document.querySelector("#select-author");

let books;

startApp();

async function startApp() {
    books = await getBooks();
    let authors = getAuthors(books);
    injectSelect(authors, selectAuthors);
    let categories = getCategories(books);
    injectSelect(categories, selectCategories);
    displayBooks(books);
}

selectAuthors.addEventListener("change", (e) => {
    filterBooks("author", e.target.value);
});

selectCategories.addEventListener("change", (e) => {
    filterBooks("category", e.target.value);
});

function filterBooks(type, selected) {
    let books = document.querySelector(".books-list").children;
    for (const book of books) {
        book.style.display = "none";
        let values;
        if (type == "author") {
            selectCategories.selectedIndex = 0;
            values = book.dataset.authors.split(",");
        } else if (type == "category") {
            selectAuthors.selectedIndex = 0;
            values = book.dataset.categories.split(",");
        }
        for (const value of values) {
            if (value == selected) {
                book.style.display = "block";
            }
        }
    }
}

function getAuthors(books) {
    let authors = [];
    for (const book of books) {
        for (const author of book.authors) {
            if (author != "") {
                authors.push(author);
            }
        }
    }
    authors = [...new Set(authors)];
    authors.sort();
    return authors;
}
function getCategories(books) {
    let categories = [];
    for (const book of books) {
        for (const category of book.categories) {
            if (category != "") {
                categories.push(category);
            }
        }
    }
    categories = [...new Set(categories)];
    categories.sort();
    return categories;
}

function injectSelect(values, select) {
    for (const value of values) {
        let option = document.createElement("option");
        option.textContent = value;
        option.value = value;
        select.appendChild(option);
    }
}

async function getBooks() {
    let returnData;
    await fetch(`./books.json`)
        // Ensuite on récupére la réponse et on la transforme en JS
        .then(function (response) {
            return response.json();
        })
        // On récupère les data
        .then(function (data) {
            returnData = data;
        });
    // On retourne le tableau des books
    return returnData;
}

function displayBooks(books) {
    let booksList = document.querySelector(".books-list");
    let template = document.querySelector("#template-book");
    for (const book of books) {
        let clone = document.importNode(template.content, true);
        // Ajout des auteurs en data
        let card = clone.querySelector(".card");
        card.setAttribute("data-authors", book.authors.join(","));
        // Ajout des categories en data
        card.setAttribute("data-categories", book.categories.join(","));
        // Image
        let img = clone.querySelector("img");
        book.thumbnailUrl
            ? (img.src = book.thumbnailUrl)
            : (img.src =
                  "https://p1.storage.canalblog.com/14/48/1145642/91330992_o.png");

        // Titre
        let titre = (clone.querySelector(".titre").textContent = book.title);
        // Numéro
        let isbn = clone.querySelector(".isbn");
        isbn.textContent = "ISBN : " + book.isbn;
        // Date
        let date = clone.querySelector(".date");
        if (book.publishedDate) {
            let date_format = new Date(
                book.publishedDate.dt_txt
            ).toLocaleString();
            date.textContent = "Date de publication : " + date_format;
        } else {
            date.style.display = "none";
        }
        // Nombre pages
        let page = clone.querySelector(".nbr-page");
        book.pageCount > 0
            ? (page.textContent = "Nombre de pages : " + book.pageCount)
            : (page.style.display = "none");
        // Description
        let description = clone.querySelector(".description");
        book.shortDescription
            ? (description.textContent = book.shortDescription)
            : (description.style.display = "none");
        //
        booksList.appendChild(clone);
    }
}
