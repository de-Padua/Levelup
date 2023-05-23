import React, { useState, useEffect, useRef } from "react";
import { GlobalContextF } from "../../global-context/context";
import { useNavigate } from "react-router-dom";
import { GoX } from "react-icons/go";
import { CiEdit } from "react-icons/ci";
import { AiOutlineMail, AiOutlineUnlock } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";

export default function DisplayAllCompleteGames() {
  //complete games
  const user = GlobalContextF();
  const [queryGame, setQueryGame] = useState("");
  const [selectedGameModal, setSelectedGameModal] = useState(false);
  const queryGameName = useRef();
  const { addJogosCompletos } = GlobalContextF();
  const { getUserDBInfo } = GlobalContextF();
  const { getUserDBInfo_NotCurrentIser } = GlobalContextF();
  const [games, setGames] = useState([]);
  const [reload, setReload] = useState(false);
  const [resp, setResp] = useState(null);
  const [anotherUserProfile, setAnotherUserProfile] = useState(false);

  function getUserInfo() {
    const PAGE_URL = window.location.pathname;
    //check if url has user id
    const checker = PAGE_URL.includes(user.user.uid);
    // if checker is true,the

    if (checker) {
      getUserDBInfo()
        .then((result) => {
          const rs = result.data();
          setResp([rs]);
          setReload(false);
          setAnotherUserProfile(false);
        })
        .catch((err) => {
          setReload(true);
        });
    } else {
      getUserDBInfo_NotCurrentIser(localStorage.getItem("user_uid"))
        .then((result) => {
          const rs = result.data();
          setResp([rs]);
          setReload(false);
          setAnotherUserProfile(true);
        })
        .catch((err) => {
          setReload(true);
        });
    }
  }

  useEffect(() => {
    if (resp === null) {
      getUserInfo();
    }
  }, [reload]);

  function addtoDB_RequestedGames(data) {
    addCompGames(data);
  }

  function addCompGames(data) {
    let complete = resp[0].completos;
    const found = complete.find((x) => {
      return x.name === data.name;
    });
    if (found) {
      return;
    } else {
      let newarr = [...complete, data];
      addJogosCompletos(newarr).then(() => {});
    }
    setSelectedGameModal(false);
    getUserInfo();
  }

  function deleteGameFromColetion(data) {
    let complete = resp[0].completos;
    const found = complete.find((x) => {
      return x.name === data.name;
    });
    if (found) {
      const found = complete.filter((x) => {
        return x.name !== data.name;
      });

      addJogosCompletos(found);
      getUserDBInfo();
    } else {
      return;
    }
    setSelectedGameModal(false);
    getUserInfo();
  }

  useEffect(() => {
    setGames([]);
    fetch(
      `https://api.rawg.io/api/games?search=${queryGame}&key=3c25c0a4c6ef4b98ae8a0af760f18217&page=1`
    )
      .then((data) => data.json())
      .then((game_data) => setGames(game_data.results));
  }, [queryGame]);
  return (
    <>
      {selectedGameModal ? (
        <div className="modal-select-game">
          <div className="test-game-side-profile game-side-container">
            <div className="input-container-search-game">
              <input
                className="input-pesquise-jogo"
                type="text"
                placeholder="Pesquise um jogo"
                ref={queryGameName}
              />
              <div>
                <FiSearch
                  className="icon-search"
                  onClick={() => {
                    setQueryGame(queryGameName.current.value);
                  }}
                />
              </div>
              <div>
                <GoX
                  className="icon-search"
                  onClick={() => {
                    setSelectedGameModal(false);
                  }}
                />
              </div>
            </div>
            <div className="games-grid-post">
              {games.length > 0 ? (
                games.map((item) => {
                  {
                    return (
                      <div
                        className="game-img-container"
                        onClick={() => {
                          addtoDB_RequestedGames(item);
                          setSelectedGameModal(false);
                        }}
                      >
                        <img src={item.background_image} />
                        <span className="game-title-post">{item.name}</span>
                      </div>
                    );
                  }
                })
              ) : (
                <>
                  <div className="game-img-container skeleton"></div>
                  <div className="game-img-container skeleton"></div>
                  <div className="game-img-container skeleton"></div>
                  <div className="game-img-container skeleton"></div>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      <div className="container-all-coletion-general">
        <div className="title-container">
          <h2>Jogos Completos</h2>
        </div>
        <div className="container-all-coletion">
          {anotherUserProfile ? (
            ""
          ) : (
            <div
              className="exp-2"
              onClick={() => {
                setSelectedGameModal(true);
              }}
            >
              {anotherUserProfile ? (
                ""
              ) : (
                <GoX
                  className="custom-3 icon-search"
                  onClick={() => {
                    deleteGameFromColetion(fav);
                  }}
                />
              )}
              <div className="add-game-div-img hero-background-img-2">
                <img
                  src={
                    "https://media.gq.com/photos/63a380b0411aeb5ccda200c1/4:3/w_1500,h_1125,c_limit/gamesnew.jpg"
                  }
                />
              </div>

              <div className="game-name-preview-perfil">
                <h1>Adicionar novo jogo</h1>
              </div>
            </div>
          )}
          {resp === null
            ? ""
            : resp[0].completos
                .slice()
                .reverse()
                .map((fav) => {
                  return (
                    <div key={fav.name} className="exp-2 ">
                      {anotherUserProfile ? (
                        ""
                      ) : (
                        <GoX
                          className="custom-2 icon-search"
                          onClick={() => {
                            deleteGameFromColetion(fav);
                          }}
                        />
                      )}
                      <div className="hero-background-img-2">
                        <img src={fav.background_image} />
                      </div>

                      <div className="txt-2-3 game-name-preview-perfil">
                        <h2>{fav.name}</h2>
                      </div>
                    </div>
                  );
                })}
        </div>
      </div>
    </>
  );
}
