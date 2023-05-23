import React, { useState, useRef, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { TbHeartPlus } from "react-icons/tb";
import { GoThumbsup, GoThumbsdown } from "react-icons/go";
import { HiOutlineStar, HiStar } from "react-icons/hi";
import { GlobalContextF } from "./../../global-context/context.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function ReviewsPage() {
  const navigate = useNavigate();
  const user = GlobalContextF();
  const { getUserDBInfo } = GlobalContextF();
  const { getFeed } = GlobalContextF();
  const [games, setGames] = useState([]);
  const [queryGame, setQueryGame] = useState("");
  const [feed, setFeed] = useState([]);
  const postComment = useRef();
  const queryGameName = useRef();
  const { addPostToDB } = GlobalContextF();
  const { getReviews } = GlobalContextF();
  const { addToReviews } = GlobalContextF();
  const { addReviewsToUserProfile } = GlobalContextF();
  const { addReviewsToUserProfile_correct } = GlobalContextF();
  const { deleteDocFromFeed } = GlobalContextF();
  const { deleteDocFromReviews } = GlobalContextF();
  const { addJogosFavoritos } = GlobalContextF();

  const notify = () => {
    toast("Review criada com sucesso", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };
  useEffect(() => {
    setGames([]);
    fetch(
      `https://api.rawg.io/api/games?search=${queryGame}&key=3c25c0a4c6ef4b98ae8a0af760f18217&page=1`
    )
      .then((data) => data.json())
      .then((game_data) => setGames(game_data.results));
    console.log(games);
  }, [queryGame]);

  ////////////////////////////////]
  const [modal_f, setModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState("");
  const [recomendo, setRecomendo] = useState(false);
  const [favorito, setFavorito] = useState(false);

  const [nota, setNota] = useState(0);
  const [exportedObj, setExportedObj] = useState({});
  const [post_found, setIdObjFound] = useState(null);
  const review_text = useRef();
  const date = new Date();

  function addReview() {
    let post_id_order = feed.length + 1;

    const review_obj = {
      user: user.user.displayName,
      post_id: post_id_order,
      user_id: user.user.uid,
      user_picture: user.user.photoURL,
      data: date.toString(),
      nota: nota,
      review_text: review_text.current.value,
      selectedGame: selectedGame.name,
      selectedGame_img: selectedGame.background_image,
      reactions: {
        heart_up: 1,
        heart_minus: 0,
        skull: 0,
        sleppy: 0,
      },
      reactions_ID: [],
      type: "review",
      recomendo: recomendo,
      favorito: favorito,
    };
    getUserDBInfo()
      .then((data) => {
        let rev = data.data().rev;
        let new_arr = [...rev, review_obj];

        let previews_reviews = data.data().reviews;
        let new_arr_reviews = [...previews_reviews, review_obj];

        const found = previews_reviews.find((x) => {
          return x.selectedGame === selectedGame.name;
        });

        //favorites array to update the favorites list on

        if (found) {
          setModal(true);
          setExportedObj(review_obj);
          setIdObjFound(found.post_id);
        } else {
          addPostToDB(review_obj, post_id_order.toFixed());
          addToReviews(review_obj, post_id_order.toFixed()).then(() => {
            notify();
            navigate("/homepage/reviews");
          });
          addReviewsToUserProfile_correct(new_arr_reviews);
          addReviewsToUserProfile(new_arr)
            .then(() => {})
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const filterArrayWithPreviewReview = () => {
    getUserDBInfo()
      .then((data) => {
        //feed db
        let rev = data.data().rev;
        const filtered_rev = rev.filter((x) => {
          return x.selectedGame !== exportedObj.selectedGame;
        });
        let new_arr_rev = [...filtered_rev, exportedObj];

        addReviewsToUserProfile(new_arr_rev);

        //reviews  db
        let previews_reviews = data.data().reviews;
        const filteredReviews = previews_reviews.filter((x) => {
          return x.selectedGame !== exportedObj.selectedGame;
        });
        let new_arr_reviews = [...filteredReviews, exportedObj];

        //add to user profile db
        addReviewsToUserProfile_correct(new_arr_reviews)
          .then(() => {})
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
    setIdObjFound(null);
    navigate("/homepage/Reviews");
  };

  const updatePostsAndFeed = () => {
    if (post_found !== null) {
      deleteDocFromFeed(post_found.toFixed()).then(() => {
        deleteDocFromReviews(post_found.toFixed()).then(() => {
          filterArrayWithPreviewReview();
          addPostToDB(exportedObj, post_found.toFixed());
          addToReviews(exportedObj, post_found.toFixed());
        });
      });
    }
  };

  const getFeedf = async () => {
    getFeed().then((response) => {
      const data = response.docs.map((doc) => doc.data());
      setFeed(data);
    });
  };

  /////

  const [reviews, setReviews] = useState([]);

  const getReviewsF = async () => {
    getReviews().then((response) => {
      const data = response.docs.map((doc) => doc.data());
      setReviews(data);
    });
  };

  useEffect(() => {
    getFeedf();
    getReviewsF();
  }, []);

  return (
    <>
      <ToastContainer />
      {modal_f ? (
        <div className="modal-ja-fez-review">
          <div className="modal-dialog">
            <h2>
              Você já fez uma review anterior desse jogo,gostaria de
              substituí-la ?
            </h2>
            <button
              className="yes-button"
              onClick={() => {
                updatePostsAndFeed();
                setModal(false);
              }}
            >
              Sim
            </button>
            <button
              className="no-button"
              onClick={() => {
                setModal(false);
              }}
            >
              Não
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="container-feed-add-post hided">
        <div className="add-post-container-review ">
          <div className="post-side-container review-post-side">
            <div className="status" style={{ height: "auto" }}>
              <h2>Nota</h2>
              <ul>
                <li
                  style={
                    nota >= 1
                      ? { backgroundColor: "rgb(206, 78, 78)" }
                      : { backgroundColor: "transparent" }
                  }
                  onClick={() => {
                    setNota(1);
                  }}
                >
                  <HiOutlineStar className="star-icon" />
                </li>
                <li
                  style={
                    nota >= 2
                      ? { backgroundColor: "rgb(206, 114, 78)" }
                      : { backgroundColor: "transparent" }
                  }
                  onClick={() => {
                    setNota(2);
                  }}
                >
                  <HiOutlineStar className="star-icon" />
                </li>
                <li
                  style={
                    nota >= 3
                      ? { backgroundColor: "rgb(206, 146, 78)" }
                      : { backgroundColor: "transparent" }
                  }
                  onClick={() => {
                    setNota(3);
                  }}
                >
                  <HiOutlineStar className="star-icon" />
                </li>
                <li
                  style={
                    nota >= 4
                      ? { backgroundColor: "rgb(206, 166, 78)" }
                      : { backgroundColor: "transparent" }
                  }
                  onClick={() => {
                    setNota(4);
                  }}
                >
                  <HiOutlineStar className="star-icon" />
                </li>

                <li
                  style={
                    nota >= 5
                      ? { backgroundColor: "rgb(206, 193, 78)" }
                      : { backgroundColor: "transparent" }
                  }
                  onClick={() => {
                    setNota(5);
                  }}
                >
                  <HiOutlineStar className="star-icon" />
                </li>
              </ul>
            </div>
            <div className="text-area-container">
              <h2>Review</h2>
              <textarea
                className="text-area"
                placeholder="Escreva a sua review aqui"
                ref={review_text}
              />
            </div>
            <div className="checkbox-container text-area-container review-area-container">
              <div className="checkbox-wrapper-1">
                <input
                  id="example-1"
                  className="substituted"
                  type="checkbox"
                  aria-hidden="true"
                  onClick={() => {
                    setRecomendo(!recomendo);
                  }}
                />
                <label htmlFor="example-1">Recomendo</label>
              </div>
            </div>
            <div>
              <div>
                <button
                  onClick={() => {
                    addReview();
                  }}
                  className="new-post-btn"
                >
                  Adicionar review
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
                    setSelectedGame("");
                    setQueryGame(queryGameName.current.value);
                  }}
                />
              </div>
            </div>
            <div className="games-grid-post">
              {selectedGame === "" ? (
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
    </>
  );
}
