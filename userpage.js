let userBooks = JSON.parse(localStorage.getItem("userBooks")) || []; 
let userSaves = JSON.parse(localStorage.getItem("userSaves")) || []; 

// Render books you added manually
function renderUserBooks() {
  const container = document.getElementById("userBooks");
  container.innerHTML = "";

  userBooks.forEach((book, index) => {
    const modalId = `userBookModal-${index}`;
    const col = document.createElement("div");
    col.className = "col-6 col-md-4 col-lg-2 mb-3";
    col.innerHTML = `
    <div class="card h-100 customcard" style="box-shadow: 2px 2px 10px 1px rgba(0,0,0,0.6);">
  <img src="${book.cover}" 
       class="card-img-top"  alt="No image uploaded"
       style="height:160px; object-fit:cover;" 
       type="button" data-bs-toggle="modal" data-bs-target="#${modalId}" />
  <div class="card-body">
    <h5 class="card-title">${book.title}</h5>
    <p class="card-text">${book.author} (${book.year || 'N/A'})</p>
    <button class="btn btn-warning btn-sm" onclick="editBook(${index})">Edit</button>
    <button class="btn btn-danger btn-sm" onclick="deleteBook(${index})">Delete</button>
  </div>
</div>


    <!-- Modal -->
    <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true" style="font-family: 'IM FELL DW Pica SC'">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header" style="background-color: #75070C !important;color: #F4E3B2 !important;">
            <h1 class="modal-title fs-5" id="${modalId}Label">${book.title}</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" style="background: linear-gradient(to top, #F4E3B2, #FFFFFF) !important; color: #75070C;!important">
              <img src="${book.cover || 'https://via.placeholder.com/300x400?text=No+Cover'}" class="img-fluid mb-3"/>
              <form>
                  <h4>Author: ${book.author}</h4>
                  <h5>Year: ${book.year || 'N/A'}</h5>
                  <div class="mb-3">
                      <label for="userBookNote-${index}" class="col-form-label">Add notes:</label>
                      <textarea class="form-control" id="userBookNote-${index}">${book.notes || ""}</textarea>
                  </div>
              </form>
              <div class="modal-footer">
                  <button type="button" class="btn " onclick="saveBookNotes(${index})" style="background-color: #75070C !important;color: #F4E3B2 !important;">Save Notes</button>
                  <button type="button" class="btn " onclick="clearUserBookNotes(${index})" style="background-color: #75070C !important;color: #F4E3B2 !important;">Clear Notes</button>
                  <button type="button" class="btn " data-bs-dismiss="modal" style="background-color: #75070C !important;color: #F4E3B2 !important;">Close</button>
              </div>
          </div>
        </div>
      </div>
    </div>
    `;
    container.appendChild(col);
  });

  localStorage.setItem("userBooks", JSON.stringify(userBooks));
}

// Save Notes for User Books
function saveBookNotes(index) {
  const textarea = document.getElementById(`userBookNote-${index}`);
  if (textarea) {
    userBooks[index].notes = textarea.value;
    localStorage.setItem("userBooks", JSON.stringify(userBooks));
    alert("Notes saved!");
  }
}

// Clear Notes for User Books
function clearUserBookNotes(index) {
  const textarea = document.getElementById(`userBookNote-${index}`);
  if (textarea) {
    textarea.value = "";
    userBooks[index].notes = "";
    localStorage.setItem("userBooks", JSON.stringify(userBooks));
  }
}

// Add Book
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
      const cover = event.target.result; 
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
  alert("You can update the cover by selecting a new file when saving again.");
  userBooks.splice(index, 1);
  renderUserBooks();
}

// Delete Book
function deleteBook(index) {
    userBooks.splice(index, 1);
    renderUserBooks();
}

// Render User Saves with modals
function renderUserSaves() {
    const container = document.getElementById("userSaves");
    container.innerHTML = "";

    userSaves.forEach((book, index) => {
        const modalId = `userSaveModal-${index}`;
        const col = document.createElement("div");
        col.className = "col-6 col-md-4 col-lg-2 mb-3";
        col.innerHTML = `
        <div class="card customcard h-100" style="box-shadow: 2px 2px 10px 1px rgba(0,0,0,0.6);">
  <img src="${book.cover}" 
       class="card-img-top h-100"
       type="button" 
       data-bs-toggle="modal" 
       data-bs-target="#${modalId}"/>
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${book.title}</h5>
                <p class="card-text">${book.author} (${book.year || 'N/A'})</p>
                <button class="btn btn-danger btn-sm mt-auto" onclick="deleteSavedBook(${index})">Delete</button>
            </div>
        </div>

        <!-- Modal -->
        <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true" style="font-family: 'IM FELL DW Pica SC'">>
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header" style="background-color: #75070C !important;color: #F4E3B2 !important;">
                <h1 class="modal-title fs-5" id="${modalId}Label">${book.title}</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body" style="background: linear-gradient(to top, #F4E3B2, #FFFFFF) !important; color: #75070C;!important">
                  <img src="${book.cover}" 
     class="img-fluid d-block mx-auto" 
     style="border-radius:5px !important;"/>
                  <form>
                      <h4>Author: ${book.author}</h4>
                      <h5>Year: ${book.year || 'N/A'}</h5>
                      <div class="mb-3">
                          <label for="userSaveNote-${index}" class="col-form-label">Add notes:</label>
                          <textarea class="form-control" id="userSaveNote-${index}">${book.notes || ""}</textarea>
                      </div>
                  </form>
                  <div class="modal-footer">
                      <button type="button" class="btn " onclick="saveSaveNotes(${index})" style="background-color: #75070C !important;color: #F4E3B2 !important;">Save Notes</button>
                      <button type="button" class="btn" onclick="clearUserSaveNotes(${index})" style="background-color: #75070C !important;color: #F4E3B2 !important;">Clear Notes</button>
                      <button type="button" class="btn " data-bs-dismiss="modal" style="background-color: #75070C !important;color: #F4E3B2 !important;">Close</button>
                  </div>
              </div>
            </div>
          </div>
        </div>
        `;
        container.appendChild(col);
    });
}

// Save notes for userSaves
function saveSaveNotes(index) {
    const textarea = document.getElementById(`userSaveNote-${index}`);
    if (textarea) {
        userSaves[index].notes = textarea.value;
        localStorage.setItem("userSaves", JSON.stringify(userSaves));
        alert("Notes saved!");
    }
}

// Clear notes for userSaves
function clearUserSaveNotes(index) {
    const textarea = document.getElementById(`userSaveNote-${index}`);
    if (textarea) {
        textarea.value = "";
        userSaves[index].notes = "";
        localStorage.setItem("userSaves", JSON.stringify(userSaves));
    }
}

// Delete saved book
function deleteSavedBook(index) {
    userSaves.splice(index, 1);
    localStorage.setItem("userSaves", JSON.stringify(userSaves));
    renderUserSaves();
}

// Initial Render
renderUserBooks();
renderUserSaves();
