import styles from './Login.module.css';
import loginGoogleLogo from '../../images/google_login.png';
import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import "firebase/auth";


export default function Login() {

  const [name, setName] = useState();
  const [photoUrl, setPhotoUrl] = useState();
  const [sex, setSex] = useState();
  const [age, setAge] = useState();

  const [loading, setLoading] = useState(false);

  const [loginType, setLoginType] = useState(null);

  useEffect(() => {
    
    async function logUser() {

      const provider = new firebase.auth.GoogleAuthProvider();

      firebase.auth().signInWithPopup(provider).then((result) => {

          console.log(result.user);

          setName(result.user.displayName);

          setLoading(false);

        }).catch((error) => {

          setLoading(false);
          console.log(error);

        });

    }

    if(loginType == null) {
      return;
    }

    logUser();
    
  }, [loginType]);

  function renderLogin() {

    if(loading) {
      return null;
    }

    return(
      <>
        <h2 className={styles.loginDescription}>Login with Google or sign-in anonymously</h2>
        <div>
          <img className={styles.loginWithGoogleLogo} src={loginGoogleLogo} alt="google_login" onClick={() => setLoginType('google')} />
        </div>
        <p>or</p>
        <p className={styles.signInAnonymously}>Sign-in anonymously</p>
      </>
    )

  }

  function renderInsertData() {

    if(loading) {
      return null;
    }

    return(
      <>
        <h2 className={styles.insertDataDescription}>Insert your data:</h2>
        <div className={styles.inputContainer}>
          <p>Name:</p>
          <input className={styles.input} type="text" placeholder={name == null ? "Insert your name here..." : name}/>
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
          <input className={styles.input} type="text" placeholder="Insert your age here..."/>
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
      <circle cx="50" cy="50" fill="none" stroke="#df1317" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138">
        <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
      </circle>
    </div>
  }


  return(
    <div className={styles.login}>
      {renderLogin()}
      {renderLoading()}
    </div>
  )

}
