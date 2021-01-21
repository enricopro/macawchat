import Message from '../message/Message';
import styles from './Chat.module.css';
import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import "firebase/firestore";
import "firebase/auth";

export default function Chat() {

  const [searching, isSearching] = useState();
  const [mateUserId, setMateUserId] = useState();

  const [userId, setUserId] = useState();


  //sets userId
  useEffect(() => {
    
    async function getUserId() {

      firebase.auth().onAuthStateChanged(function(user) {

        if (user) {
          setUserId(user.uid);
        }
      })

    }

    getUserId();

  }, [])


  //finds a match!
  useEffect(() => {
    
    async function match() {
      
      const db = firebase.firestore();
      const query = db.collection("users").where("online", "==", true).where("room", "==", "none");

      query.get().then(function(querySnapshot) {
          const docs = querySnapshot.docs;
          setMateUserId(docs[(Math.round(Math.random(1)*querySnapshot.size))].id); //takes a random user who is online
          db.collection("rooms").add({
            messages: [],
            partecipants: [userId, mateUserId]
          }).then((docRef) => {
            db.collection("users").doc(mateUserId).set({
              room: docRef.id,
            }, { merge: true });
          });

          db.collection("users").doc(mateUserId).set({});
          isSearching(false);
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });

    }

    if(searching) {
      match();
    }

  }, [searching, mateUserId, userId]);


  function renderFooter() {
    if(searching == null) {
      return <div className={styles.startButton} onClick={() => isSearching(true)}>START! 🔥</div>
    }

    return(
      <>
        <input placeholder="Write something kind..."/>
        <div className={styles.sendButton}>SEND 📨</div>
        <div className={styles.nextButton}>NEXT ⏭️</div>
      </>
    )

  }

  return(
    <div className={styles.chat}>
      <div className={styles.messagesContainer}>

      </div>
      <div className={styles.inputContainer}>
        {renderFooter()}
      </div>
    </div>
  )

}
