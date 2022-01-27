const songpoint = "https://api.lyrics.ovh/suggest/";
const lyricpoint = "https://api.lyrics.ovh/v1/";
const searchInput = document.getElementById("search");
const displayInput = document.querySelector("#suggestions");
const moreButtons = document.getElementById("next-buttons");
const html2 = `<button id="extra-lyrics" onclick="window.location.reload()">Home</button>`;

function songSearch() {
  let searchText = searchInput.value;
  if (searchText != "") {
    songPrint(searchText);
  } else {
    alert("Enter song or artist name to proceed.");
  }
}

async function songPrint(searchText) {
  let searchArray = [];
  let link1 = songpoint + searchText;
  await fetch(link1)
    .then((blob) => blob.json())
    .then((data) => searchArray.push(...data.data));
  console.log(searchArray);
  if (searchArray.length === 0) {
    displayInput.innerHTML = `<div><p style="text-align:center" > No Record Found. Please try again!!</p></div>`;
    moreButtons.innerHTML = html2;
  }

  else{
  const html = searchArray
    .map((prop) => {
      return `
            <ul><li>  
                <span id="song-info"><img alt="album" src="${prop.album.cover_small}"><strong>${prop.artist.name}</strong> - ${prop.title} </span>
                <button id="get-lyrics" onclick="lyricsSearch('${prop.artist.name}','${prop.title.replace(/['"]/, "*")}','${prop.preview}')">Get Lyrics</button>
            </li></ul>`;
    }).join("");
  // let html2 = `<button id="extra-lyrics" onclick="window.location.reload()">Done</button>`;
  document.title = `Search Results - ${searchText}`;
  moreButtons.innerHTML = html2;
  displayInput.innerHTML = html;}
}

async function lyricsSearch(artistName, songTitle, preview) {
  // let link2 = lyricpoint + artistName + "/" +songTitle;

  songTitle = songTitle.replace("*", "'")
  let prop = await fetch(`${lyricpoint}/${artistName}/${songTitle}`).then((blob) => blob.json());

  if (prop.error) {
    alert("No Lyrics Found");
  } else {
    document.title = `${songTitle} Lyrics`;
  }

  let html = `
            <h2> <strong>${artistName}</strong> - ${songTitle}</h2>
            <audio controls><source src="${preview}"></audio>
            <div><p> ${prop.lyrics.replace(/(\r\n|\n\n|\r|\n)/gi, '<br>')} </p></div>
        `;
  displayInput.innerHTML = html;
  moreButtons.innerHTML = html2;
}

window.onload = function () {
  $("input").on("keydown", function search(e) {
    if (e.keyCode == 13) {
      songSearch();
    }
  });
};

