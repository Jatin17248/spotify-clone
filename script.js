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
      "http://omwebsolutions.000webhostapp.com/spotify/songs/"
    )
  );
  return newSongs;
}

async function main() {
  let songs = await getSongs();
  console.log(songs);
  let songUl = document.querySelector(".songList ol");
  for (let song of songs) {
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
                <div>${songName}</div>
                <div>${
                  singerName !== undefined ? singerName : "By Unknown"
                }</div>
              </div>
              <div class="play"><i class="fa-solid fa-play"></i></div>`;
    songUl.appendChild(li);
  }
  var audio = new Audio(songs[0]);
  //audio.play();

  audio.addEventListener("loadeddata", () => {
    console.log(audio.duration, audio.currentSrc, audio.currentTime);
  });
}

main();
