import React, { useState, useEffect } from 'react'
import { NavBar } from '../../Misc/navBar/NavBar';
import {loadingModalStyle} from '../../../scripts/consts'
import loadingGif from '../../../img/loading.gif';

import { checkLog } from '../../../scripts/auth';
import { SectionContainer } from '../../Misc/sectionContainer/SectionContainer';

import PieChartComp from '../../Misc/charts/PieChartComp';
import AccopmChart from '../../Misc/charts/AreaLinearChart';
import BarChar from '../../Misc/charts/BarChart';

import { dashGetAccData, dashGetDueMaint, dashGetGroupName, dashGetGroups, dashGetMonthData, dashGetNextMaintData, dashGetUsersData, dashStartData, getSitesDials, getYearsDials } from './Scripts';
import { getDate } from '../../../scripts/utils';


export const ManagerView = () => {

    const [loadingPage, setLoadingPage] = useState(true);
    const [groupInfo, setGroupInfo] = useState(null);
    const [equipGroups, setEquipGroups] = useState(null);
    const [usersData, setUsersData] = useState(null);
    const [dueMaints, setDueMaints] = useState(null);
    const [dueMaintsDials, setDueMaintsDials] = useState('all');
    const [accData, setAccData] = useState(null);
    const [monthData, setMonthData] = useState(null);
    const [nextMaintData, setNextMaintData] = useState(null);
    const [accDials, setAccDials] = useState({
                                                year:getDate(new Date(),'YYYY'),
                                                site:'all',
                                                equipGroup: 'all',
                                            });
    const [monthDials, setMonthDials] = useState({
                                                year:getDate(new Date(),'YYYY'),
                                                site:'all',
                                                equipGroup: 'all',
                                                tech: 'all',
                                            });

    const [nextMaintDials, setNextMaintDials] = useState({
                                                site: 'all',
                                                month: 0
                                            });


    const checkIfLogged = () => {
        const logId = checkLog(true);
        if (!logId){
            window.location = '/';
        }
        var userLEvel = Number(logId.split(':')[1])
        if (userLEvel !== 1){
            window.location = '/';
        }
    }

    const startData = async ()=> {
        const tempGroupInfo = await dashStartData(checkLog(true).split(':')[0]);
        const tempEquipGroups = await dashGetGroups();
        const tempUsersData = await dashGetUsersData(tempGroupInfo);
        const tempAccData = dashGetAccData(tempGroupInfo, accDials);
        const tempMonthData = dashGetMonthData(tempGroupInfo, monthDials);
        const tempDueMaints = dashGetDueMaint(tempGroupInfo, dueMaintsDials);

        setGroupInfo(tempGroupInfo);
        setEquipGroups(tempEquipGroups);
        setUsersData(tempUsersData);
        setAccData(tempAccData);
        setMonthData(tempMonthData);
        setDueMaints(tempDueMaints);

        setLoadingPage(false);
    };

    const accDialsChange = (tag, val)=> {
        const tempAccDials = {...accDials};
        tempAccDials[tag] = val;
        
        const tempAccData = dashGetAccData(groupInfo, tempAccDials);

        setAccData(tempAccData);
        setAccDials(tempAccDials);
    };

    const monthDialsChange = (tag, val)=> {
        const tempMonthDials = {...monthDials};
        tempMonthDials[tag] = val;
        
        const tempMonthData = dashGetMonthData(groupInfo, tempMonthDials);

        setMonthData(tempMonthData);
        setMonthDials(tempMonthDials);
    };

    const nextMaintChange = (tag, val)=> {
        const tempNextMaintDials = {...nextMaintDials};
        tempNextMaintDials[tag] = val;
        
        const tempNextMaintData = dashGetNextMaintData(groupInfo, tempNextMaintDials);
        setNextMaintData(tempNextMaintData);
        setNextMaintDials(tempNextMaintDials);
    };

    const dueMaintsDialsChange = (val)=> {
        const tempDueMaints = dashGetDueMaint(groupInfo, val);
        
        setDueMaints(tempDueMaints);
        setDueMaintsDials(val);
    };

    useEffect(() => {
        checkIfLogged();
        startData();
        //uploadNewTest();
        // eslint-disable-next-line
    }, []);


    



    const reportData = 
        [{name: 'Reportado', value: 5, color: 'rgb(245, 197, 239)'},
        {name: 'Programado', value: 0, color: 'rgb(240, 240, 240)'},
        {name: 'Finalizado', value: 4, color: 'rgb(213, 250, 225)'},
        {name: 'En Proceso', value: 2, color: 'rgb(249, 246, 188)'},
        {name: 'Cancelado', value: 0, color: 'rgb(249, 190, 188)'},]


    return (
        <>

            {loadingPage && 
                <div className='modal-blurr-bk'>
                    <div className='modal-loading'>
                        <img src={loadingGif} alt='' style={loadingModalStyle}/>
                    </div>
                </div>
            }

            {groupInfo && <NavBar companyName={groupInfo.name}/>}

            <div className='home-body'>
                <div className='home-body-contents'>
                    <div className='man-view--row'>
                        <SectionContainer title='Cumplimiento Anual'>
                            <div className='man-view--acc-chart-cont'>
                                <AccopmChart chartData = {accData}/>
                                <div className='man-view--acc-chart-dials-cont'>
                                    <div className='man-view--acc-chart-dials'>
                                        Año
                                        <select className='man-view--acc-chart-dials-select' value={accDials.year} onChange={(e)=>{accDialsChange('year',e.target.value)}}>
                                            {getYearsDials().map((item, index)=>{return(
                                                <option key={index} value={item}>{item}</option>
                                            )})}
                                        </select>
                                        Sede
                                        <select className='man-view--acc-chart-dials-select' value={accDials.site} onChange={(e)=>{accDialsChange('site',e.target.value)}}>
                                            <option value={'all'}>Todos</option>
                                            {groupInfo && getSitesDials({...groupInfo}).map((item, index)=>{return(
                                                <option key={index} value={item.compId}>{item.name}</option>
                                            )})}
                                        </select>
                                        Grupo de equipo
                                        <select className='man-view--acc-chart-dials-select' value={accDials.equipGroup} onChange={(e)=>{accDialsChange('equipGroup',e.target.value)}}>
                                            <option value={'all'}>Todos</option>
                                            {equipGroups && equipGroups.map((item,index)=>{return(
                                                <option key={index} value={item.id}>{item.name}</option>
                                            )})}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </SectionContainer>

                        <SectionContainer title='Cumplimiento Mensual'>
                            <div className='man-view--acc-chart-cont'>
                                <BarChar chartData={monthData}/>
                                <div className='man-view--acc-chart-dials-cont'>
                                    <div className='man-view--acc-chart-dials'>
                                        Año
                                        <select className='man-view--acc-chart-dials-select' value={monthDials.year} onChange={(e)=>{monthDialsChange('year',e.target.value)}}>
                                            {getYearsDials().map((item, index)=>{return(
                                                <option key={index} value={item}>{item}</option>
                                            )})}
                                        </select>
                                        Sede
                                        <select className='man-view--acc-chart-dials-select' value={monthDials.site} onChange={(e)=>{monthDialsChange('site',e.target.value)}}>
                                            <option value={'all'}>Todos</option>
                                            {groupInfo && getSitesDials({...groupInfo}).map((item, index)=>{return(
                                                <option key={index} value={item.compId}>{item.name}</option>
                                            )})}
                                        </select>
                                        Grupo de equipo
                                        <select className='man-view--acc-chart-dials-select' value={monthDials.equipGroup} onChange={(e)=>{monthDialsChange('equipGroup',e.target.value)}}>
                                            <option value={'all'}>Todos</option>
                                            {equipGroups && equipGroups.map((item,index)=>{return(
                                                <option key={index} value={item.id}>{item.name}</option>
                                            )})}
                                        </select>
                                        Técnico
                                        <select className='man-view--acc-chart-dials-select' value={monthDials.tech} onChange={(e)=>{monthDialsChange('tech',e.target.value)}}>
                                            <option value={'all'}>Todos</option>
                                            {usersData && usersData.map((item, index)=>{console.log(item);return(
                                                <option key={index} value={item.id}>{item.name + ' ' + item.lastName}</option>
                                            )})}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </SectionContainer>

                        <div className='man-view--2-col-row'>
                            <SectionContainer title='Próximos Mantenimientos'>
                                <div className='man-view--next-maint-container'>

                                    <div className='man-view--next-maint-dials-container'>
                                        Sede
                                        <select className='man-view--acc-chart-dials-select' value={nextMaintDials.site} onChange={(e)=>{nextMaintChange('site',e.target.value)}}>
                                            <option value={'all'}>Todas</option>
                                            {groupInfo && getSitesDials({...groupInfo}).map((item, index)=>{return(
                                                <option key={index} value={item.compId}>{item.name}</option>
                                            )})}
                                        </select>
                                    </div>

                                    <div className='man-view--next-maint-buttons-container'>
                                        <div className={nextMaintDials.month === 0 ? 'man-view--next-maint-button man-view--next-maint-button-current-selected' : 'man-view--next-maint-button man-view--next-maint-button-current'} 
                                        onClick={()=>{nextMaintChange('month', 0)}}>
                                            Mes en Curso
                                        </div>
                                        <div className={nextMaintDials.month === 1 ? 'man-view--next-maint-button man-view--next-maint-button-next-selected' : 'man-view--next-maint-button man-view--next-maint-button-next'} 
                                        onClick={()=>{nextMaintChange('month', 1)}}>
                                            Siguiente Mes
                                        </div>
                                    </div>

                                    <div className='man-view--next-maint-body-container-all'>

                                        <div className='man-view--next-maint-body-container'>
                                        { (nextMaintData && nextMaintData.length > 0) ? 
                                        nextMaintData.map((item,index)=>{return(
                                            <div className='man-view--next-maint-body-row' key={index}>
                                                <div className='man-view--next-maint-body-row-icon'>
                                                    <i className='fa-light fa-screwdriver-wrench'></i>
                                                </div>
                                                <div className='man-view--next-maint-body-row-group'>
                                                    {dashGetGroupName(equipGroups,item.group)}
                                                </div>
                                                <div className='man-view--next-maint-body-row-amount'>
                                                    {item.amount + ' de ' + item.totalEquip}
                                                </div>
                                            </div>                                      
                                        )})
                                        :
                                            <div className='man-view--next-maint-icon-ok'><i className="fa-light fa-list-check"></i></div>
                                        }

                                        </div>
                                        
                                    </div>

                                </div>
                            </SectionContainer>

                            <SectionContainer title='Mantenimientos Atrasados'>

                                <div className='man-view--due-maint'>
                                    <div className='man-view--due-maint-dials-container'>
                                        Sede:
                                        <select className='man-view--acc-chart-dials-select' value={dueMaintsDials} onChange={(e)=>{dueMaintsDialsChange(e.target.value)}}>
                                            <option value={'all'}>Todas</option>
                                            {groupInfo && getSitesDials({...groupInfo}).map((item, index)=>{return(
                                                <option key={index} value={item.compId}>{item.name}</option>
                                            )})}
                                        </select>
                                    </div>

                                    <div className='man-view--due-maint-container'>

                                        {dueMaints && dueMaints.length > 0 ?
                                            dueMaints.map((item, index)=>{return(
                                                <div className='man-view--due-maint-card' key={index}>
                                                    <i className='fa-regular fa-triangle-exclamation man-view--due-maint-icon'></i>
                                                    <div className='man-view--due-maint-group'>
                                                        {dashGetGroupName(equipGroups,item.group)}
                                                    </div>
                                                    <div>
                                                        {item.amount + ' de ' + item.totalEquip}
                                                    </div>
                                                </div>
                                            )})
                                        :
                                            <div className='man-view--next-maint-icon-ok'><i className="fa-regular fa-circle-check"></i></div>
                                        }

                                    </div>

                                </div>
                            </SectionContainer>
                        </div>

                        <SectionContainer title='Últimos Reportes'>
                            <div className='man-view--reports-container'>
                                <PieChartComp chartData = {reportData}/>

                                <div className='man-view--reports-body'>

                                    <div className='man-view--reports-card'>
                                        <div className='man-view--reports-card-name'>
                                            <i className='fa-light fa-computer-classic'></i>&nbsp; Equipo 1
                                        </div>
                                        <div className='man-view--reports-card-content'>

                                            <div className='man-view--reports-status-container'>
                                                <i className='fa-light fa-triangle-exclamation man-view--reports-icon-nok'></i>
                                                <div className='man-view--reports-card-status'>
                                                    Reportado
                                                </div>
                                            </div>
                                            <div className='man-view--reports-card-dates-container'>
                                                <div className='man-view--reports-card-date-container'>
                                                    <div className='man-view--reports-card-date-title'>
                                                        Fecha Reporte: 01-jul-2023
                                                    </div>
                                                </div>

                                                <div className='man-view--reports-card-date-container'>
                                                    <div className='man-view--reports-card-date-title'>
                                                        Fecha Cierre: -
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='man-view--reports-card-repby-container'>
                                                <div className='man-view--reports-card-repby-person'>
                                                    Reportó: Juan José
                                                </div>
                                                <div className='man-view--reports-card-repby-hosp'>
                                                    Sede: Hospital 1
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='man-view--reports-card'>
                                        <div className='man-view--reports-card-name'>
                                            <i className='fa-light fa-computer-classic'></i>&nbsp; Equipo 2
                                        </div>
                                        <div className='man-view--reports-card-content'>

                                            <div className='man-view--reports-status-container'>
                                            <i className='fa-light fa-circle man-view--reports-icon-progress'></i>
                                                <div className='man-view--reports-card-status'>
                                                    En proceso
                                                </div>
                                            </div>
                                            <div className='man-view--reports-card-dates-container'>
                                                <div className='man-view--reports-card-date-container'>
                                                    <div className='man-view--reports-card-date-title'>
                                                        Fecha Reporte: 01-JUL-2023
                                                    </div>
                                                </div>

                                                <div className='man-view--reports-card-date-container'>
                                                    <div className='man-view--reports-card-date-title'>
                                                        Fecha Cierre: 02-AGO-2023
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='man-view--reports-card-repby-container'>
                                                <div className='man-view--reports-card-repby-person'>
                                                    Reportó: Juan José
                                                </div>
                                                <div className='man-view--reports-card-repby-hosp'>
                                                    Sede: Hospital 3
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='man-view--reports-card'>
                                        <div className='man-view--reports-card-name'>
                                            <i className='fa-light fa-computer-classic'></i>&nbsp; Equipo 2
                                        </div>
                                        <div className='man-view--reports-card-content'>

                                            <div className='man-view--reports-status-container'>
                                            <i className='fa-light fa-circle-check man-view--reports-icon-ok'></i>
                                                <div className='man-view--reports-card-status'>
                                                    Finalizado
                                                </div>
                                            </div>
                                            <div className='man-view--reports-card-dates-container'>
                                                <div className='man-view--reports-card-date-container'>
                                                    <div className='man-view--reports-card-date-title'>
                                                        Fecha Reporte: 01-JUL-2023
                                                    </div>
                                                </div>

                                                <div className='man-view--reports-card-date-container'>
                                                    <div className='man-view--reports-card-date-title'>
                                                        Fecha Cierre: 02-AGO-2023
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='man-view--reports-card-repby-container'>
                                                <div className='man-view--reports-card-repby-person'>
                                                    Reportó: Juan José
                                                </div>
                                                <div className='man-view--reports-card-repby-hosp'>
                                                    Sede: Hospital 3
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className='man-view--reports-card'>
                                        <div className='man-view--reports-card-name'>
                                            <i className='fa-light fa-computer-classic'></i>&nbsp; Equipo 2
                                        </div>
                                        <div className='man-view--reports-card-content'>

                                            <div className='man-view--reports-status-container'>
                                            <i className='fa-light fa-circle-check man-view--reports-icon-ok'></i>
                                                <div className='man-view--reports-card-status'>
                                                    Finalizado
                                                </div>
                                            </div>
                                            <div className='man-view--reports-card-dates-container'>
                                                <div className='man-view--reports-card-date-container'>
                                                    <div className='man-view--reports-card-date-title'>
                                                        Fecha Reporte: 01-JUL-2023
                                                    </div>
                                                </div>

                                                <div className='man-view--reports-card-date-container'>
                                                    <div className='man-view--reports-card-date-title'>
                                                        Fecha Cierre: 02-AGO-2023
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='man-view--reports-card-repby-container'>
                                                <div className='man-view--reports-card-repby-person'>
                                                    Reportó: Juan José
                                                </div>
                                                <div className='man-view--reports-card-repby-hosp'>
                                                    Sede: Hospital 3
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>


                                <div className='man-view--reports-dials-container'>
                                    <div className='man-view--reports-dials'>
                                        Año
                                        <select className='man-view--acc-chart-dials-select'>
                                            <option>2023</option>
                                            <option>2024</option>
                                        </select>
                                        Sede
                                        <select className='man-view--acc-chart-dials-select'>
                                            <option>Hospital1</option>
                                            <option>Hospital2</option>
                                        </select>
                                        Grupos de equipos
                                        <select className='man-view--acc-chart-dials-select'>
                                            <option>Grupo 1</option>
                                            <option>Grupo 3</option>
                                        </select>
                                    </div>
                                    <div className='man-view--acc-chart-dials-more'>
                                        Ver Todos
                                    </div>
                                </div>

                            </div>
                        </SectionContainer>

                    </div>
                </div>
            </div>
        </>
    );
}
