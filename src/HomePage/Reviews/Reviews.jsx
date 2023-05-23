import React, { useState, useRef, useEffect } from "react";
import { GlobalContextF } from "./../../global-context/context.jsx";
import "react-toastify/dist/ReactToastify.css";
import { GoThumbsup, GoThumbsdown } from "react-icons/go";
import { HiStar } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { VscAdd } from "react-icons/vsc";
import { TfiThumbUp, TfiThumbDown } from "react-icons/tfi";
import { GoX } from "react-icons/go";

export default function Reviews() {
  const user = GlobalContextF();
  const { setInfo } = GlobalContextF();
  const [active, setActive] = useState(false);
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

  //get starts
  const [oneStar, setOneStar] = useState(0);
  const [twoStar, setTwoStar] = useState(0);
  const [threeStar, setThreeStar] = useState(0);
  const [fourStar, setFourStar] = useState(0);
  const [fiveStar, setFiveStar] = useState(0);
  const [starsLenght, setStarsLenght] = useState(0);

  const [positive, setPositive] = useState(0);
  const [negative, setNegative] = useState(0);

  function getPorcentage() {
    const found = reviews.filter((x) => {
      return x.selectedGame === query;
    });

    const percent = found.map((x) => {
      return x.recomendo;
    });

    const arr_posi = [];
    const arr_neg = [];

    percent.map((i) => {
      if (i === true) {
        arr_posi.push(i);
      }
      if (i === false) {
        arr_neg.push(i);
      }

      const result_posi = (arr_posi.length / percent.length) * 100;
      const result_nega = (arr_neg.length / percent.length) * 100;

      if (result_nega > result_posi) {
        setNegative(Math.floor(result_nega));
      }
      if (result_nega === result_posi) {
        console.log("Avaliações neutras 50% aprovado e 50% reprovaram");
      } else {
        setPositive(Math.floor(result_posi));
      }
    });
  }

  function getStarts() {
    const found = reviews.filter((x) => {
      return x.selectedGame === query;
    });

    let a5 = 0;
    let a4 = 0;
    let a3 = 0;
    let a2 = 0;
    let a1 = 0;

    const stars = found.map((star) => {
      if (star.nota === 5) {
        a5 = a5 + 1;
        setFiveStar(a5);
      }
      if (star.nota === 4) {
        a4 = a4 + 1;
        setFourStar(a4);
      }
      if (star.nota === 3) {
        a3 = a3 + 1;
        setThreeStar(a3);
      }
      if (star.nota === 2) {
        a2 = a2 + 1;
        setTwoStar(a2);
      }
      if (star.nota === 1) {
        a1 = a1 + 1;
        setOneStar(a1);
      }
    });

    setStarsLenght(found.length);
  }

  /// filtering per name

  function getAllGamesWithTheName(name) {
    const found = reviews.filter((item) => {
      return item.selectedGame === name;
    });
    setFiveStar(0);
    setOneStar(0);
    setFourStar(0);
    setThreeStar(0);
    setTwoStar(0);
    setSearchBar(found);
    setquery(name);
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

  useEffect(() => {
    getReviewsF();
  }, []);
  useEffect(() => {
    if (reviews.length > 0) {
      filterPerName();
    }
  }, [reviews]);
  useEffect(() => {
    if (reviews.length > 0) {
      getStarts();
      getPorcentage();
    }
  }, [query]);

  return (
    <>
      <div className="home-container-review-div">
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
            <div className="input-container-search-game"></div>
            {active ? (
              <div>
                <h2 className="txt-title">Reviews disponíveis</h2>
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
              </div>
            ) : (
              ""
            )}
          </div>
          <p
            className="item-game-name"
            key={""}
            onClick={() => {
              setActive(false);

              getAllGamesWithTheName("");
            }}
          >
            Todos
          </p>
        </div>

        <div className="content-feed-container hided-2">
          <div className="Title-bar-reviews">
            {searchBar.length > 0 ? (
              <h2>{query}</h2>
            ) : (
              <h2>Todos os reviews</h2>
            )}
          </div>{" "}
          {searchBar.length > 0 ? (
            <div className="porcetagem-container">
              <div className="container-porcentagem-half">
                <div className="tst-1">
                  <div className="star-container star-container-1">
                    <div className="start-container-side">
                      <HiStar style={{ color: "rgb(206, 193, 78)" }} />
                      <HiStar style={{ color: "rgb(206, 193, 78)" }} />
                      <HiStar style={{ color: "rgb(206, 193, 78)" }} />
                      <HiStar style={{ color: "rgb(206, 193, 78)" }} />
                      <HiStar style={{ color: "rgb(206, 193, 78)" }} />
                      <p>({fiveStar})</p>
                    </div>
                    <progress
                      id="file"
                      value={fiveStar}
                      max={starsLenght}
                    ></progress>
                  </div>
                  <div className="star-container star-container-2">
                    <div className="start-container-side">
                      <HiStar style={{ color: "rgb(206, 166, 78)" }} />
                      <HiStar style={{ color: "rgb(206, 166, 78)" }} />
                      <HiStar style={{ color: "rgb(206, 166, 78)" }} />
                      <HiStar style={{ color: "rgb(206, 166, 78)" }} />
                      <p>({fourStar})</p>
                    </div>
                    <progress
                      id="file"
                      value={fourStar}
                      max={starsLenght}
                    ></progress>
                  </div>
                  <div className="star-container star-container-3 ">
                    <div className="star-container start-container-side">
                      <HiStar style={{ color: "rgb(206, 146, 78)" }} />
                      <HiStar style={{ color: "rgb(206, 146, 78)" }} />
                      <HiStar style={{ color: "rgb(206, 146, 78)" }} />
                      <p>({threeStar})</p>
                    </div>
                    <progress
                      id="file"
                      value={threeStar}
                      max={starsLenght}
                    ></progress>
                  </div>
                  <div className="star-container star-container-4">
                    <div className="start-container-side">
                      <HiStar style={{ color: "rgb(206, 114, 78)" }} />
                      <HiStar style={{ color: "rgb(206, 114, 78)" }} />
                      <p>({twoStar})</p>
                    </div>
                    <progress
                      id="file"
                      value={twoStar}
                      max={starsLenght}
                    ></progress>
                  </div>
                  <div className="star-container star-container-5">
                    <div className="start-container-side">
                      <HiStar style={{ color: "rgb(206, 78, 78)" }} />
                      <p>({oneStar})</p>
                    </div>
                    <progress
                      id="file"
                      value={oneStar}
                      max={starsLenght}
                    ></progress>
                  </div>
                  <div></div>
                </div>
              </div>
              <div className="container-porcentagem-half green-joinha">
                {positive > negative ? (
                  <div className="positiva">
                    <h2>Avaliações positivas</h2>
                    <h4>{positive}% dos usuários recomendam</h4>
                    <TfiThumbUp className="icon-aprovado" />
                  </div>
                ) : (
                  <div className="negativa">
                    <h2>Avaliações negativas</h2>

                    <h4>{negative}% dos usuários não recomendam</h4>
                    <TfiThumbDown className="icon-negativo" />
                  </div>
                )}
              </div>
            </div>
          ) : (
            ""
          )}
          {searchBar.length > 0 ? (
            searchBar
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
                              setInfo(item.post_id);
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
                              <p>{item.type === "status" ? item.status : ""}</p>

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
          ) : reviews.length > 0 ? (
            <div className="home-div-container-reviews">
              {byName.map((item) => {
                return (
                  <p
                    className=" item-game-name"
                    key={item}
                    onClick={() => {
                      getAllGamesWithTheName(item);
                      setActive(true);
                    }}
                  >
                    {item}
                  </p>
                );
              })}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}
