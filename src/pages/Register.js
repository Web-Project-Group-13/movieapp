import React from 'react'
import { useState } from 'react';
import validator from 'validator';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const navigate = useNavigate();

    

    //Salasanan validointi
    const validatePasswordAndUsername = (username,password) => {
        if(username === '') {
            setUsernameError('Käyttäjätunnus ei voi olla tyhjä');
            return;
        }
        setUsernameError('');

        if(!validator.isLength(password, {min: 8})){
            return 'Salasanan pituus tulee olla vähintään 8 merkkiä'
        }
        if (!/[A-Z]/.test(password)){
            return 'Salasannassa tulee olla vähintää yksi iso kirjain'
        }
        if(!/[0-9]/.test(password)){
            return 'Salasanassa tulee olla vähintään yksi numero'
        }
        return ''
    }

    const register = (e) =>{
        e.preventDefault()

        //Tarkastaa salasanan ennen lähetystä
        const passwordErrorMessage = validatePasswordAndUsername(username,password)
            if(passwordErrorMessage){
            setPasswordError(passwordErrorMessage)
            return
        }

    
        
        //Ei toimi vielä kun ei ole backendiä (testidb toiminnassa)
        axios.post('http://localhost:3001/register', {
            username:username,
            password:password
        }).then (response => {
            console.log(response);
            navigate('/login');
        }).catch(error => {
            console.error(error);
        })

    }


    return (
    <div className='register-container'>
        <div className='register-form'>
            <h2>Rekisteröityminen</h2>
            <form onSubmit={register}>
                
                <div className='username'>
                    <input 
                        type="text" 
                        placeholder='sähköposti'
                        value={username} 
                        onChange={e =>{setUsername(e.target.value)
                            setUsernameError('')
                        }}
                        className="register-input" />
                        {usernameError && <p style={{color:'red'}}>{usernameError}</p>}
                
                </div>
                 <div className='password'>   
                    <input 
                        type="password" 
                        placeholder='salasana'
                        value={password} 
                        onChange={e =>{setPassword(e.target.value)
                            setPasswordError('')
                        }}
                        className="register-input" />
                        {passwordError && <p style={{color:'red'}}>{passwordError}</p>}
                </div>
                    <button type="submit" className="register-button">
                        Rekisteröidy
                        </button>
                
            </form>
            </div>
    </div>
  )
}
