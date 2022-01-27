const songpoint = "https://api.lyrics.ovh/suggest/";
const lyricpoint = "https://api.lyrics.ovh/v1/";
const searchInput = document.getElementById("search");
const displayInput = document.querySelector("#suggestions");
const moreButtons = document.getElementById("next-buttons");

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
  const html = searchArray
    .map((res) => {
      return `
            <ul><li>  
                <span id="song-info"><img alt="album" src="${res.album.cover_small}"><strong>${res.artist.name}</strong> - ${res.title} </span>
                <button id="get-lyrics" onclick="lyricsSearch('${res.artist.name}','${res.title.replace(/[^\w ]/,)}','${res.preview}')">Get Lyrics</button>
            </li></ul>`;
    }).join("");
  let html2 = `<button id="extra-lyrics">Next</button>`;
  document.title = `Search Results - ${searchText}`;
  moreButtons.innerHTML = html2;
  displayInput.innerHTML = html;
}

async function lyricsSearch(artistName,songTitle, preview) {
  // let link2 = lyricpoint + artistName + "/" +songTitle;
  // console.log(link2);
  songTitle=songTitle.replace(undefined,"'")
  let res = await fetch(`${lyricpoint}/${artistName}/${songTitle}`).then((blob) => blob.json());
  console.log(res);
  if (res.error) {
    alert("No Lyrics Found");
  } else {
    document.title = `${songTitle} Lyrics`;
  }

  let html = `
            <h2> <strong>${artistName}</strong> - ${songTitle}</h2>
            <audio controls><source src="${preview}"></audio>
            <div><p> ${res.lyrics.replace(/(\r\n|\n\n|\r|\n)/gi, '<br>')} </p></div>
        `;
  displayInput.innerHTML = html;
  moreButtons.innerHTML = `<button id="extra-lyrics" onclick="window.location.reload()">Done</button>`;
}

window.onload = function () {
  $("input").on("keydown", function search(e) {
    if (e.keyCode == 13) {
      songSearch();
    }
  });
};

