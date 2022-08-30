import React, { useEffect, useState, useRef } from "react";
import {
  SkipBackwardFill,
  PlayFill,
  PauseFill,
  SkipForwardFill,
} from "react-bootstrap-icons"

const Player = () => {
  const [data, setData] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const nextSurah =[]
  // catch surah audio
  const surah = useRef();

  // catch surah text 
  const surahText = useRef();

  const allSurahs = useRef();
  
  useEffect(() => {
    const getSurah = async () => {
      const surah = await fetch("https://quran-endpoint.vercel.app/quran");
      setData(await surah.json());
    };
    getSurah();
  }, []);

  const next = async (next) => {
      if (Object.keys(data).length) {
        const filter = data.data.filter(
          (e) => e.recitation.full === surah.current.src
        );

        if (filter.length) {
          const getSurahhh = await fetch(
            `https://quran-endpoint.vercel.app/quran/${
              next ? filter[0].number + 1 : filter[0].number - 1
            }`
          );
          nextSurah = await getSurahhh.clone().json();

          if (Object.keys(nextSurah).length) {
            surahText.current.innerHTML = nextSurah.data.asma.ar.long;
            surah.current.src = nextSurah.data.recitation.full;
            surah.current.play();
            setIsPlaying(true)
          }
        }
      }
    };

  const playAndPause = () => {
    // check if surah is play or pause
    if (isPlaying) {
      surah.current.pause();
      setIsPlaying(!isPlaying);
    } else {
      surah.current.play();
      setIsPlaying(!isPlaying);
    }
  };
  const surahDetails = (event, e) => {
    surah.current.src = e.recitation.full;

    surah.current.play();
    setIsPlaying(true);

    surahText.current.innerHTML = e.asma.ar.long;

    [...allSurahs.current.children].map((e) => e.classList.remove("active"));
    event.target.classList.add("active");
  };


  return (
    <div className="container">
      <div className="quraan-player">
        <h1 className="player-info" ref={surahText}>
          .اضغط علي السوره للإستماع إليها <br />
          Click on the surah to listen to it.
        </h1>
        <div className="player">
          <audio src="" controls ref={surah}></audio>
          <div className="controls">
            <span onClick={() => next(false)}>
              <SkipBackwardFill />
            </span>

            <span onClick={playAndPause}>
              {isPlaying ? <PauseFill /> : <PlayFill />}
            </span>

            <span onClick={() => next(true)}>
              <SkipForwardFill />
            </span>
          </div>
        </div>
      </div>
      <div className="surah-info" ref={allSurahs}>
        {data.message === "success" ? (
          data.data.map((surah, i) => (
            <div
              className="surah"
              key={surah.number}
              onClick={(event) => surahDetails(event, surah)}
            >
              <span>{surah.asma.ar.short}</span>
              <br />
              <span>{surah.asma.en.short}</span>
            </div>
          ))
        ) : (
          <span className="loading">
            ...جاري التحميل <br />
            Loading...
          </span>
        )}
      </div>
    </div>
  );
};

export default Player;
