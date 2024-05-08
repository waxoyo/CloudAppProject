import React, {useState, useEffect} from 'react';
// import { reportsDashAdminStartData } from './Scripts';
import { NavBar } from '../../Misc/navBar/NavBar';
import loadingGif from '../../../img/loading.gif';
import { loadingModalStyle } from '../../../scripts/consts';

import { SectionContainer } from '../../Misc/sectionContainer/SectionContainer';
import BarCharHorizontal from '../../Misc/charts/BarChartHor';
import BarCharPerTec from '../../Misc/charts/BarChartPerTec';
import { checkLog } from '../../../scripts/auth';

export const ReportsDashAdmin = () => {

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
        
        // const tempData = await reportsDashAdminStartData();

        setLoadingPage(false);
    };

    useEffect(()=>{
        getData();
        // eslint-disable-next-line
    }, []);

    
    return(
        <>
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
                <div className='repDashAdmin--row'>
                <SectionContainer title={'Reportes por Técnico'}>
                        <div className='repDashAdmin--dials-and-chart-container'>
                            <div className='repDashAdmin--dials-container'>

                                <div className='repDashAdmin--dials-row'>
                                    <div className='repDashAdmin--dial-title'>
                                        Año:
                                    </div>
                                    <select className='repDashAdmin--dial-dropdown'>
                                        <option>2022</option>
                                        <option>2023</option>
                                        <option>2023</option>
                                    </select>
                                </div>

                                <div className='repDashAdmin--dials-row'>
                                    <div className='repDashAdmin--dial-title'>
                                        Sede:
                                    </div>
                                    <select className='repDashAdmin--dial-dropdown'>
                                        <option>Todos</option>
                                        <option>Hospital1</option>
                                        <option>Hospital1</option>
                                    </select>
                                </div>
                                

                            </div>
                            <div className='repDashAdmin--chart'>
                                <BarCharPerTec/>
                            </div>
                        </div>
                    </SectionContainer>

                    <SectionContainer title={'Todos los Reportes'}>
                        <div className='repDashAdmin--dials-and-chart-container'>
                            <div className='repDashAdmin--dials-container'>

                                <div className='repDashAdmin--dials-row'>
                                    <div className='repDashAdmin--dial-title'>
                                        Año:
                                    </div>
                                    <select className='repDashAdmin--dial-dropdown'>
                                        <option>2022</option>
                                        <option>2023</option>
                                        <option>2023</option>
                                    </select>
                                </div>

                                <div className='repDashAdmin--dials-row'>
                                    <div className='repDashAdmin--dial-title'>
                                        Sede:
                                    </div>
                                    <select className='repDashAdmin--dial-dropdown'>
                                        <option>Todos</option>
                                        <option>Hospital1</option>
                                        <option>Hospital1</option>
                                    </select>
                                </div>

                                <div className='repDashAdmin--dials-row'>
                                    <div className='repDashAdmin--dial-title'>
                                        Grupo:
                                    </div>
                                    <select className='repDashAdmin--dial-dropdown'>
                                        <option>Todos</option>
                                        <option>Grupo1</option>
                                        <option>Grupo2</option>
                                    </select>
                                </div>

                                <div className='repDashAdmin--dials-row'>
                                    <div className='repDashAdmin--dial-title'>
                                        Técnico:
                                    </div>
                                    <select className='repDashAdmin--dial-dropdown'>
                                        <option>Todos</option>
                                        <option>Tec 1</option>
                                        <option>Tec 2</option>
                                    </select>
                                </div>
                                <div className='repDashAdmin--dials-row'>
                                    <div className='repDashAdmin--dial-title'>
                                        Estatus:
                                    </div>
                                    <select className='repDashAdmin--dial-dropdown'>
                                        <option>Todos</option>
                                        <option>Reportado</option>
                                        <option>Cerrado</option>
                                        <option>En Proceso</option>
                                    </select>
                                </div>

                            </div>
                            <div className='repDashAdmin--chart'>
                                <BarCharHorizontal/>
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
                                    <div className='maintDashAdmin--maint-row-title-equip-status'></div> 
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

        </>
    );
};
