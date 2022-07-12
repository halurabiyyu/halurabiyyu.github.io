"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

//menambahkan  sebuah variabel berisi array yang akan menampung beberapa object. Object ini berisikan data-data Todo user. 
var books = []; //menambahkan sebuah variabel yang bertujuan mendefinisikan custom event  dengan nama render-todo

var RENDER_EVENT = 'render-book';
var SAVED_EVENT = 'saved-book';
var STORAGE_KEY = 'BOOK_APPS'; //Kode di bawah adalah sebuah listener yang akan menjalankan kode yang ada didalamnya ketika event DOMContentLoaded dibangkitkan alias ketika semua elemen HTML sudah dimuat menjadi DOM dengan baik.

document.addEventListener('DOMContentLoaded', function () {
  var submitForm = document.getElementById('form');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
}); //membuat fungsi untuk membuat todo

function addBook() {
  //kode di bawah berfungsi untuk mengambil elemen pada html
  var textBook = document.getElementById('title').value; //dalam kasus ini kita menangkap element input dengan id title dan memanggil properti value untuk mendapatkan nilai yang diinputkan oleh user

  var authorBook = document.getElementById('author').value;
  var timestamp = document.getElementById('year').value;
  var hiddenMessage = 'Penulis ' + authorBook + 'Tahun ' + timestamp;
  var generatedID = generateId();
  var bookObject = generateBookObject(generatedID, textBook, authorBook, timestamp, false);
  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addTaskToCompleted(bookId) {
  var bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = books[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var bookItem = _step.value;

      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return null;
}

function removeTaskFromCompleted(bookId) {
  var bookTarget = findTodoIndex(bookId);
  if (bookTarget === -1) return;
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoTaskFromCompleted(bookId) {
  var bookTarget = findTodo(bookId);
  if (bookTarget == null) return;
  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findTodoIndex(bookId) {
  for (var index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

function saveData() {
  if (isStorageExist()) {
    var parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() {
  if ((typeof Storage === "undefined" ? "undefined" : _typeof(Storage)) === undefined) {
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
    id: id,
    title: title,
    author: author,
    year: year,
    isCompleted: isCompleted
  };
}

function makeBook(bookObject) {
  var textTitle = document.createElement('h2');
  textTitle.innerText = bookObject.title;
  var textAuthor = document.createElement('p');
  textAuthor.innerText = bookObject.author;
  var textYear = document.createElement('p');
  textYear.innerText = bookObject.year;
  var textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(textTitle, 'Penulis', textAuthor, 'Tahun', textYear);
  var container = document.createElement('div');
  container.classList.add('item', 'shadow');
  container.append(textContainer);
  container.setAttribute('id', "book-".concat(bookObject.id));

  if (bookObject.isCompleted) {
    var undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');
    undoButton.addEventListener('click', function () {
      undoTaskFromCompleted(bookObject.id);
    });
    var trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(bookObject.id);
    });
    container.append(undoButton, trashButton);
  } else {
    var checkButton = document.createElement('button');
    checkButton.classList.add('check-button');
    checkButton.addEventListener('click', function () {
      addTaskToCompleted(bookObject.id);
    });

    var _trashButton = document.createElement('button');

    _trashButton.classList.add('trash-button');

    _trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(bookObject.id);
    });

    container.append(checkButton, _trashButton);
  }

  return container;
}

function searchBook() {
  var search = document.querySelector("searchBookTitle");
  search.addEventListener('keyup', searchList());
}

function searchList(a) {
  var cariList = a.target.value.toLowerCase();
  var itemList = document.querySelectorAll(".container");
  itemList.forEach(function (item) {
    var isiItem = item.firstChild.textContent.toLowerCase();

    if (isiItem.indexOf(cariList) != -1) {
      item.setAttribute("style", "display: block;");
    } else {
      item.setAttribute("style", "display: none !important;");
    }
  });
}

function loadDataFromStorage() {
  var serializedData = localStorage.getItem(STORAGE_KEY);
  var data = JSON.parse(serializedData);

  if (data !== null) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var book = _step2.value;
        books.push(book);
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
          _iterator2["return"]();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(RENDER_EVENT, function () {
  var uncompletedBookList = document.getElementById('books');
  uncompletedBookList.innerHTML = '';
  var completedBookList = document.getElementById('completed-books');
  completedBookList.innerHTML = '';
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = books[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var bookItem = _step3.value;
      var bookElement = makeBook(bookItem);
      if (!bookItem.isCompleted) uncompletedBookList.append(bookElement);else completedBookList.append(bookElement);
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
        _iterator3["return"]();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }
});
document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});