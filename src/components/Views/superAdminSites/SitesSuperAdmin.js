import React, {useState, useEffect} from 'react';
import { NavBar } from '../../Misc/navBar/NavBar';
import loadingGif from '../../../img/loading.gif';
import { loadingModalStyle } from '../../../scripts/consts';
import { checkLog } from '../../../scripts/auth';

import { SitesSAStartData, getAllHospisNotInGroup, getSiteData, siteAddressFields, siteAddressFieldsEsp } from './Scripts';

import { SectionContainer } from '../../Misc/sectionContainer/SectionContainer';
import { createOrUpdate } from '../../../scripts/updates';
export const SitesSuperAdmin = () => {

    const [loadingPage, setLoadingPage] = useState(true);
    const [sitesData, setSitesData] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [selectedGroupInfo, setSelectedGroupInfo] = useState(null);
    const [allHospis, setAllHospis] = useState(null);
    const [creatingGroup, setCreatingGroup] = useState(false);
    const [creatingGroupVal, setCreatingGroupVal] = useState('');
    const [creatingGroupValL, setCreatingGroupValL] = useState('');
    const [hoverGroupEle, setHoverGroupEle] = useState(null);
    const [editingGroupEle, setEditingGroupEle] = useState(null);
    const [editingGroupEleVal, setEditingGroupEleVal] = useState(null);
    const [expandedHospi, setExpandedHospi] = useState(null);
    const [hoverElement, setHoverElement] = useState(null);
    const [editingElement, setEditingElement] = useState(null);
    const [editingElementVal, setEditingElementVal] = useState(null);
    const [creatingHospi, setCreatingHospi] = useState(false);
    const [creatingHospiVal, setCreatingHospiVal] = useState(null);
    const [addingExistingHospi, setAddingExistingHospi] = useState(false);
    const [addingExistingHospiVal, setAddingExistingHospiVal] = useState('');

    document.addEventListener('keydown', (event) => {
        // event.preventDefault();
        var name = event.key;
        // var code = event.code;
        if (name === 'Escape'){
            if(editingElement !== null){
                cancelEditingAddress();
            }
        }

        // if (name === 'Enter'){
        //     if(editingElement !== null){
        //         saveEditingCompany();
        //     }
        // }



    }, false);

    const userIsLoggedCheck = ()=> {
        const logInfo = checkLog(true);
        if (!logInfo) {
            window.location = '/';
        }
    };


    const getData = async ()=> {
        const logInfo = checkLog(true);
        if (logInfo.split(':')[1]*1 !== 0){
            window.location = '/';
        }
        const tempSitesData = await SitesSAStartData();
        setSitesData(tempSitesData);
        setLoadingPage(false);
    }
    
    const changeGroup = async (index)=> {
        userIsLoggedCheck();
        const value = index;
        
        setSelectedGroup(value);
        if (value === '') {
            setSelectedGroupInfo(null);
            return;
        }

        setLoadingPage(true);
        setExpandedHospi(null);
        const compStr = (!sitesData[value].companiesStr) ? null : [...sitesData[value].companiesStr.split(',')];
        getSiteData(compStr).then((tempCompaniesData)=>{
            setSelectedGroupInfo(tempCompaniesData);
            setLoadingPage(false);
        })
    }

    const createGroupClick = async ()=> {
        userIsLoggedCheck();
        if (!creatingGroupVal || creatingGroupVal === ''){
            const element = document.getElementById('creategroupname');
            element.classList.add('sitesSA--required');
            return;
        }

        if (!creatingGroupValL || (1*creatingGroupValL)<1) {
            const element = document.getElementById('creategrouplimit');
            element.classList.add('sitesSA--required');
            return;
        }

        setLoadingPage(true);

        var tempGroup = {
            name: creatingGroupVal,
            active: 'Y',
            companyLimit:creatingGroupValL

        }

        createOrUpdate(tempGroup, 'group').then((doc)=>{
            tempGroup.id = doc.id;
            let tempSitesData = [...sitesData];
            tempSitesData.push(tempGroup);
            setSitesData(tempSitesData);
            setCreatingGroup(false);
            setCreatingGroupVal('');
            setCreatingGroupValL('');
            setLoadingPage(false);
        }).catch((er)=>{
            console.log(er);
        });

    }

    const cancelCreatingGroup = ()=> {
        setCreatingGroup(false);
        setCreatingGroupVal('');
        setCreatingGroupValL('');
    }

    const editGroupEleClick = (element)=> {
        setEditingGroupEle(element);
        setEditingGroupEleVal(sitesData[selectedGroup][element]);
    }

    const saveEditGroupEle = async ()=> {
        userIsLoggedCheck();
        if (!editingGroupEleVal || editingGroupEleVal === ''){
            return;
        }
        setLoadingPage(true);
        let tempGroupData = {...sitesData[selectedGroup]};
        tempGroupData[editingGroupEle] = editingGroupEleVal;
        const groupId = tempGroupData.id;
        delete tempGroupData.id;

        createOrUpdate(tempGroupData, 'group', groupId).then(()=>{
            const tempSitesData = [...sitesData];
            tempGroupData.id = groupId;
            tempSitesData[selectedGroup] = tempGroupData;

            setSitesData(tempSitesData);
            setEditingGroupEle(false);
            setLoadingPage(false);
        }).catch((er)=>{
            console.log(er);
        })
    }

    const groupActiveClick = async ()=>{
        // setLoadingPage(true);
        var tempGroupData = {...sitesData[selectedGroup]};
        tempGroupData.active = tempGroupData.active === 'Y' ? 'N' : 'Y';
        var groupId = tempGroupData.id;
        delete tempGroupData.id;
        createOrUpdate(tempGroupData, 'group', groupId).then(()=>{
            tempGroupData.id = groupId;
            const tempSitesData = [...sitesData];
            tempSitesData[selectedGroup] = tempGroupData;

            setSitesData(tempSitesData);
            setLoadingPage(false);
        }).catch((er)=>{
            console.log(er);
            
        })

    }

    const expandHospi = (index)=> {
        if (index === expandedHospi){
            setExpandedHospi(null);
        }else{
            setExpandedHospi(index);
        }
    }

    const hoverOnField = (name, index)=>{
        setHoverElement({name:name, index:index});
    };

    const deHoverOnField = ()=> {
        setHoverElement(null);
    };

    const enterEditingAddress = (attributeName)=>{
        setEditingElement(attributeName);
        setEditingElementVal(selectedGroupInfo[expandedHospi][attributeName]);
    };

    const cancelEditingAddress = ()=> {
        setEditingElement(null);
        setEditingElementVal(null);
    };

    const saveEditingCompany = async ()=> {
        userIsLoggedCheck();
        const companyId = selectedGroupInfo[expandedHospi].id;
        var tempCompInfo = {...selectedGroupInfo[expandedHospi]}
        tempCompInfo[editingElement] = editingElementVal;
        delete tempCompInfo.id;

        setLoadingPage(true);
        createOrUpdate(tempCompInfo, 'company', companyId).then(()=>{
            tempCompInfo.id = companyId;
            let tempSelectedGInfo = JSON.parse(JSON.stringify(selectedGroupInfo));
            tempSelectedGInfo[expandedHospi] = {...tempCompInfo};
            
            setSelectedGroupInfo(tempSelectedGInfo);
            cancelEditingAddress();
            setLoadingPage(false);
            }
        ).catch((er)=>{
            console.log(er);
        });
    }

    const newHospiClick = ()=> {
        if(!creatingHospi) {
            setCreatingHospiVal({
                companyName:'',
                street: '',
                number: '',
                col: '',
                city: '',
                state: '',
                cP: '',
                tel: '',
            });
            
        }else{
            setCreatingHospiVal(null);
        }
        setCreatingHospi(!creatingHospi);
        cancelEditingAddress();
        setExpandedHospi(null);
    }

    const newExistingHospiClick = async ()=> {
        setLoadingPage(true);

        const currentHospis = [...selectedGroupInfo];

        getAllHospisNotInGroup(currentHospis).then((tempAllHospis)=>{
            setAllHospis(tempAllHospis);
            setLoadingPage(false);
            setAddingExistingHospi(true);
        }).catch((er)=>{
            console.log(er);
        })
    }

    const saveAddingExisting = async () => {
        userIsLoggedCheck();
        if (!addingExistingHospiVal || addingExistingHospiVal === ''){
            return;
        }
        setLoadingPage(true);
        
        const tempSitesData = [...sitesData];
        tempSitesData[selectedGroup].companiesStr = tempSitesData[selectedGroup].companiesStr ? tempSitesData[selectedGroup].companiesStr + ',' + allHospis[addingExistingHospiVal].id : allHospis[addingExistingHospiVal].id;

        var tempSelectedGroup = {...sitesData[selectedGroup]}
        const tempGroupId = tempSelectedGroup.id;
        delete  tempSelectedGroup.id;

        createOrUpdate(tempSelectedGroup, 'group', tempGroupId).then(()=>{

            setSitesData(tempSitesData);
            setLoadingPage(false);
            setAddingExistingHospi(false);
            setAddingExistingHospiVal(null);
            changeGroup(selectedGroup);
        })



    }

    const editCreatingHospi = (attributeName, e)=> {
        const value = e.target.value;
        const tempCreatingHospiVal = {...creatingHospiVal};
        tempCreatingHospiVal[attributeName] = value;
        const element = document.getElementById('newhospi-'+attributeName);
        element.classList.remove('sitesSA--required');

        setCreatingHospiVal(tempCreatingHospiVal);
        
    }

    const saveNewHospi = async ()=> {
        userIsLoggedCheck();
        const keys = Object.keys(creatingHospiVal);
        
        let allOk = true;
        for (let i = 0; i < keys.length; i++) {
            if(!creatingHospiVal[keys[i]] || creatingHospiVal[keys[i]]==='' || creatingHospiVal[keys[i]]===null) {
                const elementId = 'newhospi-'+keys[i];
                const element = document.getElementById(elementId);
                element.classList.add('sitesSA--required');
                allOk = false;
            }
        }
   
        if (!allOk){
            return;
        }

        setLoadingPage(true);

        let tempHospitalVal = {...creatingHospiVal};
        tempHospitalVal.active = 'Y';

        createOrUpdate(tempHospitalVal, 'company').then((doc)=>{
            const compId = doc.id;
            let tempSelectedGroupInfo = [...selectedGroupInfo];
            tempHospitalVal.id = compId;
            tempSelectedGroupInfo.push(tempHospitalVal);

            let tempSiteData = {...sitesData[selectedGroup]};
            tempSiteData.companiesStr = (!tempSiteData.companiesStr || tempSiteData.companiesStr === '') ? doc.id : tempSiteData.companiesStr  +  ',' + doc.id;
            const groupId = tempSiteData.id;
            delete tempSiteData.id;

            console.log(groupId, tempSiteData)

            createOrUpdate(tempSiteData, 'group', groupId).then(()=>{
                
                let tempSitesData = [...sitesData];
                tempSitesData[selectedGroup] = {...tempSiteData};
                setSitesData(tempSitesData);
                setSelectedGroupInfo(tempSelectedGroupInfo);
                newHospiClick();
                setLoadingPage(false);

            }).catch((er)=>{
                console.log(er);
            })
            
            

        }).catch((er)=>{
            console.log(er);
        })

    }
    
    useEffect(()=>{
        getData();
        // eslint-disable-next-line
    },[]);

    return( 
        <>
            {loadingPage && 
            <div className='modal-blurr-bk'>
                <div className='modal-loading'>
                    <img src={loadingGif} alt='' style={loadingModalStyle}/>
                </div>
            </div>
            }
        
            <NavBar companyName={'Administrador'}/>

            <div className='home-body'>
                <div className='home-body-contents'>
                    <div className='sitesSA--body'>
                        <SectionContainer title='Grupos Hospitalarios'>
                            <div className='sitesSA--groups-container'>
                                {sitesData && sitesData.map((group, groupIndex)=>{return(
                                    <div className={selectedGroup === groupIndex ? 'sitesSA--group-card selected' : 'sitesSA--group-card'} onClick={()=>{changeGroup(groupIndex)}}>
                                        <i className={group.active === 'Y' ? 'fa-light fa-hospital sitesSA--group-card-icon sitesSA-green' : 'fa-light fa-hospital sitesSA--group-card-icon sitesSA-red'}></i>
                                        <div className='sitesSA--group-card-name'>
                                            {group.name}
                                        </div>
                                        <div className='sitesSA--group-card-count'>
                                            {group.companiesStr ? 'Hospitales: ' + group.companiesStr.split(',').length : 'Hospitales: ' + 0}
                                        </div>
                                    </div>
                                )})}
                                {!creatingGroup &&
                                <div className='sitesSA--group-card-add' onClick={(e)=>{setCreatingGroup(true)}}>
                                    <i className='fa-regular fa-plus'></i>
                                </div>
                                }
                            </div>
                            {creatingGroup &&
                            <div className='sitesSA--creating-group-container'>
                                <div className='sitesSA--creating-group-container-1row'>
                                    <div className='sitesSA--creating-group-text'>
                                        <div>Crear Grupo:</div>
                                        <i className='fa-regular fa-xmark sitesSA--creating-group-cancelx' onClick={cancelCreatingGroup}></i>
                                    </div>
                                    <input id='creategroupname' placeholder='Nombre' className='sitesSA--create-group-input' type='text' value={creatingGroupVal} onChange={(e)=>{setCreatingGroupVal(e.target.value)}}></input>
                                    <input id='creategrouplimit' placeholder='Límite Hospitales' className='sitesSA--create-group-input' type='number' value={creatingGroupValL} onChange={(e)=>{setCreatingGroupValL(e.target.value)}}></input>
                                </div>
                                <div className='sitesSA--creating-group-container-2row'>
                                    <button className='sitesSA--cancel-create-group' onClick={cancelCreatingGroup}>Cancelar</button>
                                    <button className='sitesSA--create-group' onClick={createGroupClick}>Crear</button>
                                </div>
                            </div>
                            }
                        </SectionContainer>

                        {selectedGroupInfo &&
                        <SectionContainer title={'Detalles Grupo: ' + sitesData[selectedGroup].name}>
                            <div className='sitesSA--hospis-container'>

                                <div className='sitesSA--hospis-group-data-container'>
                                    <div className='sitesSA--hospis-group-data-name-item'>
                                        <div className='sitesSA--hospis-group-data-name-tag'>
                                            Nombre:
                                        </div>
                                        {editingGroupEle !== 'name' &&
                                        <div className='sitesSA--hospis-group-data-name-val'  onMouseEnter={()=>{setHoverGroupEle('name')}} onMouseLeave={()=>{setHoverGroupEle(null)}}>
                                            {sitesData[selectedGroup].name} {hoverGroupEle === 'name' && <i className='fa-light fa-pencil' onClick={()=>{editGroupEleClick('name')}}></i>}
                                        </div>
                                        }
                                        {editingGroupEle === 'name' &&
                                        <div className='sitesSA--hospis-group-data-name-edit'>
                                            <input value={editingGroupEleVal} onChange={(e)=>{setEditingGroupEleVal(e.target.value)}} type='text' className='sitesSA--hospis-group-data-name-input'></input>
                                            <i className='fa-solid fa-check sitesSA--hospis-group-data-edit-icon sitesSA--green' onClick={saveEditGroupEle}></i>
                                            <i className='fa-solid fa-xmark sitesSA--hospis-group-data-edit-icon sitesSA--red' onClick={()=>{setEditingGroupEle(false)}}></i>
                                        </div>
                                        }
                                    </div>

                                    <button className={sitesData[selectedGroup].active === 'Y' ? 'sitesSA--hospis-group-data-active' : 'sitesSA--hospis-group-data-inactive'} onClick={groupActiveClick}>
                                        {sitesData[selectedGroup].active === 'Y' ? 'Activo' : 'Inactivo'}
                                    </button>

                                    <div className='sitesSA--hospis-group-data-name-item'>
                                        <div className='sitesSA--hospis-group-data-name-tag'>
                                            Lim Hosp: 
                                        </div>

                                        {editingGroupEle !== 'companyLimit' &&
                                        <div className='sitesSA--hospis-group-data-name-val' onMouseEnter={()=>{setHoverGroupEle('companyLimit')}} onMouseLeave={()=>{setHoverGroupEle(null)}}>
                                            {sitesData[selectedGroup].companyLimit} {hoverGroupEle === 'companyLimit' && <i className='fa-light fa-pencil' onClick={()=>{editGroupEleClick('companyLimit')}}></i>}
                                        </div>
                                        }
                                        {editingGroupEle === 'companyLimit' &&
                                        <div className='sitesSA--hospis-group-data-name-edit'>
                                            <input value={editingGroupEleVal} onChange={(e)=>{setEditingGroupEleVal(e.target.value)}} type='number' className='sitesSA--hospis-group-data-name-input'></input>
                                            <i className='fa-solid fa-check sitesSA--hospis-group-data-edit-icon sitesSA--green' onClick={saveEditGroupEle}></i>
                                            <i className='fa-solid fa-xmark sitesSA--hospis-group-data-edit-icon sitesSA--red' onClick={()=>{setEditingGroupEle(false)}}></i>
                                        </div>
                                        }
                                    </div>

                                </div>
                                <div className='sitesSA-hospis-text-title'>
                                    Hospitales:
                                </div>
                                {(!sitesData[selectedGroup].companiesStr || sitesData[selectedGroup].companiesStr.split(',').length < sitesData[selectedGroup].companyLimit*1) &&
                                <div className='sitesSA--new-hospi-button-container'>
                                    {(!creatingHospi && !addingExistingHospi) && <button className='sitesSA--new-hospi' onClick={newHospiClick}>Agregar Nuevo</button>}
                                    {(!creatingHospi && !addingExistingHospi) && <button className='sitesSA--new-hospi' onClick={newExistingHospiClick}>Agregar Existente</button>}
                                    {creatingHospi && <button className='sitesSA--new-hospi' onClick={newHospiClick}>Cancelar</button>}
                                    {creatingHospi && <button className='sitesSA--new-hospi-save' onClick={saveNewHospi}>Crear</button>}
                                    {addingExistingHospi && <button className='sitesSA--new-hospi' onClick={()=>{setAddingExistingHospi(false)}}>Cancelar</button>}
                                    {(addingExistingHospi && addingExistingHospiVal!=='') && <button className='sitesSA--add-existing-save' onClick={saveAddingExisting}>Agregar</button>}
                                </div>
                                }

                                {creatingHospi &&
                                <div className='sitesSA--hospi-creating-form'>
                                    {siteAddressFields.map((addressItem, addressItemIndex)=>{return(
                                    <div key={'hc' + addressItemIndex} className='sitesSA--site-card-address-form-ele'>
                                        <div className='sitesSA--site-card-address-form-name'>
                                            {siteAddressFieldsEsp[addressItemIndex]+':'}
                                        </div>
                                        <div id={'newhospi-' + addressItem} className='sitesSA--site-card-address-form-value-creating'>
                                            <input value={creatingHospiVal[addressItem]} className='sitesSA--site-card-address-form-value-input' type='text' onChange={(e)=>{editCreatingHospi(addressItem,e)}}></input>
                                        </div>
                                    </div>  
                                    )})}
                                </div>
                                }
                                {(addingExistingHospi && allHospis) &&
                                    <div className='sitesSA--add-exisitng-hospi-container'>
                                        <select className='sitesSA--add-exising-selector' value={addingExistingHospiVal} onChange={(e)=>{setAddingExistingHospiVal(e.target.value)}}>
                                            <option value={''}>Seleccionar</option>
                                            {allHospis.map((hosp, hospIndex)=>{return(
                                                <option key={'addexis-'+hospIndex} value={hospIndex}>{hosp.companyName}</option>
                                            )})}
                                        </select>
                                    </div>
                                }

                                {selectedGroupInfo.map((hospi, hospiIndex)=>{return(

                                <div className='sitesSA--hospi-container'>
                                    <div className='sitesSA--hospi-card-head'>
                                        <div className='sitesSA--hospi-card-exp-icon'>
                                            <i className={expandedHospi === hospiIndex ? 'fa-regular fa-chevron-up' : 'fa-regular fa-chevron-down'} onClick={()=>{expandHospi(hospiIndex)}}></i>
                                        </div>
                                        <div className='sitesSA--hospi-card-name'>
                                            {hospi.companyName}
                                        </div>
                                    </div>

                                    <div className={expandedHospi===hospiIndex ? 'sitesSA--site-card-body visible' : 'sitesSA--site-card-body'}>
                                        <div className='sitesSA--site-card-address'>
                                            <div className='sitesSA--site-card-address-title'>
                                                Datos:
                                            </div>
                                            <div className='sitesSA--site-card-address-form'>

                                                {siteAddressFields.map((addressItem, addressItemIndex)=>{return(
                                                    <div className='sitesSA--site-card-address-form-ele' key={'ed' + addressItemIndex}>
                                                        <div className='sitesSA--site-card-address-form-name'>
                                                            {siteAddressFieldsEsp[addressItemIndex]+':'}
                                                        </div>
                                                        {editingElement === addressItem ?
                                                            <div className='sitesSA--site-card-address-form-value-editing'>
                                                                <input className='sitesSA--site-card-address-form-value-input' type='text' value={editingElementVal} onChange={(e)=>{setEditingElementVal(e.target.value)}}></input>
                                                                <i className='fa-solid fa-check sitesSA--site-card-address-form-value-check-icon' onClick={saveEditingCompany}></i>
                                                                <i className='fa-solid fa-xmark sitesSA--site-card-address-form-value-cancel-icon' onClick={cancelEditingAddress}></i>
                                                            </div>
                                                        :
                                                            <>
                                                            {(hoverElement && hoverElement.name === addressItem && hoverElement.index === hospiIndex) ?
                                                                <div className='sitesSA--site-card-address-form-value-hovering' onMouseLeave={()=>{deHoverOnField()}} onDoubleClick={()=>{enterEditingAddress(addressItem)}}>
                                                                    {hospi[addressItem]}
                                                                    <i className='fa-light fa-pencil sitesSA--site-card-address-form-value-editing-icon' onClick={()=>{enterEditingAddress(addressItem)}}></i>
                                                                </div>
                                                            :
                                                                <div className='sitesSA--site-card-address-form-value' onMouseEnter={()=>{hoverOnField(addressItem, hospiIndex)}}>
                                                                    {hospi[addressItem]}
                                                                </div>
                                                            
                                                                                                                    
                                                            }
                                                            </>
                                                        }
                                                    </div> 
                                                )})}

                                                </div>
                                        </div>  
                                    </div>
                                </div>
                                )})}
                            </div>
                        </SectionContainer>
                        }
                    </div>
                </div>
            </div>
        </>
    );
};
