import Message from '../message/Message';
import styles from './Chat.module.css';
import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import "firebase/firestore";
import "firebase/auth";

export default function Chat() {

  const [searching, isSearching] = useState();
  const [changingRoom, isChangingRoom] = useState();

  const [userId, setUserId] = useState();
  const [mateUserId, setMateUserId] = useState();
  const [roomId, setRoomId] = useState();


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

      console.log("finding a match...")
      
      const db = firebase.firestore();
      const query = db.collection("users").where("online", "==", true).where("room", "==", "none");

      query.get().then(function(querySnapshot) {

          while(querySnapshot.size === 1) {
            isSearching(true);
          }
          const docs = querySnapshot.docs;
          const mateId = selectRandomUser(docs, querySnapshot.size);

          db.collection("rooms").where("partecipants", "array-contains", userId).get().then(function(snapshot) {
            if(snapshot.size === 0) {
              db.collection("rooms").add({
                messages: [],
                partecipants: [userId, mateId]
              }).then((docRef) => {
                setRoomId(docRef.id);
                db.collection("users").doc(mateId).set({
                  room: docRef.id,
                  searching: false
                }, { merge: true });
                db.collection("users").doc(userId).set({
                  room: docRef.id,
                  searching: false
                }, { merge: true });
              });
            }
          });

          isSearching(false);

          console.log("My id is: " + userId);
          console.log("My mate id is: " + mateId)

      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });

    }


    function selectRandomUser(docs, size) {

      let index = Math.round(Math.random(1)*size);
  
      while(userId === docs[index].id) {
        index = Math.round(Math.random(1)*size);
      }
      setMateUserId(docs[index].id);
      return docs[index].id;
  
    }


    if(searching) {
      match();
    }

  }, [searching, userId]);


  useEffect(() => {

    async function changeRoom() {

      const db = firebase.firestore();

      db.collection("users").doc(userId).set({
        room: "none",
        searching: true,
      }, { merge: true });

      db.collection("rooms").doc(roomId).delete().then(console.log("Room deleted"));

      setMateUserId(null);
      setRoomId(null);
      isChangingRoom(false);
      isSearching(true);
    }

    if(changingRoom) {
      changeRoom();
    }

  }, [changingRoom, userId, roomId]);


  function renderFooter() {
    if(searching == null) {
      return <div className={styles.startButton} onClick={() => isSearching(true)}>START! 🔥</div>
    }

    return(
      <>
        <input className={styles.messageinput} placeholder="Write something kind..."/>
        <div className={styles.sendButton}>SEND 📨</div>
        <div className={styles.nextButton} onClick={() => isChangingRoom(true)}>NEXT ⏭️</div>
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
