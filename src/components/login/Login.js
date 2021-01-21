import styles from './Login.module.css';
import loginGoogleLogo from '../../images/google_login.png';
import loadingGif from '../../images/loading.gif'
import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import "firebase/auth";


export default function Login({onShowLogin, showLogin}) {

  const [name, setName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [sex, setSex] = useState('');
  const [age, setAge] = useState('');

  const [loading, setLoading] = useState(false);

  const [logged, isLogged] = useState(false);
  const [dataInserted, isDataInserted] = useState(false);
  const [loginType, setLoginType] = useState(null);


  //logs user when loginType is setted
  useEffect(() => {
    
    async function logUserWithGoogle() {

      setLoading(true);

      const provider = new firebase.auth.GoogleAuthProvider();

      firebase.auth().signInWithPopup(provider).then((result) => {

          setPhotoUrl(result.user.photoURL);
          setName(result.user.displayName);

          isAlreadyRegistered(result.user.uid);

          setLoading(false);
          isLogged(true);

        }).catch((error) => {

          setLoading(false);
          setLoginType(null);

        });

    }

    async function logUserAnonymously() {

      setLoading(true);

      firebase.auth().signInAnonymously().then((result) => {

        isAlreadyRegistered(result.user.uid);

        setLoading(false);
        isLogged(true);

      })
      .catch((error) => {

        setLoading(false);
        setLoginType(null);

      });
    

    }


    async function isAlreadyRegistered(userId) {

      const db = firebase.firestore();

      db.collection("users").doc(userId).get().then((doc) => {
        if (doc.exists) {
          console.log('User already registered');
          onShowLogin(false);
        }
      });
    }


    if(loginType == null) {
      return;
    }

    if(loginType === "google") {
      logUserWithGoogle();
    }

    if(loginType === "anonymous") {
      logUserAnonymously();
    }
    
  }, [loginType, onShowLogin]);


  //uploads user data to firestore
  useEffect(() => {

    async function writeInDatabase() {

      setLoading(true);

      firebase.auth().onAuthStateChanged(function(user) {

        if (user) {
      
          const db = firebase.firestore();

          if(name === '') {
            setName('Happy Macaw');
          }
          if(age === '' || age > 100) {
            alert("Insert a valid age please");
            return;
          }
          if(photoUrl === '') {
            setPhotoUrl('https://lafeber.com/pet-birds/wp-content/uploads/2018/06/Blue-and-Gold-Macaw.jpg');
          }


          db.collection("users").doc(user.uid).set({
            name: name,
            sex: sex,
            age: age.toString(),
            photoURL: photoUrl,
            online: true,
            room: 'none'
          })
          .then(function() {
              setLoading(false);
              onShowLogin(false);
          })
          .catch(function(error) {
              alert("Something went wrong, try to reload the page (error: " + error + ")");
              return;
          });
        }
      });

    }

    if(dataInserted) {
      writeInDatabase();
    }
    
  }, [age, sex, dataInserted, name, photoUrl, onShowLogin]);


  function renderLogin() {

    if(loading) {
      return null;
    }

    if(loginType != null) {
      return null;
    }

    return(
      <>
        <h2 className={styles.loginDescription}>Login with Google or sign-in anonymously</h2>
        <div>
          <img className={styles.loginWithGoogleLogo} src={loginGoogleLogo} alt="google_login" onClick={() => setLoginType('google')} />
        </div>
        <p>or</p>
        <p className={styles.signInAnonymously} onClick={() => setLoginType('anonymous')}>Sign-in anonymously</p>
      </>
    )

  }

  
  function renderInsertData() {

    if(loading) {
      return null;
    }

    if(logged === false) {
      return null;
    }

    if(!loading && logged && !showLogin) {
      return null;
    }

    return(
      <>
        <h2 className={styles.insertDataDescription}>Insert your data:</h2>
        <div className={styles.inputContainer}>
          <p>Name:</p>
          <input className={styles.input} onChange={(e) => setName(e.target.value)} type="text" placeholder={name === '' ? "Insert your name here..." : name}/>
        </div>
        <div className={styles.inputContainer}>
          <p>Sex:</p>
          <select className={styles.input} onChange={(e) => setSex(e.target.value)}>
            <option value="m">Male</option>
            <option value="f">Female</option>
            <option value="o">Other</option>
          </select>
        </div>
        <div className={styles.inputContainer}>
          <p>Age:</p>
          <input className={styles.input} onChange={(e) => setAge(e.target.value)} type="number" placeholder="Insert your age here..." />
        </div>
        <div className={styles.submitButton} onClick={() => isDataInserted(true)} >Jump in the chat! 🚀</div>
      </>
    )

  }


  function renderLoading() {

    if(!loading) {
      return null;
    }

    return <div>
      <img src={loadingGif} alt='loading_gif' width={25}/>
    </div>
  }


  return(
    <div className={styles.login}>
      {renderLogin()}
      {renderLoading()}
      {renderInsertData()}
    </div>
  )

}
