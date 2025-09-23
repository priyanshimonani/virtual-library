let controller;
function search(searched) {
  if (controller) {
    controller.abort();
  }

  controller = new AbortController();
  const signal = controller.signal;
  console.log("seraching");
  const containerload = document.getElementById("books");
      containerload.innerHTML = `
      <div class="container text-center">
        <div class="row row-cols-6 row-cols-lg-6 g-2 g-lg-3">
          <div class="col">
            <div class="card" style="height: 200px;">
              <p class="card-text placeholder-glow" style="padding-left: 4px; padding-right: 4px; padding-top: 3px;">
                <span class="placeholder col-12" style="height: 100px;"></span>
                <span class="placeholder col-4"></span>
                <span class="placeholder col-4"></span>
                <span class="placeholder col-6"></span>
                <span class="placeholder col-8"></span>
              </p>
              <h5 class="card-title placeholder-glow">
                <span class="placeholder"></span>
              </h5>
            </div>
          </div>
          </div>
    </div>
`;
  const search=searched;
  fetch(`https://openlibrary.org/search.json?q=${searched}`, { signal })
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById("books");
      container.innerHTML = "";

      if (data.docs) {
        data.docs.forEach((book, index) => {
          if (book.cover_i) {
            const modalId = `modal-${index}`; // unique modal ID
            
            // Create a clean book object to pass to our new function
            const bookToSave = {
              title: book.title,
              author: book.author_name ? book.author_name.join(', ') : 'Unknown Author',
              year: book.first_publish_year || 'N/A',
              cover: `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
            };

            const col = document.createElement("div");
            col.className = "col-6 col-md-4 col-lg-2 mb-3";

            col.innerHTML = `
              <div class="card h-100 customcard" style="box-shadow: 2px 2px 10px 1px rgba(0,0,0,0.6);" >
                <img src="https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg"
                     class="card-img-top h-100"
                     type="button"
                     data-bs-toggle="modal"
                     data-bs-target="#${modalId}" />
                <div class="card-body">
                  <h5 class="card-title">${book.title}</h5>
                </div>
              </div>

              <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true" style="font-family: 'IM FELL DW Pica SC'">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header" style="background-color: #75070C !important;color: #F4E3B2 !important;">
                      <h1 class="modal-title fs-5" id="${modalId}Label">${book.title}</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" style="background: linear-gradient(to top, #F4E3B2, #FFFFFF) !important; color: #75070C;!important">
                        <img src="https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg" class="img-fluid" style="border-radius=5px;"/>
                        <form>
                        <h4>Author: ${book.author_name}</h4>
                        <h5>Year: ${book.first_publish_year}</h5>
                        <div class="mb-3">
                        <label for="message-text-${index}" class="col-form-label">Add notes:</label>
                        <textarea class="form-control" id="message-text-${index}"></textarea>
                        </div>
                        </form>
                        <div class="modal-footer">
                            <button type="button" class="btn" data-bs-dismiss="modal" style="background-color: #75070C !important;color: #F4E3B2 !important;">Save Notes</button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" style="background-color: #75070C !important;color: #F4E3B2 !important;">Close</button>
                            <button type="button" class="btn btn-warning" onclick="clearNotes(${index})" style="background-color: #75070C !important;color: #F4E3B2 !important;">Clear Notes</button>
                            <button class="btn w-100 custBook" type="button" onclick='saveBookForLater(${JSON.stringify(bookToSave)})'>
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-bookmark-heart" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M8 4.41c1.387-1.425 4.854 1.07 0 4.277C3.146 5.48 6.613 2.986 8 4.412z"/>
                                <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z"/>
                              </svg>
                            </button>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            `;
            container.appendChild(col);
          }
        });
      }
    })
    .catch(error => console.error("Error fetching books", error));
}

//Saving books
function saveBookForLater(bookData) {
  // Get existing saved books from localStorage, or start a new empty array
  let userSaves = JSON.parse(localStorage.getItem("userSaves")) || [];

  // Check if the book is already saved to prevent duplicates
  const isDuplicate = userSaves.some(
    (savedBook) => savedBook.title === bookData.title && savedBook.author === bookData.author
  );

  if (isDuplicate) {
    alert("This book is already in your 'Saves' list!");
    return; // Exit the function if it's a duplicate
  }

  // Add the new book to the array
  userSaves.push(bookData);

  // Save the updated array back to localStorage
  localStorage.setItem("userSaves", JSON.stringify(userSaves));
  alert(`"${bookData.title}" has been added to your saves!`);
}

// Clear notes function
function clearNotes(index) {
  const textarea = document.getElementById(`message-text-${index}`);
  if (textarea) {
    textarea.value = "";
  }
}
