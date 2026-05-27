document.addEventListener("DOMContentLoaded", () => {
  const selectAllCheckbox = document.querySelector("#selectAll");
  const deleteButton = document.querySelector("#deleteButton");
  let songCheckboxes = document.querySelectorAll(".songCheckbox");
  songCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    toggleDeleteButton();
    toggleSelectAllCheckbox();
  });
});

  
  // Toggle delete button based on checkbox selection
  // Toggle delete button based on checkbox selection
function toggleDeleteButton() {
  const checkedCheckboxes = document.querySelectorAll(".songCheckbox:checked");
  deleteButton.disabled = checkedCheckboxes.length === 0 && selectAllCheckbox.checked === false;
}


  // Select or deselect all checkboxes
  function toggleCheckboxes() {
    const isChecked = selectAllCheckbox.checked;
    songCheckboxes.forEach((checkbox) => {
      checkbox.checked = isChecked;
    });
    toggleDeleteButton();
  }

  // Delete selected songs from the playlist database
  async function deleteSelectedSongs() {
    const checkedCheckboxes = document.querySelectorAll(".songCheckbox:checked");
    let selectedSongIds = Array.from(checkedCheckboxes).map((checkbox) => checkbox.value);
    // Deletes the "on" checkbox from the list when all the songs are selected
    if (selectedSongIds[0] == "on") {
      selectedSongIds.shift();
    }

    // Make an API request to delete the songs
    try {
      let response = await fetch("deleteSongs", {
        method: "POST",
        body: JSON.stringify({ songIds: selectedSongIds }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Refresh the page
        window.location.reload();
      } else {
        console.error("Failed to delete songs.");
      }
    } catch (error) {
      console.log("error");
      console.error("Error occurred while deleting songs:", error);
    }
  }

  // Event listeners
  selectAllCheckbox.addEventListener("change", toggleCheckboxes);

  // Update songCheckboxes when search is performed
  async function findSongInDB(searchMethod) {
    let searchQuery = document.querySelector("input[name=searchBox]").value;
    console.log(searchMethod, searchQuery);
    selectAllCheckbox.checked = false;

    // Check if search query is empty
    if (searchQuery.trim() === "") {
      // Reset the playlist view by reloading the page
      location.reload();
      return;
    }

    // Call API
    let url = "/api/" + searchMethod + "/" + searchQuery;
    let response = await fetch(url);
    let data = await response.json();
    console.log(data);

    // Replace songs in songCardContainer with search results
    let songCardContainer = document.querySelector(".songCardContainer");
    songCardContainer.innerHTML = ""; // Clear previous songs

    if (data.length > 0) {
      data.forEach((song) => {
        // Generate song card HTML
        let songCard = document.createElement("div");
        songCard.classList.add("card", "songCard");
        songCard.innerHTML = `
          <img src="${song.albumImage}" alt="Song Image">
          <hr class="solid">
          <h2 class="songTitlePlaylist">${song.title}</h2>
          <p class="note">${song.name}</p>
          <hr class="solid">
          ${song.preview !== null ? `
            <audio controls>
              <source src="${song.preview}" type="audio/mpeg">
            </audio>
          ` : `
            <h3>No track preview available</h3>
          `}
          <div class="form-check form-switch">
            <input class="form-check-input songCheckbox"           type="checkbox" value="${song.songId}">
          </div>
        `;

        songCardContainer.appendChild(songCard);
      });

      // Update the songCheckboxes variable with the new checkboxes
      songCheckboxes = document.querySelectorAll(".songCheckbox");

      // Add event listeners to the new checkboxes
      songCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", toggleDeleteButton);
      });
    } else {
      let noResultsMessage = document.createElement("p");
      noResultsMessage.textContent = "No results found.";
      songCardContainer.appendChild(noResultsMessage);
    }
    deleteButton.disabled = true;
  }

  // Add event listeners to search buttons
  document.querySelector("#searchSong").addEventListener("click", () => {
    findSongInDB("Song Title");
  });

  document.querySelector("#searchArtist").addEventListener("click", () => {
    findSongInDB("Artist");
  });

  // Add event listener to delete button
  deleteButton.addEventListener("click", deleteSelectedSongs);
});

