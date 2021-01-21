import styles from './Login.module.css';
import loginGoogleLogo from '../../images/google_login.png';
import loadingGif from '../../images/loading.gif'
import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import "firebase/auth";


export default function Login() {

  const [name, setName] = useState('');
  const [photoUrl, setPhotoUrl] = useState();
  const [sex, setSex] = useState();
  const [age, setAge] = useState();

  const [loading, setLoading] = useState(false);

  const [logged, isLogged] = useState(false);
  const [loginType, setLoginType] = useState(null);

  //log user when loginType is setted
  useEffect(() => {
    
    async function logUserWithGoogle() {

      setLoading(true);

      const provider = new firebase.auth.GoogleAuthProvider();

      firebase.auth().signInWithPopup(provider).then((result) => {

          console.log(result.user);

          setName(result.user.displayName);

          setLoading(false);
          isLogged(true);

        }).catch((error) => {

          setLoading(false);
          setLoginType(null);

        });

    }

    async function logUserAnonymously() {

      setLoading(true);

      firebase.auth().signInAnonymously().then((user) => {

        console.log(user);
        setLoading(false);
        isLogged(true);

      })
      .catch((error) => {

        setLoading(false);
        setLoginType(null);

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
    
  }, [loginType]);

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

    if(loginType == null) {
      return null;
    }

    if(logged === false) { //avoid bug at the beginning
      return null;
    }

    return(
      <>
        <h2 className={styles.insertDataDescription}>Insert your data:</h2>
        <div className={styles.inputContainer}>
          <p>Name:</p>
          <input className={styles.input} onChange={(e) => console.log(e.target.value)} type="text" placeholder={name === '' ? "Insert your name here..." : name}/>
        </div>
        <div className={styles.inputContainer}>
          <p>Sex:</p>
          <select className={styles.input} name="sex">
            <option value="male">Male</option>
            <option value="saab">Female</option>
            <option value="fiat">Other</option>
          </select>
        </div>
        <div className={styles.inputContainer}>
          <p>Age:</p>
          <input className={styles.input} type="number" placeholder="Insert your age here..." />
        </div>
        <div className={styles.submitButton}>Jump in the chat! 🚀</div>
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
