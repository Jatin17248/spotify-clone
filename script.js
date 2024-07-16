document.addEventListener("DOMContentLoaded", () => {
  const currentSong = new Audio();
  let currFolder = "default";
  let albums = [];
  // Get the pause and next buttons
  let songs;
  const previous = document.getElementById("backwardSong");
  const pause = document.getElementById("pauseSong");
  const next = document.getElementById("nextSong");

  async function getSongs() {
    let a = await fetch(
      `https://test.brightjuniors.in/spotify/songs/${currFolder}/proxy.php`
    );
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
      const element = as[index];
      if (element.href.endsWith(".mp3")) songs.push(element.href);
    }

    const newSongs = songs.map((song) =>
      song.replace("http://127.0.0.1:5500/", "https://test.brightjuniors.in/")
    );
    return newSongs;
  }
  function formatTime(seconds) {
    // Ensure the input is a number and is not negative
    if (typeof seconds !== "number" || seconds < 0 || seconds === NaN) {
      return "0:00";
    }

    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Pad the remaining seconds with leading zero if necessary
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    // Return the formatted time
    return `${minutes}:${formattedSeconds}`;
  }

  async function createSongList(songs, songUl) {
    for (let song of songs) {
      let mainUrl = song;
      let li = document.createElement("li");
      song = song
        .split(`/songs/${currFolder}/`)[1]
        .replaceAll("%20", " ")
        .replace(".mp3", "")
        .replace("%28DJJOhAL.Com%29", "")
        .replace("(DJJOhAL.Com)", "");
      song = song.replace(currFolder + "/", "");
      song = decodeURI(song);
      let songName = song.split("-")[0];
      let singerName = song.split("-")[1];
      li.innerHTML = `<i class="fa-solid fa-music"></i>
              <div class="info">
                <div class="songName" name="${mainUrl}">${songName}</div>
                <div>${
                  singerName !== undefined ? singerName : "By Unknown"
                }</div>
              </div>
              <div class="play"><i class="fa-solid fa-play"></i></div>`;
      songUl.appendChild(li);
    }
  }

  const playMusic = (songUrl, play = true) => {
    currentSong.src = songUrl;
    if (play) {
      currentSong.play();
      pause.classList.remove("fa-circle-play");
      pause.classList.add("fa-circle-pause");
    }

    let song = songUrl
      .split(`/songs/${currFolder}/`)[1]
      .replaceAll("%20", " ")
      .replace(".mp3", "")
      .replace("%28DJJOhAL.Com%29", "")
      .replace("(DJJOhAL.Com)", "");
    song = song.replace(currFolder + "/", "");
    console.log(song);
    song = decodeURI(song);
    let songName = song.split("-")[0];
    let singerName = song.split("-")[1];
    document.querySelector(
      ".songInfo"
    ).innerHTML = ` <div class="songName">${songName}</div>
                <div>${
                  singerName !== undefined ? "by" + singerName : "By Unknown"
                }</div>`;
    currentSong.addEventListener("loadedmetadata", function () {
      document.querySelector(".songTime").innerHTML = `${formatTime(
        currentSong.currentTime
      )}/${formatTime(currentSong.duration)}`;
    });
  };

  async function main() {
    songs = await getSongs();
    playMusic(songs[0], false);
    let songUl = document.querySelector(".songList ol");
    await createSongList(songs, songUl);
    albums = await getAllAlbums();
    createAlbumsList(albums);
    createAlbumsList(albums);
    createAlbumsList(albums);
    createAlbumsList(albums);
    createAlbumsList(albums);
    createAlbumsList(albums);
    createAlbumsList(albums);
    createAlbumsList(albums);
    createAlbumsList(albums);
    createAlbumsList(albums);
    createAlbumsList(albums);
    createAlbumsList(albums);
    createAlbumsList(albums);

    Array.from(songUl.getElementsByTagName("li")).forEach((e) => {
      const songElement = e.querySelector(".songName");
      if (songElement) {
        let songUrl = songElement.getAttribute("name");
        songElement.parentElement.parentElement.addEventListener(
          "click",
          () => {
            playMusic(songUrl);
          }
        );
      }
    });

    //Atatch an event listener to each button of playbar
    pause.addEventListener("click", () => {
      if (currentSong.paused) {
        currentSong.play();
        pause.classList.remove("fa-circle-play");
        pause.classList.add("fa-circle-pause");
        pause.setAttribute("aria-label", "Pause");
      } else {
        currentSong.pause();
        pause.classList.add("fa-circle-play");
        pause.classList.remove("fa-circle-pause");
        pause.setAttribute("aria-label", "Play");
      }
    });
    cardPlay();
  }

  main();
  currentSong.addEventListener("error", (e) => {
    console.log(songs);
    console.error("Error playing the audio:", e);
  });
  // added eventlistener to song for updating the time and seekbar
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songTime").innerHTML = `${formatTime(
      currentSong.currentTime
    )}/${formatTime(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // added eventlistener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let seekPercent =
      (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = seekPercent + "%";
    currentSong.currentTime = (currentSong.duration * seekPercent) / 100;
  });

  // add event listeners for responsiveness
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });
  document.querySelector("#closeMenu").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
  });

  document
    .querySelector(".volume")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentSong.volume = parseInt(e.target.value) / 100;
      if(currentSong.volume > 0){
        if(muteBtn.classList.contains("fa-volume-xmark")){
        muteBtn.classList.add("fa-volume-high");
        muteBtn.classList.remove("fa-volume-xmark");
        }
      }
    });

  next.addEventListener("click", () => {
    playNextMusic();
  });

  previous.addEventListener("click", () => {
    playPrevMusic();
  });

  const playNextMusic = () => {
    currentSong.pause();
    let index = songs.indexOf(currentSong.src);
    let newIndex = (index + 1) % songs.length;
    playMusic(songs[newIndex]);
  };
  const playPrevMusic = () => {
    currentSong.pause();
    let index = songs.indexOf(currentSong.src);
    let newIndex = (index - 1 + songs.length) % songs.length;
    playMusic(songs[newIndex]);
  };
  const muteBtn = document.querySelector(".volume i");
    muteBtn.addEventListener("click", (e)=>{
    let volRange = document
    .querySelector(".volume")
    .getElementsByTagName("input")[0];
      console.log(e.target);
    if(currentSong.volume !== 0){
    muteBtn.classList.remove("fa-volume-high");
    muteBtn.classList.add("fa-volume-xmark");
    currentSong.volume = 0;
    volRange.value=0;
  }
  else{
    muteBtn.classList.add("fa-volume-high");
    muteBtn.classList.remove("fa-volume-xmark");
    currentSong.volume = currentSong.volume + 0.05;
    volRange.value=5;
  }
  })

  const getAllAlbums = async () => {
    let a = await fetch(
      `https://test.brightjuniors.in/spotify/songs/proxy.php`
    );
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let folders = [];
    let newFolders;
    for (let index = 0; index < as.length; index++) {
      const element = as[index];
      if (
        !(
          element.href.endsWith(".php") ||
          element.href.endsWith("/default/") ||
          element.href.endsWith("/spotify/")
        )
      ) {
        folders.push(element.href);
      }

      newFolders = folders.map((folder) =>
        folder.replace(
          "http://127.0.0.1:5500/",
          "https://test.brightjuniors.in/"
        )
      );
    }
    return newFolders;
  };
  function capitalizeWords(str) {
    return str
      .split(" ")
      .map((word) => {
        // Capitalize the first character and concatenate it with the rest of the string
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");
  }

  async function createAlbumsList(albums) {
    for (let album of albums) {
      let mainUrl = album;
      let li = document.createElement("div");
      album = album
        .split("/songs/")[1]
        .replaceAll("%20", " ")
        .replace(".mp3", "")
        .replace("%28DJJOhAL.Com%29", "")
        .replace("(DJJOhAL.Com)", "")
        .replace("/", "");
      album = album.replace(currFolder + "/", "");
      album = decodeURI(album);
      let albumName = album.split("-")[0];
      let singerName = album.split("-")[1];
      li.innerHTML = `<div class="card" name=${encodeURI(album)}>
              <img
                src=${mainUrl + "index.jpg"}
              />
              <div class="play"><i class="fa-solid fa-play"></i></div>
              <h2>${capitalizeWords(albumName)}</h2>
              <p>${capitalizeWords(singerName)}</p>
            </div>
            `;
      document.querySelector(".cardContainer").appendChild(li);
    }
  }
  const cardPlay = async () => {
    const cards = document.querySelectorAll(".card");

    cards.forEach((card) => {
      card.addEventListener("click", async () => {
        songs = [];
        currFolder = card.getAttribute("name");
        songs = await getSongs();
        playMusic(songs[0]);
        console.log(songs);
        let songUl = document.querySelector(".songList ol");
        songUl.innerHTML = "";
        await createSongList(songs, songUl);
      });
    });
  };
});
