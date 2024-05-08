import React from 'react';

export const NavUserModules = ({activeButton, logInLevel}) => {

    logInLevel = logInLevel ?? 1;

    return (
        <div className='nav-user-modules'>
            <div className={logInLevel > 0 ? 'nav-user-modules-container': 'nav-user-modules-container-superAdmin'}>
                {logInLevel > 0 ?
                <div className='nav-user-button nav-user-button--dash' onClick={()=>{window.location= '/gpadDash'}}>
                    <i className='fa-light fa-chart-line'></i>&nbsp; DASHBOARD
                </div>
                :
                <></>
                }
                <div className='nav-user-button nav-user-button--hosp'  onClick={()=>{window.location=logInLevel === 0 ? '/gpadSitesSA' : '/gpadSites'}}>
                    <i className='fa-light fa-hospital'></i>&nbsp; SEDES
                </div>
                {logInLevel > 0 ?
                    <div className='nav-user-button nav-user-button--maint' onClick={()=>{window.location= '/gpadMaintenances'}}>
                        <i className='fa-light fa-screwdriver-wrench'></i>&nbsp; MANTENIMIENTOS
                    </div>
                :
                    <div className='nav-user-button nav-user-button--maint' onClick={()=>{window.location= '/gpadSitesSuAd'}}>
                        <i className='fa-light fa-screwdriver-wrench'></i>&nbsp; MTTOS Y REPS
                    </div>
                }
                { logInLevel !== 0 &&
                    <div className='nav-user-button nav-user-button--reps' onClick={()=>{window.location= '/gpadReports'}}>
                        <i className='fa-light fa-flag'></i>&nbsp; REPORTES
                    </div>
                }
                <div className='nav-user-button nav-user-button--eqs' onClick={()=>{window.location= '/gpadEquip'}}>
                    <i className='fa-light fa-computer-classic'></i>&nbsp; EQUIPOS
                </div>
                
            </div>
        </div>
    );
};
