let currentSong = new Audio();

async function getSongs() {
  let a = await fetch("http://omwebsolutions.000webhostapp.com/spotify/songs/");
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
    song.replace(
      "http://127.0.0.1:5500/",
      "https://omwebsolutions.000webhostapp.com/spotify/songs/"
    )
  );
  return newSongs;
}
async function createSongList(songs, songUl){
  for (let song of songs) {
    let mainUrl = song
    let li = document.createElement("li");
    song = song
      .split("/songs/")[1]
      .replaceAll("%20", " ")
      .replace(".mp3", "")
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

const playMusic = (songUrl) => {
  currentSong.src = songUrl;
  currentSong.play();
}

async function main() {
  let currentSong;
  let songs = await getSongs();
  //console.log(songs);
  let songUl = document.querySelector(".songList ol");
  await createSongList(songs, songUl);

  Array.from(songUl.getElementsByTagName("li")).forEach((e) => {
    const songElement = e.querySelector(".songName");
    if (songElement) {
      let songUrl = songElement.getAttribute("name");
      songElement.parentElement.parentElement.addEventListener("click", () => {
        playMusic(songUrl);
      });
    }
  });
  
  var audio = new Audio(songs[0]);
  //audio.play();

  audio.addEventListener("loadeddata", () => {
    console.log(audio.duration, audio.currentSrc, audio.currentTime);
  });

  //Attatch an event listener to each song
}

main();
