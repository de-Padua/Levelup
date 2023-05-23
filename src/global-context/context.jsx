import { createContext, useContext, useState, useEffect } from "react";
import { app } from "../firebase/firebase";
import { storage } from "../firebase/firebase";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  //hooks
  const auth = getAuth();

  const navigate = useNavigate();

  // check if the user is already logged in
  const [user, setuser] = useState({});
  const [useDataDB, setUserDataDB] = useState([]);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setuser(user);
      } else if (auth.currentUser === null) {
        navigate("/");
      }
    });
  }, []);

  //create ,log and logoff users
  const formData = async (data, action) => {
    if (action === "new account") {
      return createUserWithEmailAndPassword(auth, data.email, data.password);
    } else if (action === "login") {
      return signInWithEmailAndPassword(auth, data.email, data.password);
    } else if (action === "logout") {
      return signOut(auth);
    }
  };

  const addUserToDB = async (x) => {
    return await setDoc(doc(db, "users", x.uid), JSON.parse(JSON.stringify(x)));
  };
  const addPostToDB = async (data, id) => {
    return await setDoc(doc(db, "posts", id), JSON.parse(JSON.stringify(data)));
  };
  const addToReviews = async (data, id) => {
    return await setDoc(
      doc(db, "reviews", id),
      JSON.parse(JSON.stringify(data))
    );
  };

  const getUserDBInfo = async () => {
    const userRef = doc(db, "users", user.uid);
    return getDoc(userRef);
  };
  const getUserDBInfo_NotCurrentIser = async (id) => {
    const userRef = doc(db, "users", id);
    return getDoc(userRef);
  };
  const setUserDBInfo_f = async () => {
    const userRef = doc(db, "users", user.uid);
    getDoc(userRef).then((data) => {
      const dbinfo = data.data();
      setUserDataDB(dbinfo);
    });
  };
  setUserDBInfo_f();
  const addReviewsToUserProfile = async (data) => {
    const userRef = doc(db, "users", user.uid);
    return updateDoc(userRef, { rev: data });
  };
  const updateall = async (name, photo, bio) => {
    const userRef = doc(db, "users", user.uid);
    return updateDoc(userRef, {
      bio: { about: bio },
    });
  };
  const addReviewsToUserProfile_correct = async (data) => {
    const userRef = doc(db, "users", user.uid);
    return updateDoc(userRef, { reviews: data });
  };
  const addJogosCompletos = async (data) => {
    const userRef = doc(db, "users", user.uid);
    return updateDoc(userRef, { completos: data });
  };
  const updateFavGame = async (data) => {
    const userRef = doc(db, "users", user.uid);
    return updateDoc(userRef, { fav: { favorito: data } });
  };
  const addJogosFavoritos = async (data) => {
    const userRef = doc(db, "users", user.uid);
    return updateDoc(userRef, { favoritos: data });
  };
  const getFeed = async () => {
    const feedRef = collection(db, "posts");
    return getDocs(feedRef);
  };
  const getReviews = async () => {
    const reviewsFeed = collection(db, "reviews");
    return getDocs(reviewsFeed);
  };

  const deleteDocFromFeed = async (id) => {
    return deleteDoc(doc(db, "posts", id));
  };
  const deleteDocFromReviews = async (id) => {
    return deleteDoc(doc(db, "reviews", id));
  };
  const updateUserName = async (target, name, image, imageFormat) => {
    return updateProfile(target, { displayName: name }).then(() => {
      attUserPicture(target, image, imageFormat);
    });
  };

  const updateOnlyUserName = (newUserName) => {
    return updateProfile(user.uid, { displayName: newUserName });
  };
  const updateBio = (new_bio) => {
    const userRef = doc(db, "users", user.uid);
    return updateDoc(userRef, { bio: { about: new_bio.ToString() } });
  };
  const updateUserPicture = async (picture, format) => {
    const fileRef = ref(storage, user.uid + format);
    await uploadBytes(fileRef, picture);
    const photoURL = await getDownloadURL(fileRef);
    updateProfile(user, { photoURL: photoURL });
  };

  const exit = async () => {
    return signOut(auth);
  };
  const changeAll = async (name, image, imageFormat, bio) => {
    updateallinfo(image, imageFormat, name, bio);
  };
  const updateallinfo = async (picture, format, name, bio) => {
    const fileRef = ref(storage, user.uid + format);
    await uploadBytes(fileRef, picture);
    const photoURL = await getDownloadURL(fileRef);
    updateProfile(user, {
      photoURL: photoURL,
    }).then(() => {
      updateall(name, photoURL, bio).then(() => {});
    });
  };
  const setInfo = async (item_id) => {
    //find arr with revs
    //filter revs
    //post revs on profile again

    const revs_filtered_arr = useDataDB.rev.filter((post) => {
      return post.post_id !== item_id;
    });
    addReviewsToUserProfile(revs_filtered_arr);

    //delete from feed
    deleteDocFromFeed(item_id.toFixed());
    //delete from reviews

    const reviews_filtered_arr = useDataDB.reviews.filter((item) => {
      return item.post_id !== item_id;
    });

    addReviewsToUserProfile_correct(reviews_filtered_arr);

    deleteDocFromReviews(item_id.toFixed());
  };

  const attUserPicture = async (target, picture, format) => {
    const fileRef = ref(storage, target.uid + format);
    await uploadBytes(fileRef, picture);
    const photoURL = await getDownloadURL(fileRef);
    updateProfile(target, { photoURL: photoURL }).then(() => {
      addUserToDB({
        ...target,
        rev: [],
        reviews: [],
        completos: [],
        jogando: [],
        favoritos: [],
        fav: { favorito: "Nenhum favorito adicionado" },
        bio: { about: "Olá,esse é meu perfil." },
        created: serverTimestamp(),
      });
    });
  };
  return (
    <GlobalContext.Provider
      value={{
        formData,
        user,
        updateUserName,
        addUserToDB,
        addPostToDB,
        getFeed,
        deleteDocFromFeed,
        exit,
        addToReviews,
        getReviews,
        attUserPicture,
        addReviewsToUserProfile,
        getUserDBInfo,
        addJogosCompletos,
        addReviewsToUserProfile_correct,
        deleteDocFromReviews,
        updateFavGame,
        addJogosFavoritos,
        changeAll,
        setInfo,
        getUserDBInfo_NotCurrentIser,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const GlobalContextF = () => {
  return useContext(GlobalContext);
};
