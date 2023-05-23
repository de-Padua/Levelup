import React, { useState, useEffect, useRef } from "react";
import { GlobalContextF } from "../../global-context/context";
import { useNavigate } from "react-router-dom";
import { GoX } from "react-icons/go";
import { CiEdit } from "react-icons/ci";
import { AiOutlineMail, AiOutlineUnlock } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import { HiStar } from "react-icons/hi";

export default function DisplayAllCompleteGames() {
  //complete games
  const user = GlobalContextF();
  const [queryGame, setQueryGame] = useState("");
  const [selectedGameModal, setSelectedGameModal] = useState(false);
  const queryGameName = useRef();
  const { getUserDBInfo_NotCurrentIser } = GlobalContextF();
  const { addReviewsToUserProfile_correct } = GlobalContextF();

  const { setInfo } = GlobalContextF();
  const { getUserDBInfo } = GlobalContextF();
  const { addReviewsToUserProfile } = GlobalContextF();
  const [games, setGames] = useState([]);
  const [reload, setReload] = useState(false);
  const [resp, setResp] = useState(null);
  const navigate = useNavigate();
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
    setInfo(data);
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
      <div className="container-all-coletion-general-2">
        <div className="title-container">
          <h2>Minha reviews</h2>
          {anotherUserProfile ? (
            ""
          ) : (
            <div
              className="exp-3"
              onClick={() => {
                navigate("/homepage/Reviews");
              }}
            >
              <div className="add-game-div-img hero-background-img-2">
                <img
                  src={
                    "https://media.gq.com/photos/63a380b0411aeb5ccda200c1/4:3/w_1500,h_1125,c_limit/gamesnew.jpg"
                  }
                />
              </div>

              <div className="game-name-preview-perfil">
                <h1>Adicionar nova review</h1>
              </div>
            </div>
          )}
        </div>
        <div className="c-contianer-w-40 content-feed-container">
          {resp === null
            ? ""
            : resp[0].reviews
                .slice(0)
                .reverse()
                .map((item) => {
                  {
                    return (
                      <div className="feed-item">
                        <div className="top-div">
                          <div className="avatar-feed-item">
                            <img src={item.user_picture} />
                          </div>
                          <div className="name-user-feed-item">
                            <p>{item.user}</p>
                            <p className="data-item">{item.data}</p>
                          </div>
                          {item.user_id === user.user.uid ? (
                            <GoX
                              className="icon-search"
                              onClick={() => {
                                addtoDB_RequestedGames(item.post_id);
                              }}
                            />
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="mid-div">
                          <div className="outer-div">
                            <div className="game-mid-div">
                              <div className="nota-container">
                                {item.type === "review" ? (
                                  <div
                                    className="nota"
                                    style={{ marginBottom: "-4em" }}
                                  >
                                    {item.nota} <HiStar className="icon-star" />
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                              <div className="top-game-div">
                                <p className="">
                                  {item.type === "status"
                                    ? ""
                                    : "Adicionou nova review de "}
                                </p>
                                <p>
                                  {item.type === "status" ? item.status : ""}
                                </p>

                                <span>{item.selectedGame}</span>
                              </div>
                              <div>
                                <span className="coment-post">
                                  <h2>
                                    {item.type === "status" ? "" : "Review"}
                                  </h2>
                                  {item.type === "status"
                                    ? item.postComment
                                    : item.review_text}
                                </span>
                                <h2
                                  className="coment"
                                  style={
                                    item.recomendo === false
                                      ? { color: "red" }
                                      : { color: "green" }
                                  }
                                >
                                  {item.type === "status"
                                    ? ""
                                    : item.recomendo === true
                                    ? "Recomendo"
                                    : "Não recomendo"}
                                </h2>
                              </div>
                              <div className="game-area-design">
                                <div>
                                  {item.type === "review" ? (
                                    ""
                                  ) : (
                                    <img src={item.selectedGame_banner} />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>{" "}
                      </div>
                    );
                  }
                })}
        </div>
      </div>
    </>
  );
}
