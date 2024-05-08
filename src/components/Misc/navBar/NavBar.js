import React, { useState, useEffect } from 'react';
import { checkLog, logout } from '../../../scripts/auth';
import img from '../../../img/logo_azul.png';
import { NavUserModules } from '../navUserModules/NavUserModules';
import { NavUserModulesMobile } from '../navUserModulesMobile/NavUserModulesMobile';

export const NavBar = ( {companyName, noLogInButton} ) => {

    const [logged, setLogged] = useState(false);
    const [logLevel, setLogLevel] = useState(2);
    const [showDownBar, setShowDownBar] = useState(false);

    const logOutClick = (e) => {
        e.preventDefault();
        logout();
        window.location = '/';
        
    }

    const clickHamMenu = ()=> {
        setShowDownBar(!showDownBar);
    }

    useEffect(()=>{
        var logId = checkLog(true);
        if (logId){
            var userLevel = Number(logId.split(':')[1])
            setLogged(true);
            setLogLevel(userLevel);
        }else{
            logId = checkLog(false);
            if(logId){
                setLogged(true);
            }
        }
        // eslint-disable-next-line
    },[]);


    return (
        <>
        {!showDownBar &&
        <div className="navbar">
            <div className='navbar-logo-cont'>
                {logLevel!==2 ? <i className='fa-duotone fa-bars navbar--hamb-menu' onClick={clickHamMenu}></i> : <div></div>}
                <img src={img} className="navbar-logo" alt=""></img>
            </div>
            {companyName && (
                <div className="navbar-comp-name">
                    {companyName}
                </div>
            )}
            {!noLogInButton &&
            <div className="navbar-log">
                <button onClick={logOutClick}>{logged ? 'Log Out' : 'Log In'}</button>
            </div>
            }
        </div>
        }
        {showDownBar &&
            <div className='navbar--down-bar-cont-mobile'>
                <i className='fa-sharp fa-solid fa-xmark navbar--x-menu' onClick={clickHamMenu}></i>
                <NavUserModulesMobile logInLevel={logLevel}/>
            </div>
        }

        {(logged && logLevel!==2) &&
            <div className='navbar--down-bar'>
                <NavUserModules logInLevel={logLevel}/>
            </div>
        }
        </>
        
    );
};
