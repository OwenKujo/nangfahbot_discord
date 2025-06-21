const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

async function getAccessToken() {
  const data = await spotifyApi.clientCredentialsGrant();
  spotifyApi.setAccessToken(data.body['access_token']);
}

async function getTrackInfo(spotifyUrl) {
  await getAccessToken();
  const match = spotifyUrl.match(/track\/([a-zA-Z0-9]+)/);
  if (!match) return null;
  const trackId = match[1];
  const data = await spotifyApi.getTrack(trackId);
  console.log('Spotify search query:', `${data.body.name} ${data.body.artists[0].name}`);
  return `${data.body.name} ${data.body.artists[0].name}`;
}

module.exports = { getTrackInfo };
