//menambahkan  sebuah variabel berisi array yang akan menampung beberapa object. Object ini berisikan data-data Todo user. 
const books = [];

//menambahkan sebuah variabel yang bertujuan mendefinisikan custom event  dengan nama render-todo
const RENDER_EVENT = 'render-book';

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';




//Kode di bawah adalah sebuah listener yang akan menjalankan kode yang ada didalamnya ketika event DOMContentLoaded dibangkitkan alias ketika semua elemen HTML sudah dimuat menjadi DOM dengan baik.
document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });
    if (isStorageExist()) {
      loadDataFromStorage();
    }
});

//membuat fungsi untuk membuat todo
function addBook() {
    //kode di bawah berfungsi untuk mengambil elemen pada html
    const textBook = document.getElementById('title').value;
    //dalam kasus ini kita menangkap element input dengan id title dan memanggil properti value untuk mendapatkan nilai yang diinputkan oleh user
    const authorBook = document.getElementById('author').value;
    const timestamp = document.getElementById('year').value;
    const hiddenMessage = 'Penulis ' + authorBook + 'Tahun ' + timestamp;
    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, textBook, authorBook, timestamp, false);
    books.push(bookObject);
   
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function addTaskToCompleted (bookId) {
  const bookTarget = findBook(bookId);
 
  if (bookTarget == null) return;
 
  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
for (const bookItem of books) {
  if (bookItem.id === bookId) {
    return bookItem;
  }
}
return null;
}

function removeTaskFromCompleted(bookId) {
  const bookTarget = findTodoIndex(bookId);
 
  if (bookTarget === -1) return;
 
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
 
 
function undoTaskFromCompleted(bookId) {
  const bookTarget = findTodo(bookId);
 
  if (bookTarget == null) return;
 
  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findTodoIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
 
  return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
      id,
      title,
      author,
      year,
      isCompleted
    }
}

function makeBook(bookObject) {
    const textTitle = document.createElement('h2');
    textTitle.innerText = bookObject.title;
    
    const textAuthor = document.createElement('p');
    textAuthor.innerText = bookObject.author;

    const textYear = document.createElement('p');
    textYear.innerText = bookObject.year;
   
    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, 'Penulis', textAuthor, 'Tahun', textYear);
    

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `book-${bookObject.id}`);
   
    if (bookObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');
     
        undoButton.addEventListener('click', function () {
          undoTaskFromCompleted(bookObject.id);
        });
     
        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');
     
        trashButton.addEventListener('click', function () {
          removeTaskFromCompleted(bookObject.id);
        });
     
        container.append(undoButton, trashButton);
      } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');
        
        checkButton.addEventListener('click', function () {
          addTaskToCompleted(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');
     
        trashButton.addEventListener('click', function () {
          removeTaskFromCompleted(bookObject.id);
        });
        
        container.append(checkButton, trashButton);
      }

    return container;
  }

  function searchBook(){
    const search = document.querySelector("searchBookTitle");
    search.addEventListener('keyup', searchList());
  }


  function searchList(a){
    const cariList = a.target.value.toLowerCase();
    let itemList = document.querySelectorAll(".container");

    itemList.forEach((item) =>{
      const isiItem = item.firstChild.textContent.toLowerCase();

      if(isiItem.indexOf(cariList) != -1){
        item.setAttribute("style", "display: block;" ); 
      }else{
        item.setAttribute("style", "display: none !important;");
      }
    })
   }

  function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
  
    if (data !== null) {
      for (const book of data) {
        books.push(book);
      }
    }
  
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBookList = document.getElementById('books');
    uncompletedBookList.innerHTML = '';
   
    const completedBookList = document.getElementById('completed-books');
    completedBookList.innerHTML = '';
   
    for (const bookItem of books) {
      const bookElement = makeBook(bookItem);
      if (!bookItem.isCompleted)
        uncompletedBookList.append(bookElement);
      else
        completedBookList.append(bookElement);
    }
  });

  document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
  });
