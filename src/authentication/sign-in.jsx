import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { app, auth, db, provider } from "./config";
import { useEffect, useState } from "react";

import { getFirestore, serverTimestamp ,collection, addDoc, doc, onSnapshot, setDoc, getDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { nanoid } from "nanoid";
import { useDispatch } from 'react-redux';
import { userLoggedIn } from "../store/auth-slice";
import "./sign-in.css"
import { json } from "react-router-dom";



export function SignIn(){

    const dispatch = useDispatch()

    useEffect(()=>{
        
        // REMEMBER TO CHANE TO SESSION STORAGE
      const userData =  localStorage.getItem('userData')

      if(userData){
        dispatch(userLoggedIn(JSON.parse(userData)))
      }

    }, [])
   
        
        const handleClick = ()=>{
            signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                console.log(user);
              
                dispatch(userLoggedIn(result.user))
                sessionStorage.setItem('userData', JSON.stringify(result.user))
           
            
            })
            .catch((error) => {
                console.error('Error signing in:', error);
            });
        }



    return(
        <div className="sign-in">
            <button onClick={handleClick}>Sign in with google</button>
        </div>
    )
}