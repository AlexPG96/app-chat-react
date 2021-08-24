import React, { useRef, useState } from 'react';
import './assets/css/App.css';

// Firebase deps
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
    apiKey: "AIzaSyBjgsUhmMn-tFKjIsYu9g368w3y3-2XNfw",
    authDomain: "react-chat-28f99.firebaseapp.com",
    projectId: "react-chat-28f99",
    storageBucket: "react-chat-28f99.appspot.com",
    messagingSenderId: "958024058583",
    appId: "1:958024058583:web:e705921a093211cc535292"
});

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {

  const [user] =useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h2>Room Chat</h2>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
      <a class="btn_coffee" href="https://www.buymeacoffee.com/alexpg96" target="_blank">Buy me a coffee</a>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button class="btn_google" onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button class="btn_sign_out" onClick={() => auth.signOut()}>Log Out <i class="fas fa-sign-out-alt"></i></button>
  )
}

function ChatRoom() {

  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    
    e.preventDefault();

    const {uid, photoURL} = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid, 
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({behavior: 'smooth'});
  }

  return (

    <React.Fragment>
    <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <div ref={dummy}></div>
    </main>

    <form onSubmit={sendMessage}>
      <input placeholder="Escribe un mensaje" value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
      <button class="btn_custom" type="submit"><i class="far fa-paper-plane"></i></button>
    </form>
    </React.Fragment>
  )
}

function ChatMessage(props) {
  const {text, uid, photoURL} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  )
}

export default App;
