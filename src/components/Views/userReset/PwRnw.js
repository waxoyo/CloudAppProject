import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { NavBar } from '../../Misc/navBar/NavBar';
import { checkLog, decryptURL } from '../../../scripts/auth';
import { resetGetUserInfo } from './scripts';
import { SectionContainer } from '../../Misc/sectionContainer/SectionContainer';
import { createOrUpdate } from '../../../scripts/updates';
import { loadingModalStyle } from '../../../scripts/consts';
import loadingGif from '../../../img/loading.gif';

export const PwRnw = () => {

    const [uData, setUData] = useState(null);
    const [loadingPage, setLoadingPage] = useState(true);

    let {id} = useParams();
    id = decryptURL(id);

    const startData = async () => {
        const logInfo = checkLog(true);
        
        if(logInfo){
            window.location = '/';
        }

        const tempUData = await resetGetUserInfo(id);
        setUData(tempUData);
        setLoadingPage(false);
    }

    const checkPassWords = (e) => {
        const value = e ? e.target.value : uData.pass2;
        
        if(uData.pass === value || !value || value === ''){
            const element = document.getElementById('invalid-coincidence');
            element.classList.add('pass-reset--hidden');
            return true;
        }else if(uData.pass !== value || !value || value === ''){
            const element = document.getElementById('invalid-coincidence');
            element.classList.remove('pass-reset--hidden');
            return false;
        }
    };

    const formChange = (e) => {
        var tempUData = {...uData};
        tempUData[e.target.id] = e.target.value;
        if(e.target.id === 'pass2'){
            checkPassWords(e);
        }
        setUData(tempUData); 
    };


    const formSave = (e)=> {
        e.preventDefault();
        setLoadingPage(true);

        const idToCheck = [
            'name',
            'lastName',
            'email',
            'pass',
            'pass2'
        ];

        var allOk = true;

        for (var i = 0; i < idToCheck.length; i++){
            const element = document.getElementById(idToCheck[i]);
            element.classList.remove('pass-reset--required')
            if (element.value === '' || ! element.value){
                allOk = false;
                element.classList.add('pass-reset--required');
            }
        }

        if (!allOk){
            setLoadingPage(false);
            return;
        }

        allOk = checkPassWords();
        if (!allOk){
            setLoadingPage(false);
            return;
        }

        //update in db
        var tempUData = {...uData};
        const uId = uData.id;
        delete tempUData.pass2;
        delete tempUData.id;
        tempUData.renew = false;

        createOrUpdate(tempUData, 'uData', uId).then(()=>{
            window.location = '/';
        }).catch((er)=>{
            console.log(er);
        });
        

    };

    

    useEffect(()=>{
        startData();
        // eslint-disable-next-line
    }, []);

    return (
        <>

            {loadingPage && 
                <div className='modal-blurr-bk'>
                    <div className='modal-loading'>
                        <img src={loadingGif} alt='' style={loadingModalStyle}/>
                    </div>
                </div>
            }


            <NavBar noLogInButton={true}/>
            <div className='home-body'>
                <div className='home-body-contents'>
                    {uData &&
                        <SectionContainer title={'Bienvenido ' + uData.name + '!'}>
                            <div className='pass-reset--container'>
                                <div className='pass-reset--title'>
                                    Revisa tus Datos:
                                </div>
                                <div className='pass-reset--form-container'>
                                    <div className='pass-reset--form-item'>
                                        <div className='pass-reset--form-item-tag'>
                                            Nombre
                                        </div>
                                        <input type='text' id='name' value={uData.name} onChange={formChange} className='pass-reset--form-item-value'></input>
                                    </div>
                                    <div className='pass-reset--form-item'>
                                        <div className='pass-reset--form-item-tag'>
                                            Apellido
                                        </div>
                                        <input type='text' id='lastName' value={uData.lastName} onChange={formChange} className='pass-reset--form-item-value'></input>
                                    </div>
                                    <div className='pass-reset--form-item'>
                                        <div className='pass-reset--form-item-tag'>
                                            Email
                                        </div>
                                        <input type='text' id='email' value={uData.email} onChange={formChange} className='pass-reset--form-item-value' disabled={true}></input>
                                    </div>
                                    <div className='pass-reset--form-item'>
                                        <div className='pass-reset--form-item-tag'>
                                            Contraseña
                                        </div>
                                        <input type='password' id='pass' value={uData.pass} onChange={formChange} className='pass-reset--form-item-value'></input>
                                    </div>
                                    <div className='pass-reset--form-item'>
                                        <div className='pass-reset--form-item-tag'>
                                            Repetir Contraseña
                                        </div>
                                        <input type='password' id='pass2' value={uData.pass2} onChange={formChange} className='pass-reset--form-item-value'></input>
                                    </div>
                                </div>
                                <div id='invalid-coincidence' onClick={checkPassWords} className='pass-reset--form-invalid pass-reset--hidden'>
                                    Las contraseñas no coinciden
                                </div>
                                <button className='pass-reset--button' onClick={formSave}>Guardar</button>
                            </div>
                        </SectionContainer>
                    }
                </div>
            </div>
        </>
    );
};
