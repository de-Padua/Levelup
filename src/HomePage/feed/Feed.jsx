import React from "react";
import { useEffect, useState, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import { TbHeartPlus } from "react-icons/tb";
import { GoThumbsup, GoThumbsdown } from "react-icons/go";
import { HiOutlineStar, HiStar } from "react-icons/hi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { VscAdd } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { GoX } from "react-icons/go";

import { GlobalContextF } from "./../../global-context/context.jsx";

export default function Feed() {
  const user = GlobalContextF();
  const { addPostToDB } = GlobalContextF();
  const { getFeed } = GlobalContextF();
  const { updateReactions } = GlobalContextF();
  const { getUserDBInfo } = GlobalContextF();
  const { addReviewsToUserProfile } = GlobalContextF();
  const { addJogosCompletos } = GlobalContextF();
  const { setInfo } = GlobalContextF();

  const [games, setGames] = useState([]);
  const [queryGame, setQueryGame] = useState("");
  const [feed, setFeed] = useState([]);

  const notify = () => {
    toast("Post criado com sucesso", {
      position: "top-right",
      autoClose: 10000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  const queryGameName = useRef();

  useEffect(() => {
    setGames([]);
    fetch(
      `https://api.rawg.io/api/games?search=${queryGame}&key=3c25c0a4c6ef4b98ae8a0af760f18217&page=1`
    )
      .then((data) => data.json())
      .then((game_data) => setGames(game_data.results));
    console.log(games);
  }, [queryGame]);

  ///
  const [status, setStatus] = useState("");
  const [selectedGame, setSelectedGame] = useState([]);
  const postComment = useRef();
  const createPostOBJ = () => {
    let post_id_order = feed.length + 1;

    const post_obj = {
      user: user.user.displayName,
      user_picture: user.user.photoURL,
      post_id: post_id_order,
      user_id: user.user.uid,
      data: date.toString(),
      status: status,
      postComment: postComment.current.value,
      selectedGame: selectedGame.name,
      selectedGame_banner: selectedGame.background_image,
      reactions: {
        heart_up: 1,
        heart_minus: 0,
        skull: 0,
        sleppy: 0,
      },
      reactions_ID: [],
      type: "status",
      recomendo: null,
    };

    getUserDBInfo()
      .then((data) => {
        let rev = data.data().rev;
        let new_arr = [...rev, post_obj];
        addReviewsToUserProfile(new_arr)
          .then((x) => {
            console.log(x);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
    addPostToDB(post_obj, post_id_order.toFixed()).then((response) => {
      notify();
    });
    getFeedf();
    setStatus("");
    setSelectedGame([]);
    postComment.current.value = "";
  };

  ///

  const date = new Date();

  // feed logic

  const getFeedf = async () => {
    getFeed().then((response) => {
      const data = response.docs.map((doc) => doc.data());
      setFeed(data);
    });
  };

  useEffect(() => {
    getFeedf();
  }, []);

  //reactions logic
  //todo
  const [reviews, setReviews] = useState([]);
  const [query, setquery] = useState("");
  const [byName, setByName] = useState([]);
  const [searchBar, setSearchBar] = useState([]);
  const { getReviews } = GlobalContextF();
  const navigate = useNavigate();
  const getReviewsF = async () => {
    getReviews().then((response) => {
      const data = response.docs.map((doc) => doc.data());
      setReviews(data);
    });
  };

  function getAllGamesWithTheName(name) {
    const found = reviews.filter((item) => {
      return item.selectedGame === name;
    });
    setSearchBar(found);
  }

  const game_name = useRef();

  const filterPerGame = () => {
    const found = reviews.map((rev) => {
      return rev.selectedGame.includes(game_name.current.value);
    });
    const foundItems = found.map((x, index) => {
      if (x === true) {
        return index;
      }
    });
    const finalItems = foundItems.map((x) => {
      return reviews[x];
    });
    const cleanFinalItems = finalItems.map((item) => {
      if (item === undefined) {
        const newFinal = finalItems.filter((item) => {
          return item !== undefined;
        });
        setSearchBar(newFinal);
      }
    });
    if (game_name.current.value === "") {
      setSearchBar([]);
    }
    setquery(game_name.current.value);
  };

  function filterPerName() {
    const uniques_game_names = [];

    const filtered_names = reviews.map((x) => {
      return x.selectedGame;
    });

    filtered_names.forEach((item) => {
      if (uniques_game_names.includes(item) === true) {
        return;
      } else {
        uniques_game_names.push(item);
        setByName(uniques_game_names);
      }
    });
  }
  function check_id() {
    if (localStorage.getItem("user_uid")) {
      navigate(`/homepage/Profile/${localStorage.getItem("user_uid")}`);
    }
  }
  useEffect(() => {
    getReviewsF();
  }, []);
  useEffect(() => {
    if (reviews.length > 0) {
      filterPerName();
    }
  }, [reviews]);

  return (
    <>
      <ToastContainer />
      <div className="container-feed-add-post">
        <div className="add-post-container">
          <div className="post-side-container">
            <div className="post-container">
              <div className="status">
                <ul>
                  <li
                    onClick={() => {
                      setStatus("Iniciou");
                    }}
                  >
                    Iniciei
                  </li>
                  <li
                    onClick={() => {
                      setStatus("Começou a jogar");
                    }}
                  >
                    Jogando
                  </li>
                  <li
                    onClick={() => {
                      setStatus("Está rejogando");
                    }}
                  >
                    Rejogando
                  </li>
                  <li
                    onClick={() => {
                      setStatus("Abandonou");
                    }}
                  >
                    Abandonei
                  </li>
                  <li
                    onClick={() => {
                      setStatus("Quer jogar");
                    }}
                  >
                    Quero jogar
                  </li>
                  <li
                    onClick={() => {
                      setStatus("Zerou");
                    }}
                  >
                    Zerei
                  </li>
                </ul>
              </div>
            </div>
            <div className="text-area-container">
              <textarea
                className="text-area"
                placeholder="O que está achando?"
                ref={postComment}
              />
            </div>
            <div>
              <div>
                <button
                  onClick={() => {
                    createPostOBJ();
                  }}
                  className="new-post-btn"
                >
                  Novo post
                </button>
              </div>
            </div>
          </div>
          <div className="game-side-container">
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
                    setSelectedGame([]);
                  }}
                />
              </div>
            </div>
            <div className="games-grid-post">
              {selectedGame.length === 0 ? (
                games.length > 0 ? (
                  games.map((item) => {
                    {
                      return (
                        <div
                          className="game-img-container"
                          onClick={() => {
                            setSelectedGame(item);
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
                )
              ) : (
                <div className="review-post-container">
                  <div className="head-selectedGame">
                    <h3>{selectedGame.name}</h3>
                    <p>{selectedGame.released}</p>
                    <div>
                      {selectedGame.genres.map((genres) => {
                        {
                          return <span className="genres">{genres.name} </span>;
                        }
                      })}
                    </div>
                  </div>
                  <div className="background-img background-reviews">
                    <img src={selectedGame.background_image} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="feed-container-main">
        <div className="feed-container">
          <div className="left-side-menu-review-div">
            <ul className="left-nav-bar">
              <li
                onClick={() => {
                  navigate("/homepage/addReview");
                }}
              >
                Adicionar review <VscAdd className="icon-tx" />
              </li>
            </ul>
            <div>
              <div className="input-container-search-game">
                <input
                  className="input-pesquise-jogo"
                  type="text"
                  placeholder="Filtar por jogo"
                  ref={game_name}
                  onChange={filterPerGame}
                />
              </div>
              <div>
                <h2 className="txt-title">Quick Review</h2>
                {byName.map((item) => {
                  return (
                    <p
                      className="item-game-name"
                      key={item}
                      onClick={() => {
                        getAllGamesWithTheName(item);
                      }}
                    >
                      {item}
                    </p>
                  );
                })}
                <p
                  className="item-game-name"
                  key={""}
                  onClick={() => {
                    getAllGamesWithTheName("");
                  }}
                >
                  Todos
                </p>
              </div>
            </div>
          </div>
          <div className="content-feed-container">
            {searchBar.length > 0
              ? searchBar
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
                              <p
                                onClick={() => {
                                  localStorage.setItem(
                                    "user_uid",
                                    item.user_id
                                  );
                                  check_id();
                                }}
                              >
                                {item.user}
                              </p>
                              <p className="data-item">{item.data}</p>
                            </div>
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
                                      {item.nota}{" "}
                                      <HiStar className="icon-star" />
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
                          <div className="reactions-div-container">
                            <div
                              className=" icon"
                              onClick={() => {
                                reationsLogic(item, "like");
                              }}
                            >
                              {" "}
                              <GoThumbsup />
                            </div>
                            <span>
                              <p className="likes-count">
                                {item.reactions.heart_up}
                              </p>
                            </span>
                            <div
                              className="icon"
                              onClick={() => {
                                reationsLogic(item, "dislike");
                              }}
                            >
                              {" "}
                              <GoThumbsdown />
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })
              : feed.length > 0
              ? feed
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
                              <p
                                onClick={() => {
                                  localStorage.setItem(
                                    "user_uid",
                                    item.user_id
                                  );
                                  check_id();
                                }}
                              >
                                {item.user}
                              </p>
                              <p className="data-item">{item.data}</p>
                            </div>
                            {item.user_id === user.user.uid ? (
                              <GoX
                                className="icon-search"
                                onClick={() => {
                                  setInfo(item.post_id);
                                  getFeedf();
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
                                      {item.nota}{" "}
                                      <HiStar className="icon-star" />
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
                  })
              : ""}
          </div>
        </div>
      </div>
    </>
  );
}
