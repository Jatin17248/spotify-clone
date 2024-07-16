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
        folder.split("/songs/")[1]
      .replaceAll("%20", " ")
      .replace(".mp3", "")
      .replace("%28DJJOhAL.Com%29", "")
      .replace("(DJJOhAL.Com)", "")
      .replace("/", "") )
     
    }
    let docAlbum =document.getElementById("album");
    newFolders.forEach((folder)=>{
        let option = document.createElement("option");
        option.innerHTML = folder ;
        option.setAttribute("value", encodeURI(folder));
        docAlbum.appendChild(option);
    })
    
  };

  getAllAlbums();

