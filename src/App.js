import './App.css';
import Login from '../src/components/login/Login';
import { useEffect, useState } from 'react';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import Chat from './components/chat/Chat';


function App() {

  const [showLogin, setShowLogin] = useState(true);

  //initalize firebase app
  useEffect(() => {

    const firebaseConfig = {
      apiKey: "AIzaSyAZRsm5Ww1jfL8L9jFUigepNFKekzZVbG8",
      authDomain: "macawchat.firebaseapp.com",
      projectId: "macawchat",
      storageBucket: "macawchat.appspot.com",
      messagingSenderId: "789337156968",
      appId: "1:789337156968:web:6545760e02a7033af9fadd",
      measurementId: "G-F5Q5K2G1CS"
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
   
  }, []);


  function renderContent() {

    if(showLogin) {
      return <Login 
        onShowLogin={setShowLogin}
        showLogin={showLogin} />
    }

    return <Chat />

  }


  return (
    <div className="App">
      {renderContent()}
    </div>
  );
}

export default App;
