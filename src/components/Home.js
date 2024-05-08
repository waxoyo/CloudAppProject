import React, { useEffect, useState } from 'react';
import './HomeStyles.css';
import '../styles/tableStyles.css'
import '../styles/modalStyles.css'
import { loadingModalStyle } from '../scripts/consts';
import loadingGif from '../img/loading.gif'
import imgBrain from  '../img/computer.png'

import { NavBar } from './Misc/navBar/NavBar';
import { login, checkLog } from '../scripts/auth';
import Cookies from 'js-cookie';
import { WryMy2qSqEa5p } from '../scripts/consts';

export default function Home() {

    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [loadingPage, setLoadingPage] = useState(false);

    const compName = '';

    const log = async (e) => {
        e.preventDefault();
        setLoadingPage(true);
        login(username, password).then(async (uData)=>{
            
            if (uData && uData.id) {
                const userId = uData;
    
                var CryptoJS = require("crypto-js");
                userId.level = userId.level*1

                var cookieVal = userId.id+':'+userId.level;
                cookieVal = userId.uId ? cookieVal + ':' + userId.uId : cookieVal;  
       
                Cookies.set('_uu_aulvid', CryptoJS.AES.encrypt(cookieVal,WryMy2qSqEa5p), {expires: 1/24});
                if (userId.level === 1){
                    window.location=('/gpadDash');
                }else if (userId.level === 2){
                    window.location=('/gpteLand');
                }else if (userId.level === 0){
                    window.location=('/gpadSitesSA');
                }

            }else{
                const errorMsg = document.getElementById('log-error');
                errorMsg.classList.remove('hidden');
                console.log('invalid');
                setLoadingPage(false);
            };
        }).catch((er)=>{
            console.log(er);
            const errorMsg = document.getElementById('log-error');
            errorMsg.classList.remove('hidden');
            setLoadingPage(false);
        });

    }

    const submitPass = async (e)=> {
        var name = e.key;        
        if (name === 'Enter'){
            await log(e);
        }
    }

    const checkIfLogged = ()=>{
        var logId = checkLog(true);
        if (!logId){
            return;
        }
        var userLEvel = logId.split(':')[1]*1
        if (userLEvel === 0){
            window.location = '/gpadSitesSA';
        }else if (userLEvel === 1){
            window.location = '/gpadDash';
        }else{
            window.location = '/gpteLand';
        }
    };

    useEffect(()=>{
        checkIfLogged();
        // eslint-disable-next-line
    },[]);

    return (
        <>

            { loadingPage && 
                <div className='modal-blurr-bk'>
                    <div className='modal-loading'>
                        <img src={loadingGif} alt='' style={loadingModalStyle}/>
                    </div>
                </div>
            }

            <NavBar companyName={compName} noLogInButton={true}/>
            <div className='home-landing'>
                <div className="home-body-landing">

                    <div className="welcome">
                        <img src={imgBrain} className='landing-image-1' alt=""/>
                        <div className='welcome-content'>
                            <h1>{'Bienvenido ' + compName}</h1>
                            <h2>Centro Hospitalario</h2>
                            <h3>
                                Esta es una herramienta diseñada para tener información
                                acerca del rendimiento, estatus de mantenimiento preventivo,
                                planeación estratégica de recurso financiero, en cuanto a
                                futuras inversiones y una vista global de las reparaciones y
                                servicios realizados al dispositivo.
                            </h3>

                            <form className='log-form' onSubmit={log}>
                                {/* <label for='email'>Email</label> */}
                                <input type='email' id='email' name='email' placeholder='Email' onChange={(e)=>{setUsername(e.target.value)}}></input><br/>
                                {/* <label for='password'>Password</label> */}
                                <input type='password' id='password' name='password' placeholder='Contraseña' onKeyUp={submitPass} onChange={(e)=>{setPassword(e.target.value)}}></input><br/>
                                <button type='button' id='logButton' onClick={log}>Iniciar Sesión</button>
                                <div className='error hidden' id='log-error'>Datos Incorrectos</div>
                            </form>
                        </div>                        
                    </div>
                </div>
            </div>
        </>
    );
}
