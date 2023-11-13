import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { app, auth, db, provider } from "./config";
import { useEffect, useState } from "react";

import { getFirestore, serverTimestamp ,collection, addDoc, doc, onSnapshot, setDoc, getDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { nanoid } from "nanoid";
import { useDispatch } from 'react-redux';
import { userLoggedIn } from "../store/auth-slice";
import "./sign-in.css"
import { json } from "react-router-dom";
import { EmailLogo, GoogleLogo } from "../assets/icons";



export function SignIn(){

    const dispatch = useDispatch()

    useEffect(()=>{
        
      const userData =  sessionStorage.getItem('userData')

      if(userData){
        dispatch(userLoggedIn(JSON.parse(userData)))
      }

    }, [])
   
        
    const handleClick = ()=>{
        signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            
            dispatch(userLoggedIn(result.user))
            sessionStorage.setItem('userData', JSON.stringify(result.user))
        
        
        })
        .catch((error) => {
            console.error('Error signing in:', error.message);
        });
    }



    return(
        <div className="sign-in">
            <div className="sign-in-options">
            <button onClick={handleClick}> <GoogleLogo/>Sign in with google</button>
            <button className="inop"><EmailLogo/> email and password</button>
            </div>
        </div>
    )
}
