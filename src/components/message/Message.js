import styles from './Message.module.css';
import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import "firebase/auth";


export default function Message({message}) {

  const [fromMe, isFromMe] = useState();

  //indentify who has sent the message
  useEffect(() => {
    
    async function checkMessageSender() {

      firebase.auth().onAuthStateChanged(function(user) {

        if (user.uid === message.userId) {
          isFromMe(true);
        }
        else {
          isFromMe(false);
        }
      })

    }

    checkMessageSender();

  }, [message])

  const lineStyle = fromMe ? styles.lineFromMe : styles.lineFromYou;
  const messageStyle = fromMe ? styles.messageFromMe : styles.messageFromYou;

  return(
    <div className={lineStyle}>
      <div className={messageStyle}>
        <p>Ciao come stai?</p>
      </div>  
    </div>

  )

}
