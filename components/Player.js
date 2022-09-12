import React, { useEffect, useState, useRef } from "react";
import {
  SkipBackwardFill,
  PlayFill,
  PauseFill,
  SkipForwardFill,
  Search,
  XLg,
} from "react-bootstrap-icons";
import Loading from "./Loading";

const Player = () => {
  // main array contains on all data (surahs)
  const [data, setData] = useState([]);

  // Check if there is syrah playing now
  const [isPlaying, setIsPlaying] = useState(false);

  // Array contains temp data to return it later (when user search of surah)
  const [tempData, setTempData] = useState([]);

  const [showSearch, setShowSearch] = useState(false);

  // array include one item (next surah or preveoseSurah)
  const nextSurah = [];

  // const theTempData = useRef();

  // catch surah audio
  const surahAudio = useRef();

  // catch surah text of Header
  const surahTextHeader = useRef();

  const allSurahs = useRef();

  const searchBoxBtn = useRef();

  const iconSearch = useRef();

  const searchContainer = useRef();

  const xBtn = useRef();

  useEffect(() => {
    const getSurah = async () => {
      const data = await fetch("https://quran-endpoint.vercel.app/quran");
      const tempData = await fetch("https://quran-endpoint.vercel.app/quran");
      if (!data.length) {
        setData(await data.json());
        setShowSearch(true);
      }
      if (!tempData.length) {
        setTempData(await tempData.json());
        
      }
      //update value (true) when page render and fetch data,  to show serach button
    };
    getSurah();
  }, []);
  const nextOrPrevSurah = async (nextOrPrevSurah) => {
    if (data.data || tempData.data) {
      const filter = tempData.data.filter(
        (e) => e.recitation.full === surahAudio.current.src
      );
      console.log(filter)
      if (filter.length) {
        const surahFilterd = await fetch(
          `https://quran-endpoint.vercel.app/quran/${
            nextOrPrevSurah ? filter[0].number + 1 : filter[0].number - 1
          }`
        );
        nextSurah = await surahFilterd.clone().json();
        if (nextSurah.message !== "error") {
          surahTextHeader.current.innerHTML = nextSurah.data.asma.ar.long;
          surahAudio.current.src = nextSurah.data.recitation.full;
          surahAudio.current.play();
          setIsPlaying(true);
        }
      }
    }
  };
  const searchBox = () => {
    searchBoxBtn.current.classList.add("expend");
    searchBoxBtn.current.focus();
    iconSearch.current.classList.add("hideIconSearch");
    xBtn.current.classList.add("show");
    searchContainer.current.classList.add("search-expend");
    setTempData(data);
    // theTempData.current = data.data;
  };
  const closeSearchBox = () => {
    searchBoxBtn.current.classList.remove("expend");
    iconSearch.current.classList.remove("hideIconSearch");
    xBtn.current.classList.remove("show");
    searchBoxBtn.current.value = "";
    searchContainer.current.classList.remove("search-expend");
    returnTempData();
  };
  const playAndPause = () => {
    // check if surah is play or pause
    if (isPlaying) {
      surahAudio.current.pause();
      setIsPlaying(!isPlaying);
    } else {
      surahAudio.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const surahDetails = (event, e) => {
    surahAudio.current.src = e.recitation.full;
    surahAudio.current.play();
    setIsPlaying(true);
    surahTextHeader.current.innerHTML = e.asma.ar.long;
    [...allSurahs.current.children].map((e) => e.classList.remove("active"));
    event.target.classList.add("active");
  };

  // keep all data in temp value when user search for surah
  const returnTempData = () => {
    if (
      searchBoxBtn.current.value === "" ||
      searchBoxBtn.current.value === null
    ) {
      setData({ data: tempData.data });
    }
  };
  // main serach function
  const searchBySurah = (e) => {
    // update state (data) by text of input search
    setData({
      data: tempData.data.filter(
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
    returnTempData();
  };
  return (
    <div className="container">
      <div className="quraan-player">
        <h1 className="player-info" ref={surahTextHeader}>
          .اضغط علي السوره للإستماع إليها <br />
          Click on the surah to listen to it.
        </h1>
        <div className="player">
          <audio controls ref={surahAudio} src=""></audio>
          <div className="controls">
            <span onClick={() => nextOrPrevSurah(false)}>
              <SkipBackwardFill />
            </span>
            <span onClick={playAndPause}>
              {isPlaying ? <PauseFill /> : <PlayFill className="play" />}
            </span>
            <span onClick={() => nextOrPrevSurah(true)}>
              <SkipForwardFill />
            </span>
          </div>
        </div>
      </div>
      {showSearch ? (
        <span className="search" ref={searchContainer}>
          <XLg className="x-lg" ref={xBtn} onClick={closeSearchBox} />
          <Search className="iconSearch" ref={iconSearch} onClick={searchBox} />
          <input
            type="text"
            placeholder="Surah Name.."
            ref={searchBoxBtn}
            onChange={(e) => searchBySurah(e)}
          />
        </span>
      ) : (
        ""
      )}
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
              <span className="surah-number">{surah.number}</span>
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
