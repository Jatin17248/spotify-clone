document.addEventListener("DOMContentLoaded", () => {
  const currentSong = new Audio();

  // Get the pause and next buttons

  const previous = document.getElementById("backwardSong");
  const pause = document.getElementById("pauseSong");
  const next = document.getElementById("nextSong");

  async function getSongs() {
    let a = await fetch("https://test.brightjuniors.in/proxy.php");
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
    if (typeof seconds !== "number" || seconds < 0) {
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
        .split("/songs/")[1]
        .replaceAll("%20", " ")
        .replace(".mp3", "")
        .replace("%28DJJOhAL.Com%29", "")
        .replace("(DJJOhAL.Com)", "");
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
      .split("/songs/")[1]
      .replaceAll("%20", " ")
      .replace(".mp3", "")
      .replace("%28DJJOhAL.Com%29", "")
      .replace("(DJJOhAL.Com)", "");
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
    let songs = await getSongs();
    playMusic(songs[0], false);
    let songUl = document.querySelector(".songList ol");
    await createSongList(songs, songUl);

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
  }

  main();
  currentSong.addEventListener("error", (e) => {
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
});
