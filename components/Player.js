import React, { useEffect, useState, useRef } from "react";
import {
  SkipBackwardFill,
  PlayFill,
  PauseFill,
  SkipForwardFill,
  Search,
  XLg,
} from "react-bootstrap-icons";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Loading from "./Loading";

const Player = () => {
  // main array contains on all data (surahs)
  const [data, setData] = useState([]);

  // Check if there is syrah playing now
  const [isPlaying, setIsPlaying] = useState(false);

  // Array contains on the surah user search on it
  const [surahFilterd, setSurahFilterd] = useState([]);

  // array include one item (next surah or preveoseSurah)
  const nextSurah = [];

  // catch surah audio
  const surah = useRef();

  // catch surah text
  const surahText = useRef();

  const allSurahs = useRef();

  const searchBoxBtn = useRef();

  const hideIconSearch = useRef();

  const xBtn = useRef();

  useEffect(() => {
    const getSurah = async () => {
      const surah = await fetch("https://quran-endpoint.vercel.app/quran");
      setData(await surah.json());
    };
    getSurah();
  }, []);
  const next = async (next) => {
    if (Object.keys(data).length) {
      console.log(Object.keys(data));
      const filter =
        data.data.filter((e) => e.recitation.full === surah.current.src) ||
        isSearching.filter((e) => e.recitation.full === surah.current.src);

      if (filter.length) {
        const getSurahhh = await fetch(
          `https://quran-endpoint.vercel.app/quran/${
            next ? filter[0].number + 1 : filter[0].number - 1
          }`
        );
        nextSurah = await getSurahhh.clone().json();
        console.log(Object.keys(nextSurah));
        if (Object.keys(nextSurah).length === 3) {
          surahText.current.innerHTML = nextSurah.data.asma.ar.long;
          surah.current.src = nextSurah.data.recitation.full;
          surah.current.play();
          setIsPlaying(true);
        }
      }
    }
  };
  const searchBox = () => {
    searchBoxBtn.current.classList.add("expend");
    searchBoxBtn.current.focus();
    hideIconSearch.current.classList.add("hideIconSearch");
    xBtn.current.classList.add("show");
    setSurahFilterd(data);
  };
  const closeSearchBox = () => {
    searchBoxBtn.current.classList.remove("expend");
    hideIconSearch.current.classList.remove("hideIconSearch");
    xBtn.current.classList.remove("show");
    searchBoxBtn.current.value = "";
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

  // main serach function
  const searchBySurah = (e) => {
    // update state (data) by text of input search
    setData({
      data: surahFilterd.data.filter(
        (surah) =>
          surah.asma.ar.short
            .toLowerCase()
            .includes(e.target.value.toLowerCase().trim()) ||
          surah.asma.ar.long
            .toLowerCase()
            .includes(e.target.value.toLowerCase().trim()) ||
          surah.asma.en.long
            .toLowerCase()
            .includes(e.target.value.toLowerCase().trim())
      ),
    });
  };
  return (
    <div className="container">
      <div className="quraan-player">
        <h1 className="player-info" ref={surahText}>
          .اضغط علي السوره للإستماع إليها <br />
          Click on the surah to listen to it.
        </h1>
        <div className="player">
          <audio controls ref={surah} src=""></audio>
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
      <span className="search">
        <XLg className="x-lg" ref={xBtn} onClick={closeSearchBox} />
        <Search
          className="iconSearch"
          ref={hideIconSearch}
          onClick={searchBox}
        />
        <input
          type="text"
          placeholder="Surah Name.."
          ref={searchBoxBtn}
          onChange={(e) => searchBySurah(e)}
        />
      </span>
      <div className="surah-info" ref={allSurahs}>
        {data.data ? (
          data.data.map((surah) => (
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
          <Loading />
        )}
      </div>
    </div>
  );
};

export default Player;
