import React, { useState, useEffect } from 'react'
import { checkLog, encryptURL } from '../../../scripts/auth';
import { NavBar } from '../../Misc/navBar/NavBar';
import { SectionContainer } from '../../Misc/sectionContainer/SectionContainer';
import { sitesSuperAdGetCompanies } from './scripts';

export const MaintsSuperAdmin = () => {

    const [sitesData, setSitesData] = useState(null);
    const [selectedSite, setSelectedSite] = useState(null);


    const checkIfLogged = () => {
        const logId = checkLog(true);
        if (!logId){
            window.location = '/';
        }
        var userLEvel = Number(logId.split(':')[1])
        if (userLEvel !== 0){
            window.location = '/';
        }
    };


    const startData = async () => {
        const tempSitesData = await sitesSuperAdGetCompanies();
        setSitesData(tempSitesData);
    };


    const changeSelectedSite = (e) => {
        e.preventDefault();
        const tempSelectedSite = e.target.value;
        setSelectedSite(tempSelectedSite);
    };

    const goButtonClick = ()=> {
        const url = encryptURL(sitesData[selectedSite].id);
        window.location = '/gpteLandSA/' + url;
    }


    useEffect(()=>{
        checkIfLogged();
        startData();
        // eslint-disable-next-line
    }, []);


    return (
        <>  
            <NavBar companyName={'Administrador'}/>

            <div className='home-body'>
                <div className='home-body-contents'>
                    <SectionContainer title={'Sede'}>
                        <div className='sites-SA--site-selector-container'>
                            <select className='sites-SA--site-selector' onChange={changeSelectedSite}>
                                <option value={null}></option>
                                {sitesData && sitesData.map((site, siteIndex)=>{
                                    return(
                                        <option key={siteIndex} value={siteIndex}>{site.companyName}</option>
                                    )
                                })

                                }
                            </select>
                            {selectedSite &&
                                <button className='sites-SA--go-button' onClick={goButtonClick}> 
                                    IR &nbsp;&nbsp;
                                    <i className='fa-light fa-arrow-right'></i>
                                </button>
                            }
                        </div>
                    </SectionContainer>
                </div>
            </div>

        </>
    );
};
