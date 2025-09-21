let userBooks = JSON.parse(localStorage.getItem("userBooks")) || []; //parse:string to JSON
let userSaves = JSON.parse(localStorage.getItem("userSaves")) || []; // For books saved from index.html

// Render books you added manually
function renderUserBooks() {
  const container = document.getElementById("userBooks");
  container.innerHTML = "";

  userBooks.forEach((book, index) => {
    const col = document.createElement("div");
    col.className = "col-6 col-md-4 col-lg-3 mb-3";
    col.innerHTML = `
    <div class="card h-100">
        <img src="${book.cover || 'https://via.placeholder.com/150x200?text=No+Cover'}" class="card-img-top" style="height:200px; object-fit:cover;" />
        <div class="card-body">
          <h5 class="card-title">${book.title}</h5>
          <p class="card-text">${book.author} (${book.year || 'N/A'})</p>
          <button class="btn btn-warning btn-sm" onclick="editBook(${index})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteBook(${index})">Delete</button>
        </div>
    </div>
    `;
    container.appendChild(col);
  });

  localStorage.setItem("userBooks", JSON.stringify(userBooks));
}

//Add Book
document.getElementById("addBookForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = document.getElementById("year").value;
  const fileInput = document.getElementById("coverFile");
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const cover = event.target.result; // Base64 image
      saveBook({ title, author, year, cover });
    };
    reader.readAsDataURL(file);
  } else {
    saveBook({ title, author, year, cover: "" });
  }

  this.reset();
});

// Save book and render
function saveBook(book) {
  userBooks.push(book);
  localStorage.setItem("userBooks", JSON.stringify(userBooks));
  renderUserBooks();
}

// Edit Book
function editBook(index) {
  const book = userBooks[index];
  document.getElementById("title").value = book.title;
  document.getElementById("author").value = book.author;
  document.getElementById("year").value = book.year;
  // Cannot auto-fill file input (security restriction)
  alert("You can update the cover by selecting a new file when saving again.");

  // Remove old entry (re-add when updated)
  userBooks.splice(index, 1);
  renderUserBooks();
}

// Delete Book
function deleteBook(index) {
    userBooks.splice(index, 1);
    renderUserBooks();
}

// --- Functions for API Saved Books (Your Saves) ---

/**
 * Renders the books saved from the main page into the "Your Saves" accordion.
 */
function renderUserSaves() {
    const container = document.getElementById("userSaves");
    container.innerHTML = ""; // Clear previous content

    userSaves.forEach((book, index) => {
        const col = document.createElement("div");
        col.className = "col-6 col-md-4 col-lg-3 mb-3";
        // This card only has a 'Delete' button.
        col.innerHTML = `
        <div class="card h-100">
            <img src="${book.cover || 'https://via.placeholder.com/150x200?text=No+Cover'}" class="card-img-top" style="height:200px; object-fit:cover;" />
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${book.title}</h5>
                <p class="card-text">${book.author} (${book.year || 'N/A'})</p>
                <button class="btn btn-danger btn-sm mt-auto" onclick="deleteSavedBook(${index})">Delete</button>
            </div>
        </div>
        `;
        container.appendChild(col);
    });
}

/**
 * Deletes a book from the "Your Saves" list and updates localStorage.
 */
function deleteSavedBook(index) {
    // Remove the book from the userSaves array
    userSaves.splice(index, 1);
    // Update localStorage with the modified array
    localStorage.setItem("userSaves", JSON.stringify(userSaves));
    // Re-render the list to show the change
    renderUserSaves();
}

// Initial Render
renderUserBooks();
renderUserSaves();