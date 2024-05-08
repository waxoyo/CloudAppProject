import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import loadingGif from '../../../img/loading.gif';
import { loadingModalStyle } from '../../../scripts/consts';
import { NavBar } from '../../Misc/navBar/NavBar';
import { checkLog, decryptURL, encryptURL } from '../../../scripts/auth';

import { equipImgStyle, techLandingStartData, getGroupsData, getGroupName, maintenancePeriodicity, getSelectedTiles, getAllGroupNames, repDetailsGetPendingReports, repDetailsGetDonutInfo, getNextMantainDate, getMaintIsOnTime } from './Scripts';
import { SectionContainer } from '../../Misc/sectionContainer/SectionContainer';
import { ServiceReqImg } from '../../Misc/imgComponents/ServiceReqImg';
import { NewReportForm } from './modules/NewReportForm';
import PieChartComp from '../../Misc/charts/PieChartComp';
import { getImgUrl } from '../../../scripts/files';
import { ReportDetails } from './modules/ReportDetails';
import { capitalize, getDate, OrdAndFilt } from '../../../scripts/utils';
import { NewMaint } from './modules/NewMaint';
import { NavUserModules } from '../../Misc/navUserModules/NavUserModules';

export const TechLandingSA = () => {

    const [loadingPage, setLoadingPage] = useState(true);
    const [creatingReport, setCreatingReport] = useState(false);
    const [creatingMaint, setCreatingMaint] = useState(false);
    const [viewingMaint, setViewingMaint] = useState(null);
    const [viewReport, setViewReport] = useState(false);
    const [reportSaved, setReportSaved] = useState(false);
    const [reportCreated, setReportCreated] = useState(false);
    const [compData, setCompData] = useState(null);
    const [groupsData, setGroupsData] = useState(null);
    const [expandedEquip, setExpandedEquip] = useState(null);
    const [loadedEqImg, setLoadedEqImg] = useState({});
    const [selectedTiles, setSelectedTiles] = useState(null);
    const [eqFilter, setEqFilter] = useState({field: 'name', reversed:false});

    let {params} = useParams();
    params = decryptURL(params);

    const startData = async ()=> {
        console.log(params);
        
        const log = checkLog(true);
        if (!log){
            window.location = '/';
        }
        const tempCompData = await techLandingStartData(params);
        if (!tempCompData){
            setLoadingPage(false);
            return;
        }
        const tempGroupsData = await getGroupsData();
        const tempSelectedTiles = getSelectedTiles(tempCompData.equipment);
        setCompData(tempCompData);
        setGroupsData(tempGroupsData);
        setSelectedTiles(tempSelectedTiles);
        setLoadingPage(false);

    };

    const loadingToggle = (loading)=> {
        setLoadingPage(loading);
    };

    const gotoQrClick = (compId, equipId)=> {
        const encriptedURL = encryptURL(compId + ':' + equipId)
        window.location = '/equipdetails/' + encriptedURL;
    };

    const newReportClick = (callback)=> {
        if (callback){
            
            const tempCompData = (JSON.parse(JSON.stringify(compData)));
            tempCompData.equipment[expandedEquip].reports.unshift(JSON.parse(JSON.stringify(callback)));
            
            setCompData(tempCompData);
            setReportCreated(true);
            return;
        }
        
        const creating = !creatingReport;
        setCreatingReport(creating);
    };

    const newMaintClick = (callback)=> {
        if (callback){
            var tempCompData = {...compData};
            tempCompData.equipment[expandedEquip].maintenances.unshift(callback);
            setCompData(tempCompData);
        }

        const tempCreatingMaint = creatingMaint;
        setCreatingMaint(!tempCreatingMaint);
    }

    const viewMaintClick = (maintId, callback)=> {
        const tempViewingMaint = viewingMaint;
        setViewingMaint(maintId);

        if (callback){
            var tempCompData = {...compData};
            for (var i = 0; i < tempCompData.equipment[expandedEquip].maintenances.length; i++){
                if (tempCompData.equipment[expandedEquip].maintenances[i].id === tempViewingMaint){
                    tempCompData.equipment[expandedEquip].maintenances[i] = {...callback};
                    break;
                }
            }
            setCompData(tempCompData);
        }
    };

    const reportCallbackClick = ()=> {
        setReportCreated(false);
        setReportSaved(false);
        setCreatingReport(false);
    };

    const viewReportDetailsClick = (repId, callback)=> {
        if (callback){
            const tempCompData = (JSON.parse(JSON.stringify(compData)));
            
            
            for (var i = 0; i < tempCompData.equipment[expandedEquip].reports.length; i++){
                if (tempCompData.equipment[expandedEquip].reports[i].id === viewReport){
                    tempCompData.equipment[expandedEquip].reports[i] = {...tempCompData.equipment[expandedEquip].reports[i],...callback};
                    break;
                }
            }
            setCompData(tempCompData);
        }
        setViewReport(repId);
    };

    const expandEquipClick = async (index)=> {
        if (expandedEquip === index){
            setExpandedEquip(null);
        }else{
            setExpandedEquip(index);
        }

        const eqId = compData.equipment[index].id;
        const equipImg = compData.equipment[index].equipImg;
        var tempLoadedEqImg = {...loadedEqImg};
        
        if (tempLoadedEqImg[eqId]){
            return tempLoadedEqImg[eqId];
        }

        const imgUrl = await getImgUrl(equipImg);
        tempLoadedEqImg[eqId] = imgUrl;
        setLoadedEqImg(tempLoadedEqImg);
        
    };

    const selectTileClick = (eqId, tile)=> {
        const tempSelectedTiles = {...selectedTiles};
        tempSelectedTiles[eqId] = tile;
        setSelectedTiles(tempSelectedTiles);
    };

    const equipFilterClick = (field)=> {
        var tempEqFilter = {...eqFilter};
        if (tempEqFilter.field === field){
            tempEqFilter.reversed = !tempEqFilter.reversed;
        }else{
            tempEqFilter = {field:field, reversed:false};
        }

        const tempCompData = {...compData};

        if (field==='groupId'){
            field = 'groupName';
            tempCompData.equipment = getAllGroupNames(tempCompData.equipment,groupsData);
            console.log(tempCompData);
        }
        
        tempCompData.equipment = OrdAndFilt.order(tempCompData.equipment,field,tempEqFilter.reversed);
        
        setExpandedEquip(null);
        setCompData(tempCompData);
        setEqFilter(tempEqFilter);
    }

    useEffect(()=>{
        startData();
        // eslint-disable-next-line
    },[])

    return(
        <>

            {creatingReport &&
            <div className='modal-blurr-bk'>
                <div className='modal-body-2'>
                    <NewReportForm compId={compData.id} eqId={compData.equipment[expandedEquip].id} closeHandler={newReportClick} loadingToggle={loadingToggle}/>
                </div>
            </div>
            }

            {viewReport &&
            <div className='modal-blurr-bk'>
                <div className='modal-body-2'>
                    <ReportDetails compId={compData.id} eqId={compData.equipment[expandedEquip].id} reportId={viewReport} closeHandler={viewReportDetailsClick} loadingToggle={loadingToggle} locked={false}/>
                </div>
            </div>
            }

            {creatingMaint &&
            <div className='modal-blurr-bk'>
                <div className='modal-body-2'>
                    <NewMaint compId={compData.id} eqId={compData.equipment[expandedEquip].id} closeHandler={newMaintClick} loadingToggle={loadingToggle}/>
                </div>
            </div>
            }

            {viewingMaint &&
            <div className='modal-blurr-bk'>
                <div className='modal-body-2'>
                    <NewMaint compId={compData.id} eqId={compData.equipment[expandedEquip].id} closeHandler={viewMaintClick} loadingToggle={loadingToggle} maintId={viewingMaint}/>
                </div>
            </div>
            }

            {(reportCreated || reportSaved) &&
                <div className='modal-blurr-bk'>
                    <div className='modal-loading'>
                        <SectionContainer title={reportCreated ? 'Reporte Creado' : 'Reporte Guardado'}>
                            <div className='techLand--callback-button-container'>
                                <button className='techLand--callback-button' onClick={reportCallbackClick}>Aceptar</button>
                            </div>
                        </SectionContainer>
                    </div>
                </div>
            }

            {loadingPage && 
                <div className='modal-blurr-bk'>
                    <div className='modal-loading'>
                        <img src={loadingGif} alt='' style={loadingModalStyle}/>
                    </div>
                </div>
            }


            <NavBar companyName={compData && 'Administrador - ' + compData.companyName}/>
            {/* <NavUserModules logInLevel={0}/> */}


            <div className='home-body'>
                <div className='home-body-contents'>

                        <SectionContainer title={'Equipos - Vista Técnico'}>
                            <div className='techLand--equips-body'>

                                <div className='techLand--equip-head'>
                                    <div className='techLand--equip-button-head'>

                                    </div>
                                    <div className='techLand--equip-name-head' onDoubleClick={()=>{equipFilterClick('name')}}>
                                        Equipo&nbsp;{eqFilter.field ==='name' && <i className={eqFilter.reversed ? 'fa-regular fa-arrow-down-z-a' : 'fa-regular fa-arrow-down-a-z'}></i>}
                                    </div>
                                    <div className='techLand--equip-series-head' onDoubleClick={()=>{equipFilterClick('series')}}>
                                        No. Serie&nbsp;{eqFilter.field ==='series' && <i className={eqFilter.reversed ? 'fa-regular fa-arrow-down-z-a' : 'fa-regular fa-arrow-down-a-z'}></i>}
                                    </div>
                                    <div className='techLand--equip-area-head' onDoubleClick={()=>{equipFilterClick('area')}}>
                                        Área&nbsp;{eqFilter.field ==='area' && <i className={eqFilter.reversed ? 'fa-regular fa-arrow-down-z-a' : 'fa-regular fa-arrow-down-a-z'}></i>}
                                    </div>
                                    <div className='techLand--equip-area-head' onDoubleClick={()=>{equipFilterClick('groupId')}}>
                                        Grupo&nbsp;{eqFilter.field ==='groupId' && <i className={eqFilter.reversed ? 'fa-regular fa-arrow-down-z-a' : 'fa-regular fa-arrow-down-a-z'}></i>}
                                    </div>
                                </div>

                                <div className='techLand--equips-container'>
                                    {(compData && compData.equipment) && compData.equipment.map((eq, eqIndex)=>{return(

                                    <div key={eqIndex} className='techLand--equip-container'>
                                        <div className='techLand--equip'>
                                            <div className='techLand--equip-button' onClick={()=>{expandEquipClick(eqIndex)}}>
                                                <i className={expandedEquip === eqIndex ? 'fa-regular fa-chevron-up' : 'fa-regular fa-chevron-down'}></i>
                                            </div>
                                            <div className='techLand--equip-name'>
                                                <i className='fa-light fa-computer-classic'></i>&nbsp;{eq.name}&nbsp;
                                                {((repDetailsGetPendingReports(eq.reports) > 0 || getMaintIsOnTime(eq.maintenances, eq.maintPeriod) === false) 
                                                && <i className='fa-regular fa-circle-exclamation techLand--notice'></i>)}
                                            </div>
                                            <div className='techLand--equip-series'>
                                                {eq.series}
                                            </div>
                                            <div className='techLand--equip-area'>
                                                {eq.area}
                                            </div>
                                            <div className='techLand--equip-area'>
                                                {getGroupName(eq.groupId, groupsData)}
                                            </div>
                                        </div>


                                        <div className={expandedEquip === eqIndex ? 'techLand--equip-body visible' : 'techLand--equip-body'}>

                                            <div className='techLand--label-button-container' onClick={()=>{gotoQrClick(params, eq.id)}}>
                                                <div className='techLand--label-button'>
                                                    <i className='fa-sharp fa-light fa-qrcode techLand--qr-icon'></i>&nbsp;
                                                    Ver Info y etiqueta
                                                </div>
                                            </div>

                                            <div className='techLand--equip-details-cont'>

                                                {(eq.equipImg && eq.equipImg!== "" )? 
                                                <div className='techLand--equip-img'>
                                                    {loadedEqImg[eq.id] && <ServiceReqImg img={loadedEqImg[eq.id]} style={equipImgStyle}/>}
                                                </div>
                                                :<div className='techLand--equip-no-img'>
                                                    <i className="fa-solid fa-image-slash"></i>
                                                </div>}

                                                <div className='techLand--equip-details-body'>
                                                    <div className='techLand--equip-details-body-element'>
                                                        <div className='techLand--equip-details-name'>Nombre</div>
                                                        <div className='techLand--equip-details-value'>{eq.name}</div>
                                                    </div>
                                                    <div className='techLand--equip-details-body-element'>
                                                        <div className='techLand--equip-details-name'>Identificador Local</div>
                                                        <div className='techLand--equip-details-value'>{eq.mac}</div>
                                                    </div>
                                                    <div className='techLand--equip-details-body-element'>
                                                        <div className='techLand--equip-details-name'>Marca</div>
                                                        <div className='techLand--equip-details-value'>{eq.brand}</div>
                                                    </div>
                                                    <div className='techLand--equip-details-body-element'>
                                                        <div className='techLand--equip-details-name'>Modelo</div>
                                                        <div className='techLand--equip-details-value'>{eq.model}</div>
                                                    </div>
                                                    <div className='techLand--equip-details-body-element'>
                                                        <div className='techLand--equip-details-name'>No. Serie</div>
                                                        <div className='techLand--equip-details-value'>{eq.series}</div>
                                                    </div>
                                                    <div className='techLand--equip-details-body-element'>
                                                        <div className='techLand--equip-details-name'>Área</div>
                                                        <div className='techLand--equip-details-value'>{eq.area}</div>
                                                    </div>
                                                    <div className='techLand--equip-details-body-element'>
                                                        <div className='techLand--equip-details-name'>Sub Área</div>
                                                        <div className='techLand--equip-details-value'>{eq.subArea}</div>
                                                    </div>
                                                    <div className='techLand--equip-details-body-element'>
                                                        <div className='techLand--equip-details-name'>Preiodo Mtto</div>
                                                        <div className='techLand--equip-details-value'>{maintenancePeriodicity[eq.maintPeriod]}</div>
                                                    </div>
                                                    <div className='techLand--equip-details-body-element'>
                                                        <div className='techLand--equip-details-name'>Grupo</div>
                                                        <div className='techLand--equip-details-value'>{getGroupName(eq.groupId, groupsData)}</div>
                                                    </div>
                                                </div>
                                            </div>


                                            <div className='techLand--equip-body-tiles'>
                                                <div className={selectedTiles[eq.id]===0 ? 'techLand--equip-body-tile techLand--selected-tile': 'techLand--equip-body-tile'}
                                                onClick={()=>{selectTileClick(eq.id,0)}}>
                                                    Reportes{(repDetailsGetPendingReports(eq.reports) > 0 && <>&nbsp;&nbsp;<i className='fa-regular fa-circle-exclamation techLand--notice'></i></>)}
                                                </div>
                                                <div className={selectedTiles[eq.id]===1 ? 'techLand--equip-body-tile techLand--selected-tile': 'techLand--equip-body-tile'}
                                                onClick={()=>{selectTileClick(eq.id,1)}}>
                                                    Mantenimientos{(getMaintIsOnTime(eq.maintenances, eq.maintPeriod)===false) && <>&nbsp;&nbsp;<i className='fa-regular fa-circle-exclamation techLand--notice'></i></>}
                                                    
                                                </div>
                                            </div>


                                            {selectedTiles[eq.id]===0 &&
                                            <div className='techLand--equip-body-tile-body-report'>

                                                <div className='techLand--equip-body-report-chart'>
                                                    {eq.reports.length > 0 
                                                    ? 
                                                        <PieChartComp chartData = {repDetailsGetDonutInfo(eq.reports)}/>
                                                    :
                                                        <i className="fa-sharp fa-light fa-circle-check"></i>
                                                    }
                                                </div>
                                                
                                                <div className='techLand--equip-body-reports'>

                                                    <div className='techLand--equip-body-new-report' onClick={()=>{newReportClick()}}>
                                                        <i className="fa-sharp fa-light fa-memo-pad"></i>&nbsp;&nbsp;Crear Reporte
                                                    </div>

                                                    {(eq.reports) && eq.reports.map((report, repIndex)=>{return(
                                                    <div key={repIndex} className='maintDashAdmin--maint'>
                                                        <div className='maintDashAdmin--maint-icon'>
                                                            <i className='fa-light fa-screwdriver-wrench'></i>
                                                        </div>
                                                        <div className='maintDashAdmin--maint-details-container'>
                                                            <div className='maintDashAdmin--maint-details-title'>
                                                                Estatus:
                                                            </div>
                                                            <div className='maintDashAdmin--maint-details-body'>
                                                                {report.status}
                                                            </div>
                                                        </div>  
                                                        <div className='maintDashAdmin--maint-details-container'>
                                                            <div className='maintDashAdmin--maint-details-title'>
                                                                Fecha de Reporte:
                                                            </div>
                                                            <div className='maintDashAdmin--maint-details-body'>
                                                                {/* {showDate(report.reportedDate,'DD-MMM-YYYY')} */}
                                                                {getDate(report.reportedDate)}
                                                            </div>
                                                        </div>
                                                        <div className='maintDashAdmin--maint-details-container'>
                                                            <div className='maintDashAdmin--maint-details-title'>
                                                                Fecha fin:
                                                            </div>
                                                            <div className='maintDashAdmin--maint-details-body'>
                                                                {getDate(report.closeDate)}
                                                            </div>
                                                        </div>
                                                        <div className='maintDashAdmin--maint-details-more' onClick={()=>{viewReportDetailsClick(report.id)}}>
                                                            Ver Detalles
                                                        </div>
                                                    </div>
                                                    )})}

                                                </div>

                                            </div>
                                            }
                                            {selectedTiles[eq.id]===1 &&
                                            
                                            <div className='techLand--equip-body-tile-body-report'>

                                                
                                                {getDate(getNextMantainDate(eq.maintenances, eq.maintPeriod),'YYYY') &&
                                                <div className='techLand--maint-calendar'>
                                                    <div className='techLand--maint-calendar-title'>
                                                        Próximo Mantenimiento:
                                                    </div>
                                                    <div className={getMaintIsOnTime(eq.maintenances, eq.maintPeriod) ? 'techLand--maint-calendar-month' : 'techLand--maint-calendar-month techLand--notice'}>
                                                        {capitalize(getDate(getNextMantainDate(eq.maintenances, eq.maintPeriod),'MMMM'))}
                                                    </div>
                                                    <div className='techLand--maint-calendar-year'>
                                                        {getDate(getNextMantainDate(eq.maintenances, eq.maintPeriod),'YYYY')}
                                                    </div>
                                                </div>
                                                }
                                                {!getDate(getNextMantainDate(eq.maintenances, eq.maintPeriod),'YYYY') &&
                                                <div className='techLand--maint-calendar'>
                                                    <div className='techLand--maint-calendar-title'>
                                                        No Hay Registros
                                                    </div>
                                                    <div className='techLand--maint-calendar-month'>
                                                        <i className="fa-light fa-calendar-xmark"></i>
                                                    </div>
                                                    <div className='techLand--maint-calendar-year'></div>
                                                </div>
                                                }


                                            

                                                <div className='techLand--equip-body-reports'>

                                                    <div className='techLand--equip-body-new-maint' onClick={()=>{newMaintClick()}}>
                                                        <i className="fa-sharp fa-light fa-memo-pad"></i>&nbsp;&nbsp;Registrar Mantenimiento
                                                    </div>

                                                    {eq.maintenances && eq.maintenances.map((maint, maintIndex)=>{return(
                                                        <div key={maintIndex} className='maintDashAdmin--maint'>
                                                            <div className='maintDashAdmin--maint-icon'>
                                                                <i className='fa-light fa-screwdriver-wrench'></i>
                                                            </div>
                                                            <div className='maintDashAdmin--maint-details-container'>
                                                                <div className='maintDashAdmin--maint-details-title'>
                                                                    Estatus:
                                                                </div>
                                                                <div className='maintDashAdmin--maint-details-body'>
                                                                    {maint.maintStatus}
                                                                </div>
                                                            </div>  
                                                            <div className='maintDashAdmin--maint-details-container'>
                                                                <div className='maintDashAdmin--maint-details-title'>
                                                                    Fecha de Cierre:
                                                                </div>
                                                                <div className='maintDashAdmin--maint-details-body'>
                                                                    {getDate(maint.closeDate)}
                                                                </div>
                                                            </div>
                                                            <div className='maintDashAdmin--maint-details-container'>
                                                                <div className='maintDashAdmin--maint-details-title'>
                                                                    {/* Fecha de Creación: */}
                                                                </div>
                                                                <div className='maintDashAdmin--maint-details-body'>
                                                                    {/* {getDate(maint.createdDate)} */}
                                                                </div>
                                                            </div>
                                                            <div className='maintDashAdmin--maint-details-more' onClick={()=>{viewMaintClick(maint.id)}}>
                                                                Ver Detalles
                                                            </div>
                                                        </div>
                                                    )})
                                                    }
                                                </div>

                                            </div>
                                            
                                            }

                                        </div>
                                    </div>
                                    )})
                                    }
                                </div>

                            </div>

                        </SectionContainer>

                </div>                
            </div>
        </>
    )
}
