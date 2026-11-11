// API osoite
const API_OSOITE = "https://ws.audioscrobbler.com/2.0/";

// Lisätään klikkaus jokaiseen artistinappiin
const napit = document.querySelectorAll(".artisti");
for (let i = 0; i < napit.length; i++) {
  napit[i].addEventListener("click", function () {
    haeAlbumit(napit[i].textContent);
  });
}

// Hakunappi hakee kirjoitetun artistin
document.getElementById("hakunappi").addEventListener("click", function () {
  const nimi = document.getElementById("hakukentta").value;
  if (nimi !== "") {
    haeAlbumit(nimi);
  }
});

// Hakee artistin albumit Last.fm:stä
function haeAlbumit(artisti) {
  const osoite = API_OSOITE + "?method=artist.gettopalbums&artist=" + encodeURIComponent(artisti) +
                 "&api_key=" + API_KEY + "&format=json&limit=12";

  fetch(osoite)
    .then(function (vastaus) {
      return vastaus.json();
    })
    .then(function (data) {
      naytaAlbumit(data, artisti);
    });
}

// Näyttää albumit sivulla
function naytaAlbumit(data, artisti) {
  const albumitDiv = document.getElementById("albumit");
  albumitDiv.innerHTML = "";                                  // tyhjennetään aikaisemmin haetut albumit
  document.getElementById("kappaleet").innerHTML = "";        // tyhjennetään myös vanhat kappalelistat

  // Jos artistia ei löydy
  if (data.error) {
    document.getElementById("otsikko").textContent = "Artistia ei löytynyt";
    return;
  }
  // Artisti löytyi – otsikoksi artisti ja sen albumit
  document.getElementById("otsikko").textContent = artisti + " – albumit";

  const albumit = data.topalbums.album;                       // albumilista talteen

  // Albumien läpikäynti yksi kerrallaan
  for (let i = 0; i < albumit.length; i++) {
    const albumi = albumit[i];
    const kuva = albumi.image[3]["#text"];                    // isoin kuva

    if (kuva === "") continue;                                // ohitetaan ilman kuvaa olevat

    // Luodaan albumikortti
    const kortti = document.createElement("div");
    kortti.className = "albumi";
    kortti.innerHTML = "<img src='" + kuva + "'>" +
                       "<h3>" + albumi.name + "</h3>" +
                       "<p>Kuuntelukertoja: " + albumi.playcount + "</p>";

    // Klikkaus näyttää albumin kappaleet
    kortti.addEventListener("click", function () {
      haeKappaleet(albumi.artist.name, albumi.name);
    });

    albumitDiv.appendChild(kortti);
  }
}

// Hakee yhden albumin tiedot (kappaleet)
function haeKappaleet(artisti, albumi) {
  const osoite = API_OSOITE + "?method=album.getinfo&artist=" + encodeURIComponent(artisti) +
                 "&album=" + encodeURIComponent(albumi) +
                 "&api_key=" + API_KEY + "&format=json";

  fetch(osoite)
    .then(function (vastaus) {
      return vastaus.json();
    })
    .then(function (data) {
      naytaKappaleet(data);
    });
}

// Näyttää kappalelistan
function naytaKappaleet(data) {
  const kappaleetDiv = document.getElementById("kappaleet");

  // Kaikilla albumeilla ei ole kappalelistaa
  let kappaleet = [];
  if (data.album && data.album.tracks) {
    kappaleet = data.album.tracks.track;
  }

  // Jos kappaleita ei löytynyt
  if (kappaleet.length === 0) {
    kappaleetDiv.innerHTML = "<p>Tälle albumille ei löytynyt kappaleita.</p>";
    return;
  }

  // Albumin kappalelistan rakennus
  let html = "<h2>" + data.album.name + "</h2><ol>";        // Albumin nimi, numerojärjestys
  for (let i = 0; i < kappaleet.length; i++) {
    html += "<li>" + kappaleet[i].name + "</li>";          // Kappale omalle riville
  }
  html += "</ol>";                                        // Lista loppuu

  kappaleetDiv.innerHTML = html;                          // Lista valmis, näytetään sivulla

}