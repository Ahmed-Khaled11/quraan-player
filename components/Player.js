import React, { useEffect, useState, useRef, memo } from "react";
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

  // array include one item (next surah or preveoseSurah)
  const nextSurah = [];

  // catch surah audio
  const surahAudio = useRef();

  // catch surah text of Header
  const surahTitle = useRef();

  const allSurahs = useRef();

  const searchBoxBtn = useRef();

  const iconSearch = useRef();

  const searchContainer = useRef();

  const xBtn = useRef();
  useEffect(() => {
    const getData = async () => {
      const data = await fetch("https://quran-endpoint.vercel.app/quran");
      const tempData = await fetch("https://quran-endpoint.vercel.app/quran");
      if (!data.length) {
        setData(await data.json());
      }
      if (!tempData.length) {
        setTempData(await tempData.json());
      }
    };
    getData();
  }, []);
  const nextOrPrevSurah = async (nextOrPrevSurah) => {
    if (data.data || tempData.data) {
      const filter = tempData.data.filter(
        (e) => e.recitation.full === surahAudio.current.src
      );
      if (filter.length) {
        const surahFilterd = await fetch(
          `https://quran-endpoint.vercel.app/quran/${
            nextOrPrevSurah ? filter[0].number + 1 : filter[0].number - 1
          }`
        );
        nextSurah = await surahFilterd.clone().json();
        // remove class active from all surahs
        [...allSurahs.current.children].map((e) =>
          e.classList.remove("active")
        );
        // add class active to next surah 
        if (nextSurah.data && [...allSurahs.current.children].length === 114) {
          allSurahs.current.children[nextSurah.data.number - 1].classList.add(
            "active"
          );
        }
        if (nextSurah.message !== "error") {
          surahTitle.current.innerHTML = nextSurah.data.asma.ar.long;
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
    // add src audio and play the surah
    surahAudio.current.src = e.recitation.full;
    surahAudio.current.play();
    setIsPlaying(true);
    surahTitle.current.innerHTML = e.asma.ar.long;
    // remove class active from all surahs
    [...allSurahs.current.children].map((e) => e.classList.remove("active"));
    // add class active to surah user clicked on it
    event.target.classList.add("active");
  };

  //keep original data in temp value to re use it
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
  };
  return (
    <div className="container">
      <div className="quraan-player">
        <h1 className="player-info" ref={surahTitle}>
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
      {Object.keys(data).length > 0 ? (
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

export default memo(Player);
