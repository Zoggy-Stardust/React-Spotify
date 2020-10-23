import React, {useEffect, useState} from 'react';
import Playlist from "./components/Playlist";
import Tuner from "./components/Tuner";

function Build(props) {
  const [activeTrack, setTrack] = useState('');
  const [activeIndex, setIndex] = useState(0);
  const [tunings, setTunings] = useState({market: 'from_token'});

  useEffect(() => {
    const parameters = "limit=40";
    const tracksURL = `https://api.spotify.com/v1/me/top/tracks?${parameters}`;
    const getTrack = async () => {
      const res = await fetch(tracksURL, {
        headers: {
          Authorization: `Bearer ${props.accessToken}`
        },
      });
      const json = await res.json();
      setTrack(json.items[activeIndex]);
    };
    getTrack();
  }, [activeIndex, props.accessToken]);

  const nextTrack = () => {
    setIndex(prevIndex => prevIndex + 1);
  };

  const addToPlaylist = () => {
    props.setPlaylist([activeTrack, ...props.playlist]);
    props.playlist.length == 0 ? setTunings({ ...tunings, 'seed_tracks': activeTrack.id, 'seed_artists':activeTrack.artists[0].id }) : '';
  };

  const getRecommendations = async () => {
    const tuningsEntries = Object.entries(tunings);
    const queryParams = tuningsEntries.join("&").replace(/,/g, '=');
    const recommendationsURL = `https://api.spotify.com/v1/recommendations?${queryParams}`;
    const res = await fetch(recommendationsURL, {
      headers: {
        Authorization: `Bearer ${props.accessToken}`
      },
    });
    const json = await res.json();
    let index = 0;
    props.playlist.indexOf(json.tracks[index]) !== -1 ? index + 1 : '';
    setTrack(json.tracks[index]);
  };

  return (
    <>
      <p>Builder</p>
      {(activeTrack)
        ? <>
          <p>{activeTrack.name}</p>
          <p>{activeTrack.artists[0].name}</p>
          <audio controls>
            <source src={activeTrack.preview_url} type="audio/ogg" />
          </audio>

          <button onClick={() => nextTrack()}>Next Track</button>
          <button onClick={() => addToPlaylist()}>Add to playlist</button>
          <Playlist playlist={props.playlist} />
          {props.playlist.length > 0 ?
            <>
              <Tuner setTunings={setTunings} tunings={tunings}/>
              <button onClick={() => getRecommendations()}>Get Recs</button>
            </>
            : '' }
        </>
        : ''}
    </>
  );
}
export default Build;