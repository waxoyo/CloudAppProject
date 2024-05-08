import React, {useEffect, useState} from 'react';
// import { maintDashStartData } from './Scripts';
import { checkLog } from '../../../scripts/auth';
import { NavBar } from '../../Misc/navBar/NavBar';
import loadingGif from '../../../img/loading.gif';
import { loadingModalStyle } from '../../../scripts/consts';
import { SectionContainer } from '../../Misc/sectionContainer/SectionContainer';
import AccopmChart from '../../Misc/charts/AreaLinearChart';

export const MaintDash = () => {

    const [loadingPage, setLoadingPage] = useState(true);
    // const [groupData, setGroupData] = useState(null);

    const getData = async ()=> {

        const logInfo = checkLog(true);
        if (!logInfo) {
            window.location = '/';
        }
        // const groupId = logInfo.split(':')[0];
        const logLevel = logInfo.split(':')[1]*1;
        if (logLevel !== 1){
            window.location = '/';
        }
        
        // const tempData = await maintDashStartData();

        setLoadingPage(false);
    };

    useEffect(()=>{
        getData();
        // eslint-disable-next-line
    }, []);



    const accomplishmentData = 
    [{name: 'ENE (0 de 0)', Objetivo: 80, Cumplimiento: 0},
    {name: 'FEB (0 de 1)', Objetivo: 80, Cumplimiento: 10},
    {name: 'MAR (0 de 2)', Objetivo: 80, Cumplimiento: 15},
    {name: 'ABR (0 de 0)', Objetivo: 80, Cumplimiento: 20},
    {name: 'MAY (0 de 0)', Objetivo: 80, Cumplimiento: 30},
    {name: 'JUN (0 de 0)', Objetivo: 80, Cumplimiento: 40},
    {name: 'JUL (0 de 0)', Objetivo: 80, Cumplimiento: 50},
    {name: 'AGO (0 de 0)', Objetivo: 80, Cumplimiento: 50},
    {name: 'SEP (1 de 1)', Objetivo: 80, Cumplimiento: 70},
    {name: 'OCT (0 de 0)', Objetivo: 80, Cumplimiento: 80},
    {name: 'NOV (0 de 0)', Objetivo: 80, Cumplimiento: 90},
    {name: 'DIC (0 de 0)', Objetivo: 80, Cumplimiento: 95},]
// const reportData = 
//     [{name: 'Reportado', value: 5, color: 'rgb(245, 197, 239)'},
//     {name: 'Programado', value: 0, color: 'rgb(240, 240, 240)'},
//     {name: 'Finalizado', value: 4, color: 'rgb(213, 250, 225)'},
//     {name: 'En Proceso', value: 2, color: 'rgb(249, 246, 188)'},
//     {name: 'Cancelado', value: 0, color: 'rgb(249, 190, 188)'},]



    return(<>

        { loadingPage && 
            <div className='modal-blurr-bk'>
                <div className='modal-loading'>
                    <img src={loadingGif} alt='' style={loadingModalStyle}/>
                </div>
            </div>
        }

        <NavBar companyName={'test'}/>

        <div className='home-body'>
            <div className='home-body-contents'>
                <div className='maintDashAdmin--row'>
                    <SectionContainer title={'Mantenimientos Preventivos'}>
                        <div className='maintDashAdmin--dials-and-chart-container'>
                            <div className='maintDashAdmin--dials-container'>
                                <div className='maintDashAdmin--dials-row'>
                                    <div className='maintDashAdmin--dial-title'>
                                        Sede:
                                    </div>
                                    <select className='maintDashAdmin--dial-dropdown'>
                                        <option>Todos</option>
                                        <option>Hospital1</option>
                                        <option>Hospital1</option>
                                    </select>
                                </div>

                                <div className='maintDashAdmin--dials-row'>
                                    <div className='maintDashAdmin--dial-title'>
                                        Grupo:
                                    </div>
                                    <select className='maintDashAdmin--dial-dropdown'>
                                        <option>Todos</option>
                                        <option>Grupo1</option>
                                        <option>Grupo2</option>
                                    </select>
                                </div>

                                <div className='maintDashAdmin--dials-row'>
                                    <div className='maintDashAdmin--dial-title'>
                                        Técnico:
                                    </div>
                                    <select className='maintDashAdmin--dial-dropdown'>
                                        <option>Todos</option>
                                        <option>Tec 1</option>
                                        <option>Tec 2</option>
                                    </select>
                                </div>

                                <div className='maintDashAdmin--dials-row'>
                                    <div className='maintDashAdmin--dial-title'>
                                        Estatus de Equipo:
                                    </div>
                                    <select className='maintDashAdmin--dial-dropdown'>
                                        <option>Todos</option>
                                        <option>Atrasados</option>
                                        <option>Al Día</option>
                                    </select>
                                </div>

                            </div>
                            <div className='maintDashAdmin--chart'>
                                <AccopmChart chartData = {accomplishmentData}/>
                            </div>
                        </div>

                        <div className='maintDashAdmin--maint-rows-container'>

                            <div className='maintDashAdmin--maint-row'>
                                <div className='maintDashAdmin--maint-row-title-container'> 
                                    <div className='maintDashAdmin--maint-row-title-icons'>
                                        <i className='fa-regular fa-chevron-up'></i>
                                    </div>
                                    <div className='maintDashAdmin--maint-row-title-equip-name'>
                                        Equipo 1
                                    </div>
                                    <div className='maintDashAdmin--maint-row-title-equip-status'>
                                        Al Día
                                    </div> 
                                </div>

                                <div className='maintDashAdmin--next-maint-container'>
                                    <div className='maintDashAdmin--next-maint-title'>
                                        Próximo Mantenimiento:
                                    </div>
                                    <div className='maintDashAdmin--next-maint-body'>
                                        02-Oct-2024
                                    </div>
                                </div>

                                <div className='maintDashAdmin--maints-container'>

                                    <div className='maintDashAdmin--maint'>
                                        <div className='maintDashAdmin--maint-icon'>
                                            <i className='fa-light fa-screwdriver-wrench'></i>
                                        </div>
                                        <div className='maintDashAdmin--maint-details-container'>
                                            <div className='maintDashAdmin--maint-details-title'>
                                                Estatus:
                                            </div>
                                            <div className='maintDashAdmin--maint-details-body'>
                                                Finalizado
                                            </div>
                                        </div>  
                                        <div className='maintDashAdmin--maint-details-container'>
                                            <div className='maintDashAdmin--maint-details-title'>
                                                Fecha Inicio:
                                            </div>
                                            <div className='maintDashAdmin--maint-details-body'>
                                                02-Nov-2023
                                            </div>
                                        </div>
                                        <div className='maintDashAdmin--maint-details-container'>
                                            <div className='maintDashAdmin--maint-details-title'>
                                                Fecha fin:
                                            </div>
                                            <div className='maintDashAdmin--maint-details-body'>
                                                05-Nov-2023
                                            </div>
                                        </div>
                                        <div className='maintDashAdmin--maint-details-more'>
                                            Ver Detalles
                                        </div>
                                    </div>

                                    <div className='maintDashAdmin--maint'>
                                        <div className='maintDashAdmin--maint-icon'>
                                            <i className='fa-light fa-screwdriver-wrench'></i>
                                        </div>
                                        <div className='maintDashAdmin--maint-details-container'>
                                            <div className='maintDashAdmin--maint-details-title'>
                                                Estatus:
                                            </div>
                                            <div className='maintDashAdmin--maint-details-body'>
                                                Finalizado
                                            </div>
                                        </div>  
                                        <div className='maintDashAdmin--maint-details-container'>
                                            <div className='maintDashAdmin--maint-details-title'>
                                                Fecha Inicio:
                                            </div>
                                            <div className='maintDashAdmin--maint-details-body'>
                                                02-Nov-2023
                                            </div>
                                        </div>
                                        <div className='maintDashAdmin--maint-details-container'>
                                            <div className='maintDashAdmin--maint-details-title'>
                                                Fecha fin:
                                            </div>
                                            <div className='maintDashAdmin--maint-details-body'>
                                                05-Nov-2023
                                            </div>
                                        </div>
                                        <div className='maintDashAdmin--maint-details-more'>
                                            Ver Detalles
                                        </div>
                                    </div>

                                    <div className='maintDashAdmin--maint'>
                                        <div className='maintDashAdmin--maint-icon'>
                                            <i className='fa-light fa-screwdriver-wrench'></i>
                                        </div>
                                        <div className='maintDashAdmin--maint-details-container'>
                                            <div className='maintDashAdmin--maint-details-title'>
                                                Estatus:
                                            </div>
                                            <div className='maintDashAdmin--maint-details-body'>
                                                Finalizado
                                            </div>
                                        </div>  
                                        <div className='maintDashAdmin--maint-details-container'>
                                            <div className='maintDashAdmin--maint-details-title'>
                                                Fecha Inicio:
                                            </div>
                                            <div className='maintDashAdmin--maint-details-body'>
                                                02-Nov-2023
                                            </div>
                                        </div>
                                        <div className='maintDashAdmin--maint-details-container'>
                                            <div className='maintDashAdmin--maint-details-title'>
                                                Fecha fin:
                                            </div>
                                            <div className='maintDashAdmin--maint-details-body'>
                                                05-Nov-2023
                                            </div>
                                        </div>
                                        <div className='maintDashAdmin--maint-details-more'>
                                            Ver Detalles
                                        </div>
                                    </div>

                                </div>

                            </div>

                            <div className='maintDashAdmin--maint-row'>
                                <div className='maintDashAdmin--maint-row-title-container'> 
                                    <div className='maintDashAdmin--maint-row-title-icons'>
                                        <i className='fa-regular fa-chevron-up'></i>
                                    </div>
                                    <div className='maintDashAdmin--maint-row-title-equip-name'>
                                        Equipo 1
                                    </div>
                                    <div className='maintDashAdmin--maint-row-title-equip-status'>
                                        Al Día
                                    </div> 
                                </div>
                            </div>

                        </div>

                    </SectionContainer>
                </div>
            </div>
        </div>
    </>);
};
