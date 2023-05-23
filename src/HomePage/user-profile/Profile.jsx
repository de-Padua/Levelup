import React, { useEffect, useState, useRef } from "react";
import { GlobalContextF } from "../../global-context/context";
import { FiSearch } from "react-icons/fi";
import { GoThumbsup, GoThumbsdown } from "react-icons/go";
import { HiStar } from "react-icons/hi";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { GoX } from "react-icons/go";
import { CiEdit } from "react-icons/ci";
import { AiOutlineMail, AiOutlineUnlock } from "react-icons/ai";

export default function Profile() {
  const navigate = useNavigate();
  const user = GlobalContextF();

  const { getUserDBInfo } = GlobalContextF();
  const { updateFavGame } = GlobalContextF();
  const { addJogosFavoritos } = GlobalContextF();
  const { addJogosCompletos } = GlobalContextF();
  const { updateOnlyUserName } = GlobalContextF();
  const { getUserDBInfo_NotCurrentIser } = GlobalContextF();
  const { changeAll } = GlobalContextF();
  const queryGameName = useRef();
  const [queryGame, setQueryGame] = useState("");
  const [games, setGames] = useState([]);
  const [selectedGameModal, setSelectedGameModal] = useState(false);
  const [modalEditarPefil, setModalEditarPefil] = useState(false);
  const [resp, setResp] = useState(null);
  const [reload, setReload] = useState(false);
  const [action, setAction] = useState("");
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
          localStorage.setItem("window_title", `Meu perfil`);
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
          localStorage.setItem("window_title", `Visitando perfil`);
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
  }, []);

  function addtoDB_RequestedGames(data) {
    if (action === "fav") {
      addUserFavorite(data);
    } else {
      addCompGames(data);
    }
  }

  useEffect(() => {
    if (resp !== null) {
      localStorage.setItem("reviews", JSON.stringify(resp[0].reviews));
      localStorage.setItem("completos", JSON.stringify(resp[0].completos));
      localStorage.setItem("favoritos", JSON.stringify(resp[0].favoritos));
    }
  }, [resp]);

  function addUserFavorite(data) {
    let previews_favorites = resp[0].favoritos;
    const found = previews_favorites.find((x) => {
      return x.name === data.name;
    });
    if (found) {
      return;
    } else {
      let newarr = [...previews_favorites, data];
      addJogosFavoritos(newarr);
      getUserInfo();
    }
    setSelectedGameModal(false);
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
      addJogosCompletos(newarr);
      getUserInfo();
    }
    setSelectedGameModal(false);
  }
  function router_user() {
    if (anotherUserProfile) {
      navigate(
        `/homepage/DisplayAll/user_profile/user_reviews/${localStorage.getItem(
          "user_uid"
        )}`
      );
    } else {
      navigate(
        `/homepage/DisplayAll/user_profile/user_reviews/${user.user.uid}`
      );
    }
  }
  function router_user_fav_Games() {
    if (anotherUserProfile) {
      navigate(
        `/homepage/DisplayAll/user_profile/fav_games/${localStorage.getItem(
          "user_uid"
        )}`
      );
    } else {
      navigate(`/homepage/DisplayAll/user_profile/fav_games/${user.user.uid}`);
    }
  }
  function router_user_complete_games() {
    if (anotherUserProfile) {
      navigate(
        `/homepage/DisplayAll/user_profile/complete_games/${localStorage.getItem(
          "user_uid"
        )}`
      );
    } else {
      navigate(
        `/homepage/DisplayAll/user_profile/complete_games/${user.user.uid}`
      );
    }
  }

  useEffect(() => {
    setGames([]);
    fetch(
      `https://api.rawg.io/api/games?search=${queryGame}&key=3c25c0a4c6ef4b98ae8a0af760f18217&page=1`
    )
      .then((data) => data.json())
      .then((game_data) => setGames(game_data.results));
  }, [queryGame]);

  ////////////////////////////////////////////////////////////////

  const [imageFormat, setImageFormat] = useState("");
  const [image, setImage] = useState();

  const newUserName = useRef();
  const newBio = useRef();
  const user_image = useRef();

  const findFormat = (e) => {
    const format = user_image.current.value;
    if (format.includes("png")) {
      setImageFormat(".png");
    }
    if (format.includes("jpeg")) {
      setImageFormat(".jpeg");
    }
    if (format.includes("jpg")) {
      setImageFormat(".jpg");
    }

    setImage(e.target.files[0]);
  };

  function editUserInfo(name, bio) {
    if (name !== "") {
      setResp(null);
      setReload(true);
      changeAll(name, image, imageFormat, bio).then(() => {
        getUserInfo();
        alert("As informações serão atualizadas em alguns instantes");
      });
    }
  }
  return (
    <>
      {modalEditarPefil ? (
        <div className="edit-perfil-modal ">
          <div className="container-edit-perfil">
            <div className="editar-picture profile-container">
              <GoX
                className="icon-search"
                onClick={() => {
                  setModalEditarPefil(false);
                }}
              />
              <div className="user-image-profile-2">
                {resp === null ? (
                  <div className="load-animation-skeleton-img"></div>
                ) : (
                  <div className="image-upload">
                    <label htmlFor="file-input">
                      <img src={resp[0].photoURL} className="test-modal-img" />
                    </label>

                    <input
                      id="file-input"
                      type="file"
                      required
                      ref={user_image}
                      accept="image/gif, image/jpeg, image/png"
                      onChange={() => {
                        findFormat(event);
                      }}
                    />
                  </div>
                )}
                <div>
                  <div>
                    <input
                      className="input-selected"
                      type="email"
                      value={"Nome não pode ser mudado"}
                      placeholder="Novo nome de usuário"
                      ref={newUserName}
                      disabled
                    />
                  </div>
                  <div>
                    <textarea
                      className="input-selected"
                      type="email"
                      defaultValue={resp === null ? "" : resp[0].bio.about}
                      placeholder="Nova descrição"
                      ref={newBio}
                    />
                  </div>
                  <div>
                    <button
                      className="editar-perfil-btn"
                      onClick={() => {
                        editUserInfo(
                          newUserName.current.value,
                          newBio.current.value
                        );
                        setModalEditarPefil(false);
                      }}
                    >
                      Salvar mudanças
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
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

      <div className="user-profile-main-container">
        <div className="profile-container">
          {anotherUserProfile ? (
            ""
          ) : (
            <CiEdit
              className="icon-search"
              onClick={() => {
                setModalEditarPefil(true);
              }}
            />
          )}

          <div className="user-image-profile">
            {resp === null ? (
              <div className="load-animation-skeleton-img"></div>
            ) : (
              <img src={resp[0].photoURL} className="img-perfil" />
            )}

            <div className="trocar-foto-div">
              <h2 className="user-name">
                {resp === null ? (
                  <div className="load-animation-skeleton-nome"></div>
                ) : (
                  resp[0].displayName
                )}
              </h2>
              <p className="description-user">
                {resp === null ? "" : resp[0].bio.about}
              </p>
            </div>
          </div>

          <div className=" block-container user-image-profile">
            <h3>Reviews </h3>
            <h3>{resp === null ? "" : resp[0].reviews.length}</h3>
          </div>
        </div>

        <div className="info-user-container">
          <div className="div-header">
            <h2 className="title-ult-reviews">Últimas reviews</h2>
            <p
              className="ver-todas"
              onClick={() => {
                router_user();
              }}
            >
              Ver todas
            </p>
          </div>

          <div className="my-reviews-row">
            {resp === null
              ? ""
              : resp[0].reviews.length > 0
              ? resp[0].reviews
                  .slice()
                  .reverse()
                  .map((x) => {
                    return (
                      <div
                        onClick={() => {
                          console.log(x);
                        }}
                        key={x.post_id}
                        className="block-quick-review-profile"
                      >
                        <div className="hero-background-img">
                          <img src={x.selectedGame_img} />
                        </div>
                        <div className="set-item-star start-container-side">
                          {x.nota === 5 ? (
                            <div>
                              <HiStar style={{ color: "rgb(206, 193, 78)" }} />
                              <HiStar style={{ color: "rgb(206, 193, 78)" }} />
                              <HiStar style={{ color: "rgb(206, 193, 78)" }} />
                              <HiStar style={{ color: "rgb(206, 193, 78)" }} />
                              <HiStar style={{ color: "rgb(206, 193, 78)" }} />
                            </div>
                          ) : x.nota === 4 ? (
                            <div>
                              <HiStar style={{ color: "rgb(206, 193, 78)" }} />
                              <HiStar style={{ color: "rgb(206, 193, 78)" }} />
                              <HiStar style={{ color: "rgb(206, 193, 78)" }} />
                              <HiStar style={{ color: "rgb(206, 193, 78)" }} />
                            </div>
                          ) : x.nota === 3 ? (
                            <div>
                              <HiStar style={{ color: "rgb(206, 193, 78)" }} />
                              <HiStar style={{ color: "rgb(206, 193, 78)" }} />
                              <HiStar style={{ color: "rgb(206, 193, 78)" }} />
                            </div>
                          ) : x.nota === 2 ? (
                            <div>
                              <HiStar style={{ color: "rgb(206, 193, 78)" }} />
                              <HiStar style={{ color: "rgb(206, 193, 78)" }} />
                            </div>
                          ) : x.nota === 1 ? (
                            <div>
                              <HiStar style={{ color: "rgb(206, 193, 78)" }} />
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="game-name-preview-perfil">
                          <h2>{x.selectedGame}</h2>
                        </div>
                      </div>
                    );
                  })
              : ""}
          </div>
          <div className="div-header">
            <div>
              <h2 className="title-ult-reviews">
                Jogos favoritos (
                {resp === null
                  ? ""
                  : resp[0].favoritos.length > 0
                  ? resp[0].favoritos.length
                  : 0}
                )
              </h2>
            </div>
            <p
              className="ver-todas"
              onClick={() => {
                router_user_fav_Games();
              }}
            >
              Ver todos{" "}
            </p>
          </div>
          <div className="my-reviews-row">
            {resp === null
              ? ""
              : resp[0].favoritos.length > 0
              ? resp[0].favoritos
                  .slice()
                  .reverse()
                  .map((x) => {
                    return (
                      <div key={x.name} className="block-quick-review-profile">
                        <div className="hero-background-img">
                          <img src={x.background_image} />
                        </div>
                        <div className="game-name-preview-perfil">
                          <h2>{x.name}</h2>
                        </div>
                      </div>
                    );
                  })
              : ""}
          </div>
          <div className="div-header">
            <div>
              <h2 className="title-ult-reviews">
                Jogos completos (
                {resp === null
                  ? ""
                  : resp[0].completos.length > 0
                  ? resp[0].completos.length
                  : 0}
                )
              </h2>
            </div>

            <p
              className="ver-todas"
              onClick={() => {
                router_user_complete_games();
              }}
            >
              Ver todos
            </p>
          </div>
          <div className="my-reviews-row">
            {resp === null
              ? ""
              : resp[0].completos.length > 0
              ? resp[0].completos
                  .slice()
                  .reverse()
                  .map((x) => {
                    return (
                      <div key={x.name} className="block-quick-review-profile">
                        <div className="hero-background-img">
                          <img src={x.background_image} />
                        </div>

                        <div className="game-name-preview-perfil">
                          <h2>{x.name}</h2>
                        </div>
                      </div>
                    );
                  })
              : ""}
          </div>
          <div className="profile-div-main-feed">
            {resp === null
              ? ""
              : resp[0].rev.length > 0
              ? resp[0].rev
                  .slice()
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
