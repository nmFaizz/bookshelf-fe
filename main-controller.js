const bookSubmitBtn = document.getElementById("bookSubmit")
const inCompletedBook = document.getElementById("incompleteBookshelfList")
const completedBook = document.getElementById("completeBookshelfList")
const searchButton = document.getElementById("searchSubmit")
const resetButton = document.getElementById("resetSearch")

const RAK_BUKU1 = "rak-buku-1"
const RAK_BUKU2 = "rak-buku-2"

window.addEventListener("load", () => {
    if (typeof(Storage) !== "undefined") {
        
        if (localStorage.getItem(RAK_BUKU1) == null) {
            localStorage.setItem(RAK_BUKU1, '[]');
        }
        
        if (localStorage.getItem(RAK_BUKU2) == null) {
            localStorage.setItem(RAK_BUKU2, '[]');
        }

        renderBookData()

    } else {
        alert("your browser doesn't support web storage")
    }

    searchButton.addEventListener("click", (e) => {
        e.preventDefault()
        const searchInput = document.getElementById("searchBookTitle").value

        const bookItemH3 = document.querySelectorAll(".book_item h3")
        const bookItem = document.querySelectorAll(".book_item")

        for (let i = 0; i < bookItemH3.length; i++) {
            if (bookItemH3[i].innerText !== searchInput) {
                bookItem[i].setAttribute("hidden", "true")
            }
        }
    })

    resetButton.addEventListener("click", () => {
        resetRender()
    })


})

const renderBookData = () => {
    if (localStorage.getItem(RAK_BUKU1) !== '') {
        let books1 = JSON.parse(localStorage.getItem(RAK_BUKU1))

        for (const book1 of books1) {
            createBookElement(book1)
        }
    }

    if (localStorage.getItem(RAK_BUKU2) !== '') {
        let books2 = JSON.parse(localStorage.getItem(RAK_BUKU2))

        for (const book2 of books2) {
            createBookElement(book2)
        }
    }
}

const addBookData = (data) => {
    const rakBuku = data.isComplete ? RAK_BUKU2 : RAK_BUKU1

    let booksData = []

    if (localStorage.getItem(rakBuku) !== '') {
        booksData = JSON.parse(localStorage.getItem(rakBuku))
    } 

    booksData.push(data)

    localStorage.setItem(rakBuku, JSON.stringify(booksData))

    createBookElement(data)
}

const createBookElement = (obj) => {

    const {id, title, author, year, isComplete} = obj

    const article = document.createElement("article")
    article.className = "book_item"
    const bTitle = document.createElement("h3")
    bTitle.innerText = title
    const bAuthor = document.createElement("p")
    bAuthor.innerText = "Penulis : " + author
    const bYear = document.createElement("p")
    bYear.innerText = "Tahun : " + year

    const actionContainer = document.createElement("div")
    actionContainer.className = "action"
    const completedButton = document.createElement("button")
    completedButton.className = "green"
    completedButton.innerText = isComplete ? "Belum selesai di Baca" : "Selesai dibaca"
    const deleteButton = document.createElement("button")
    deleteButton.className = "red"
    deleteButton.innerText = "Hapus buku"
    
    actionContainer.append(completedButton, deleteButton)
    article.append(bTitle, bAuthor, bYear, actionContainer)

    const key = isComplete ? RAK_BUKU2 : RAK_BUKU1

    deleteButton.addEventListener("click", (e) => {
        removeBookElement(key, id)
    })

    completedButton.addEventListener("click", () => {
        moveBook(key, isComplete, id)
    }) 

    if (isComplete) {
        completedBook.appendChild(article)
    } else {
        inCompletedBook.appendChild(article)
    }

}

const moveBook = (key, isComplete, id) => {
    if (isComplete) {
        let temp = JSON.parse(localStorage.getItem(key))
        let rak1 = JSON.parse(localStorage.getItem(RAK_BUKU1)) || []
        
        temp = temp.filter(data => data.id === id)
        temp[0].isComplete = false
        rak1.push(temp[0])
        
        localStorage.setItem(RAK_BUKU1, JSON.stringify(rak1))
        localStorage.setItem(key, filterBooksData(key, id))

        resetRender()
    } else {
        let temp = JSON.parse(localStorage.getItem(key))
        let rak2 = JSON.parse(localStorage.getItem(RAK_BUKU2)) || []

        temp = temp.filter(data => data.id === id)
        temp[0].isComplete = true
        rak2.push(temp[0])
        
        localStorage.setItem(RAK_BUKU2, JSON.stringify(rak2))
        localStorage.setItem(key, filterBooksData(key, id))

        resetRender()
    }

}

const filterBooksData = (key, id) => {
    let keyDatas = JSON.parse(localStorage.getItem(key))
    keyDatas = keyDatas.filter(keyData => keyData.id !== id) || []

    return JSON.stringify(keyDatas)
}

const resetRender = () => {
    const bookItem = document.getElementsByClassName("book_item")

    for (let i = bookItem.length - 1; i >= 0; i--) {
        bookItem[i].remove();
    }

    renderBookData()
} 

const removeBookElement = (key, id) => {
    localStorage.setItem(key, filterBooksData(key, id))
    resetRender()
}


bookSubmitBtn.addEventListener("click", (e) => {
    const title = document.getElementById("inputBookTitle").value
    const author = document.getElementById("inputBookAuthor").value
    const year = parseInt(document.getElementById("inputBookYear").value)
    const isComplete = document.getElementById("inputBookIsComplete").checked

    console.log(year)

    if (title !== '' && author !== '' && !isNaN(year)) {
        const bookData = {
            id: +new Date(),
            title: title,
            author: author,
            year: year,
            isComplete: isComplete,
        }
    
        addBookData(bookData)
    } 
})



