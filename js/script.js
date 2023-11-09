//  // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAYZffPv5UivBak7Oy8aUwZFvmz1iKpL2c",
//   authDomain: "bookself-h.firebaseapp.com",
//   projectId: "bookself-h",
//   storageBucket: "bookself-h.appspot.com",
//   messagingSenderId: "494885205027",
//   appId: "1:494885205027:web:2591a58f328327b7cfed96",
//   measurementId: "G-ZCSQYYWEW6"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const db = getFirestore(app);

// async function getCities(db) {
//   const citiesCol = collection(db, 'cities');
//   const citySnapshot = await getDocs(citiesCol);
//   const cityList = citySnapshot.docs.map(doc => doc.data());
//   return cityList;
// }
 
const books = [];
const RENDER_EVENT = 'render-book';

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

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

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    document.getElementById("header").style.padding = "30px 10px";
    document.getElementById("head").style.fontSize = "25px";
  } else {
    document.getElementById("header").style.padding = "80px 10px";
    document.getElementById("head").style.fontSize = "35px";
  }
}

function addBook() {
    const textBook = document.getElementById('title').value;
    const pageBook = document.getElementById('page').value;
    const authorBook = document.getElementById('author').value;
    const timestamp = document.getElementById('year').value;
    const hiddenMessage = 'Halaman '+ pageBook +'Penulis ' + authorBook + 'Tahun ' + timestamp;
    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, textBook, pageBook, authorBook, timestamp, false);
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
  const bookTarget = findBookIndex(bookId);
 
  if (bookTarget === -1) return;
 
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
 
 
function undoTaskFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
 
  if (bookTarget == null) return;
 
  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
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

function generateBookObject(id, title, page, author, year, isCompleted) {
    return {
      id,
      title,
      page,
      author,
      year,
      isCompleted
    }
}

function makeBook(bookObject) {
    const textTitle = document.createElement('h2');
    textTitle.innerText = bookObject.title;

    const textPage = document.createElement('p');
    textPage.innerText = bookObject.page;
    
    const textAuthor = document.createElement('p');
    textAuthor.innerText = bookObject.author;

    const textYear = document.createElement('p');
    textYear.innerText = bookObject.year;
   
    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, 'Halaman', textPage, 'Penulis', textAuthor, 'Tahun', textYear);
    

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
        
        container.append(checkButton,  trashButton);
      }

    return container;
  }

  /**
  function editPage(bookId){
    div('list-item').addEventListener('click', (event) => {
      if(event.target.tagName === 'BUTTON') {
        const button = event.target;
        const p = button.parentNode;
        const div = p.parentNode;
        if(button.textContent === 'edit') {
          const page = p.firstElementChild;
          const input = document.createElement('input');
          input.type = 'text';
          input.value = page.textContent;
          p.insertBefore(input, page);
          p.removeChild(page);
          button.textContent = 'save';
        } else if(button.textContent === 'save') {
          const input = p.firstElementChild;
          const page = document.createElement('page');
          page.textContent = input.value;
          p.insertBefore(page, input);
          p.removeChild(input);
          button.textContent = 'edit';
  }

  }
  });
}
**/
  function eraseText(){
    document.getElementById("title").value = "";
    document.getElementById("page").value = "";
    document.getElementById("author").value = "";
    document.getElementById("year").value = "";
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
