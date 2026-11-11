// Tämä funktio ajetaan Netlifyn palvelimella, ei selaimessa
export async function handler(event) {

  // Haetaan API-avain Netlifyn ympäristömuuttujista
  const API_KEY = process.env.LASTFM_API_KEY;

  // Luetaan script.js:n lähettämät hakutiedot (metodi, artisti, albumi)
  const tiedot = event.queryStringParameters;

  // Rakennetaan Last.fm-osoite
  let osoite = "https://ws.audioscrobbler.com/2.0/?method=" + tiedot.method +
               "&artist=" + encodeURIComponent(tiedot.artist) +
               "&api_key=" + API_KEY + "&format=json&limit=12";

  // Albumin nimi lisätään vain, jos sellainen on annettu
  if (tiedot.album) {
    osoite = osoite + "&album=" + encodeURIComponent(tiedot.album);
  }

  // Haetaan data Last.fm:stä ja palautetaan se selaimelle
  const vastaus = await fetch(osoite);
  const data = await vastaus.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
}