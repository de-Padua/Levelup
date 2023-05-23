import React, { useState, useRef, useEffect } from "react";
import { AiOutlineMail, AiOutlineUnlock } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { TbArrowBack } from "react-icons/tb";
import { GlobalContextF } from "../global-context/context";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateNewAccount() {
  const navigate = useNavigate();

  // Create new account
  const user = GlobalContextF();
  const { formData } = GlobalContextF();
  const { updateUserName } = GlobalContextF();
  const { addUserToDB } = GlobalContextF();
  const { attUserPicture } = GlobalContextF();
  const email = useRef();
  const password = useRef();
  const passwordConfirmation = useRef();
  const userName = useRef();
  const user_image = useRef();
  const [formatIMG, setFormatIMG] = useState();
  const [image, setImage] = useState();
  const [errorAlert, setErrorAlert] = useState("");
  const notify = () => {
    toast("Conta criada com sucesso", {
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

  const findFormat = (e) => {
    const format = user_image.current.value;
    if (format.includes("png")) {
      setFormatIMG(".png");
    }
    if (format.includes("jpeg")) {
      setFormatIMG(".jpeg");
    }
    if (format.includes("jpg")) {
      setFormatIMG(".jpg");
    }

    setImage(e.target.files[0]);
  };

  const getFormData = () => {
    const formData_OBJECT = {
      email: email.current.value,
      password: password.current.value,
      user: userName.current.value,
    };

    const regex_email =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

    const regex_password =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

    if (password.current.value === passwordConfirmation.current.value) {
      if (
        email.current.value.match(regex_email) &&
        password.current.value.match(regex_password)
      ) {
        setErrorAlert("");
        formData(formData_OBJECT, "new account")
          .then((x) => {
            updateUserName(x.user, userName.current.value, image, formatIMG);

            notify();
            setTimeout(() => {
              navigate("/login");
            }, 1000);
          })

          .catch((error) => {
            console.log(error);
          });
      } else {
        setErrorAlert(<p className="password-error">Email inválido</p>);
      }
    } else {
      setErrorAlert(
        <p className="password-error">As senhas não correspondem </p>
      );
    }
  };

  return (
    <div className="form-container-main">
      <ToastContainer />
      <div className="test-container">
        <div className="form-container">
          <div className="form">
            <TbArrowBack
              className="icon-go-back"
              onClick={() => {
                navigate("/login");
              }}
            />

            <div className="form-itens">
              <div>
                <div className="form-top">
                  <h2>Bem vindo,deixe-nos conhecê-lo melhor.</h2>
                </div>
                <div>
                  <label htmlFor="images" className="drop-container">
                    <span className="drop-title">Escolha um avatar</span>
                    or
                    <input
                      type="file"
                      id="images"
                      required
                      ref={user_image}
                      accept="image/gif, image/jpeg, image/png"
                      onChange={() => {
                        findFormat(event);
                      }}
                    />
                  </label>
                </div>
              </div>
              <div>
                <AiOutlineMail className="icon-form" />
                <input
                  className="input-selected"
                  type="email"
                  placeholder="Email ID"
                  ref={email}
                />
              </div>

              <div>
                <AiOutlineMail className="icon-form" />
                <input
                  className="input-selected"
                  type="email"
                  placeholder="Nome completo"
                  ref={userName}
                />
              </div>

              <div>
                <AiOutlineUnlock className="icon-form" />
                <input
                  className="input-selected"
                  type="password"
                  placeholder="Senha"
                  ref={password}
                />
              </div>

              <div>
                <AiOutlineUnlock className="icon-form" />
                <input
                  className="input-selected"
                  type="password"
                  placeholder="Confirme sua senha"
                  ref={passwordConfirmation}
                />
              </div>

              {errorAlert}
              <div className="password-rules">
                <span>Minímo de 8 caracteres</span>
                <span>Uma letra maiúscula e pelo menos um número</span>
              </div>
              <div>
                <button
                  onClick={() => {
                    getFormData();
                  }}
                >
                  Criar nova conta
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="second-container">
          <img
            data-aos="fade-up"
            data-aos-offset="200"
            data-aos-delay="160"
            data-aos-duration="1000"
            src="https://www.denofgeek.com/wp-content/uploads/2020/03/Doom-Eternal-1.jpg?resize=768%2C432"
          />
        </div>
        <div className="second-container-2">
          <img
            data-aos="fade-up"
            data-aos-offset="200"
            data-aos-delay="100"
            data-aos-duration="1200"
            src="https://s.yimg.com/uu/api/res/1.2/dEzGhndCHaLCnUMD_zBcxw--~B/aD0xMTU4O3c9MTgwMDthcHBpZD15dGFjaHlvbg--/https://media-mbst-pub-ue1.s3.amazonaws.com/creatr-uploaded-images/2021-01/cdcf03a0-4e92-11eb-afdf-ffae59fc8055.cf.jpg"
          />
        </div>
        <div className="second-container-3">
          <img
            data-aos="fade-up"
            data-aos-offset="200"
            data-aos-delay="200"
            data-aos-duration="1000"
            src="https://s2.glbimg.com/f1vk3eWm36kqwxcb5BOqUAatl8U=/0x0:1400x788/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_bc8228b6673f488aa253bbcb03c80ec5/internal_photos/bs/2022/g/e/AEa4BZRPuxlaafBB7x9w/i548685.jpg"
          />
        </div>
      </div>
    </div>
  );
}
