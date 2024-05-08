import React, {useState, useEffect} from 'react';
import { NavBar } from '../../Misc/navBar/NavBar';
import loadingGif from '../../../img/loading.gif';
import { loadingModalStyle } from '../../../scripts/consts';

import { SectionContainer } from '../../Misc/sectionContainer/SectionContainer';
import { ServiceReqImg } from '../../Misc/imgComponents/ServiceReqImg';
import { checkLog, encryptURL } from '../../../scripts/auth';
import { OrdAndFilt } from '../../../scripts/utils';
import { createOrUpdate } from '../../../scripts/updates';
import { startFilterByObject, sitesEquipAdminGroupData, sitesEquipAdminStartData, sitesEquipAdminGetUData, sitesEquipAdminRetValFromArr, siteEquipFields, siteEquipFieldsEsp, maintenancePeriodicity, equipImgStyle } from './Scripts';
import { uploadImg, getImgUrl, deleteFile } from '../../../scripts/files';

export const SitesEquipmentAdmin = () => {

    const [selectedEquipLabel, setSelectedEquipLabel] = useState({});
    const [logInLevel, setLogInLevel] = useState(null);
    const [loadingPage, setLoadingPage] = useState(true);
    const [loadingImg, setLoadingImg] = useState(false);
    const [loadingImgVal, setLoadingImgVal] = useState(null);
    const [siteData, setSiteData] = useState(null);
    const [siteDataOg, setSiteDataOg] = useState(null);
    // const [groupFilter, setGorupFilter] = useState(null);
    const [groupData, setGroupData] = useState(null);
    const [uData, setUData] = useState(null);
    const [filterBy, setFilterBy] = useState(null);
    const [expandedComp, setExpandedComp] = useState(null);
    const [expandedEquip, setExpandedEquip] = useState([]);
    const [addingEquip, setAddingEquip] = useState(false);
    const [addingEquipVal, setAddingEquipVal] = useState(null);
    const [addingEquipImgVal, setAddingEquipImgVal] = useState(null);
    const [addingImgSizeExceded, setAddingImgSizeExceded] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState(false);
    const [hoveredEquipField, setHoveredEquipField] = useState(null);
    const [editingEquipField, setEditingEquipField] = useState(null);
    const [editingEquipFieldVal, setEditingEquipFieldVal] = useState(null);
    const [eqImgUrl, setEqImgUrl] = useState({});
    // const [eqImg, setEqImg] = useState(null);
    const [hoveredImg, setHoveredImg] = useState(null);
    


    document.addEventListener('keydown', (event) => {
        // event.preventDefault();
        var name = event.key;
        if (name === 'Escape'){
            if(editingEquipField !== null){
                cancelEditingEquipField();
            }
        }
    }, false);

    const getData = async ()=> {

        const logInfo = checkLog(true);
        if (!logInfo) {
            window.location = '/';
        }
        const groupId = logInfo.split(':')[0];
        const logLevel = logInfo.split(':')[1]*1;
        if (logLevel > 1){
            window.location = '/';
        }

        setLogInLevel(logLevel);
        
        const tempGoupData = await sitesEquipAdminGroupData();
        const tempData = await sitesEquipAdminStartData(groupId);
        const tempUData = await sitesEquipAdminGetUData(tempData.companies);
        const filterByVar = startFilterByObject(tempData.companies.length);

        setUData(tempUData);
        setSiteData(tempData);
        setSiteDataOg(JSON.parse(JSON.stringify(tempData)));
        setGroupData(tempGoupData);
        setFilterBy(filterByVar);
        setLoadingPage(false);
    };

    const labelEquipSelected = (compId, equipId)=> {
        const tempSelectedEquipLabel = {...selectedEquipLabel};
        if (!tempSelectedEquipLabel[compId]) {
            tempSelectedEquipLabel[compId] = {};
        }
        if (!tempSelectedEquipLabel[compId][equipId]) {
            tempSelectedEquipLabel[compId][equipId] = true;
        }else{
            tempSelectedEquipLabel[compId][equipId] = !tempSelectedEquipLabel[compId][equipId];
        }
        
        setSelectedEquipLabel(tempSelectedEquipLabel);
        
    }

    const selectAllLabelClick = (compId)=> {
        const checkBox = document.getElementById('labels-' + compId + '-all');
        const tempSelectedEquipLabel = {...selectedEquipLabel};
        var tempEquipment = null;
        
        for (var i = 0; i < siteData.companies.length; i++){
            if (siteData.companies[i].id === compId) {
                tempEquipment = [...siteData.companies[i].equipment];
                break;
            }
        }

        if (!tempSelectedEquipLabel[compId]) {
            tempSelectedEquipLabel[compId] = {};
        }

        for (var i = 0; i < tempEquipment.length; i++){
            tempSelectedEquipLabel[compId][tempEquipment[i].id] = checkBox.checked;
        }
        
        setSelectedEquipLabel(tempSelectedEquipLabel);

    }

    const goToLabels = ()=> {
        const url = encryptURL(JSON.stringify(selectedEquipLabel));
        console.log(url);
        window.location = '/lp/' + url;
        
    }

    const expandCompClick = (index)=> {
        setExpandedGroups(false);
        setExpandedEquip([]);
        setEditingEquipField(null);
        setEditingEquipFieldVal(null);
        setHoveredImg(null);
        setHoveredEquipField(null);

        if (expandedComp === index){
            setExpandedComp(null);
            if(addingEquip){
                setAddingEquip(false);
                var tempSiteData = JSON.parse(JSON.stringify(siteData));
                tempSiteData.companies[[expandedComp]].equipment.pop();
                setSiteData(tempSiteData);
            }
        }else{
            setExpandedComp(index);
        }
    };

    const getEquipImgUrl = async (equipIndex)=> {   
        const compId = siteData.companies[expandedComp].id;
        const equipId = siteData.companies[expandedComp].equipment[equipIndex].id;
        const tempEquipImg = siteData.companies[expandedComp].equipment[equipIndex].equipImg;

        if (tempEquipImg === null || tempEquipImg === undefined || tempEquipImg === '' || ! tempEquipImg){
            return;
        }
        
        var tempEqImgUrl = {...eqImgUrl};

        if (tempEqImgUrl[compId]){
            if(tempEqImgUrl[compId][equipId]) {
                return tempEqImgUrl[compId][equipId];
            }
        }else if (!tempEqImgUrl[compId]){
        
            tempEqImgUrl[compId] = {};
            tempEqImgUrl[compId][equipId] = null;
        }

        const imgURL = await getImgUrl(tempEquipImg);
        if (imgURL) {
            tempEqImgUrl[compId][equipId] = imgURL;
        }
        setEqImgUrl(tempEqImgUrl);
    };

    const filterByClick = (field, index)=> {
        var tempFilterBy = {...filterBy};
        if (tempFilterBy[index].field === field) {
            tempFilterBy[index].reversed = !tempFilterBy[index].reversed;
        }else{
            tempFilterBy[index].field = field;
            tempFilterBy[index].reversed = false;
        }
    
        var tempSiteData = {...siteData};
        tempSiteData.companies[index].equipment = OrdAndFilt.order(tempSiteData.companies[index].equipment,field, tempFilterBy[index].reversed);

        setSiteData(tempSiteData);
        setFilterBy(tempFilterBy);

        setExpandedEquip([]);
        setEditingEquipField(null);
        setEditingEquipFieldVal(null);
        setHoveredImg(null);
        setHoveredEquipField(null);
        window.getSelection().removeAllRanges();
    }

    const groupFilterClick = (groupId, compIndex)=> {
        var tempSiteData = JSON.parse(JSON.stringify(siteDataOg));
        if (groupId === 'all') {
            tempSiteData.companies[compIndex].equipment = [...OrdAndFilt.order(tempSiteData.companies[compIndex].equipment, filterBy[compIndex].field, filterBy[compIndex].reversed)];
        }else{
            var temp = OrdAndFilt.filter(tempSiteData.companies[compIndex].equipment, 'groupId', groupId);
            tempSiteData.companies[compIndex].equipment = [...OrdAndFilt.order(temp, filterBy[compIndex].field, filterBy[compIndex].reversed)];
        }        

        setSiteData(tempSiteData);

        setExpandedEquip([]);
        setEditingEquipField(null);
        setEditingEquipFieldVal(null);
        setHoveredImg(null);
        setHoveredEquipField(null);

    }

    const expandEquipClick = async (index)=> {
        var tempArr = [...expandedEquip];

        if (tempArr.includes(index)){
            const element = tempArr.indexOf(index);

            if (element > -1) {
                tempArr.splice(element, 1);
                if (editingEquipField && editingEquipField.equipIndex === index) {
                    setEditingEquipField(null);
                    setEditingEquipFieldVal(null);
                }
             }
             setExpandedEquip(tempArr);
        }else{
            tempArr.push(index);
            setExpandedEquip(tempArr);
            await getEquipImgUrl(index);
        }
    };

    // const expandGroups = () => {
    //     setExpandedGroups(!expandedGroups);
    // };
    
    const hoverOnEquipField = (equipIndex, equipField)=> {
        const temp = {
            equipIndex:equipIndex,
            equipField:equipField,
        }
        setHoveredEquipField(temp);
    };

    const deHoverOnEquipField = ()=> {
        setHoveredEquipField(null);
    };

    const hoverOnImage = (equipIndex)=> {

        if (equipIndex === null) {            
            setHoveredImg(equipIndex);
            return;
        } 

        const equipId = siteData.companies[expandedComp].equipment[equipIndex].id;
        const equipImg = siteData.companies[expandedComp].equipment[equipIndex].equipImg ?? null;

        if (equipId === 'temp' && (!addingEquipImgVal || !addingEquipImgVal.fileUrl)){
            return;
        }

        if (equipId !== 'temp' && !equipImg){
            return;
        }

        setHoveredImg(equipIndex);
    };

    
    const editEquipFieldClick = async (equipIndex, equipField)=> {

        const setEditingPromise = async (val)=> {
            setEditingEquipField(val);
        }

        const temp = {
            equipIndex:equipIndex,
            equipField:equipField,
        }

        const value = siteData.companies[expandedComp].equipment[equipIndex][equipField];

        setEditingPromise(temp).then(()=>{
            const ele = document.getElementById(equipIndex+'-'+equipField);
            ele.focus({preventScroll:true});
        });

        setEditingEquipFieldVal(value);
    };

    const cancelEditingEquipField = ()=> {
        setEditingEquipField(null);
        setEditingEquipFieldVal(null);
    };

    const saveEditingField = async (equipIndex, field)=> {

        if(editingEquipFieldVal === null || editingEquipFieldVal === '' || editingEquipFieldVal === undefined){
            const element = document.getElementById(equipIndex+'-'+field);
            element.classList.add('siteEquipAdmin-required');
            
            return;
        }

        if (siteData.companies[expandedComp].equipment[equipIndex][field] === editingEquipFieldVal) {
            setEditingEquipField(null);
            setEditingEquipFieldVal(null);
            setHoveredImg(null);
            setHoveredEquipField(null);
            return;
        }

        setLoadingPage(true);
        
        var tempSiteData = JSON.parse(JSON.stringify(siteData));
        var tempSiteDataOg = JSON.parse(JSON.stringify(siteDataOg));
        const equipId = tempSiteData.companies[expandedComp].equipment[equipIndex].id;
        const compId = tempSiteData.companies[expandedComp].id;
        const prevGroupId = tempSiteData.companies[expandedComp].equipment[equipIndex].groupId;
        var equipData = {...tempSiteData.companies[expandedComp].equipment[equipIndex]};
        equipData[field] = editingEquipFieldVal;
        var equipDataToUpload = JSON.parse(JSON.stringify(equipData));
        delete equipDataToUpload.id;

        for (var i = 0; i < tempSiteDataOg.companies[expandedComp].equipment.length; i++){
            if(tempSiteDataOg.companies[expandedComp].equipment[i].id === equipId){
                tempSiteDataOg.companies[expandedComp].equipment[i] = equipData;
                break;
            }
        };

        tempSiteData.companies[expandedComp].equipment[equipIndex] = equipData;

        createOrUpdate(equipDataToUpload, 'company/' + compId + '/equipment', equipId).then(()=>{

            
            setSiteData(JSON.parse(JSON.stringify(tempSiteData)));
            setSiteDataOg(JSON.parse(JSON.stringify(tempSiteDataOg)));
            setEditingEquipField(null);
            setEditingEquipFieldVal(null);
            setHoveredImg(null);
            setHoveredEquipField(null);
            setLoadingPage(false);

        }).catch((er)=>{
            console.log(er);
        });

    };

    const newImgClick = (e, equipIndex)=> {
        e.preventDefault();

        const editing = {
            equipIndex:equipIndex,
            equipField:'equipImg',
        }

        setEditingEquipField(editing);
        setAddingImgSizeExceded(false);
        setLoadingImg(true);
    };

    const cancelNewImgClick = ()=> {
        setLoadingImg(false);
        setLoadingImgVal(null);
        setAddingEquipImgVal(null);
        setEditingEquipField(null);
        setEditingEquipFieldVal(null);
    };

    const preLoadImg = (e)=> {
        const file = e.target.files[0];
        if (file.size > 2097152){
            setAddingImgSizeExceded(true);
            return;
        }
        setAddingImgSizeExceded(false);
        const fileUrl = URL.createObjectURL(file);
        const eqId = siteData.companies[expandedComp].equipment[editingEquipField.equipIndex].id;
        eqId !== 'temp' ? setLoadingImgVal({fileUrl:fileUrl, file:file}) : setAddingEquipImgVal({fileUrl:fileUrl, file:file});
    };

    const saveImgClick = async (e)=> {
        e.preventDefault();
        const prevImg = siteData.companies[expandedComp].equipment[editingEquipField.equipIndex].equipImg;
        const compId = siteData.companies[expandedComp].id;
        const eqId = siteData.companies[expandedComp].equipment[editingEquipField.equipIndex].id;
        
        if (eqId === 'temp'){
            setLoadingImg(false);
            setHoveredImg(null);
            setEditingEquipField(null);
            setEditingEquipFieldVal(null);
            setHoveredEquipField(null);
            return;
        }

        setLoadingPage(true);
        
        uploadImg(loadingImgVal.file, compId, eqId).then(async (newFilePath)=>{
            (prevImg && prevImg !== '') && await deleteFile(prevImg);
            var tempSiteData = JSON.parse(JSON.stringify(siteData));
            var tempSiteDataOg = JSON.parse(JSON.stringify(siteDataOg));
            var equipDataToUpload = JSON.parse(JSON.stringify(siteDataOg.companies[expandedComp].equipment[editingEquipField.equipIndex]));
            delete equipDataToUpload.id;

            tempSiteData.companies[expandedComp].equipment[editingEquipField.equipIndex].equipImg = newFilePath;
            tempSiteDataOg.companies[expandedComp].equipment[editingEquipField.equipIndex].equipImg = newFilePath;
            equipDataToUpload.equipImg = newFilePath;

            setSiteData(JSON.parse(JSON.stringify(tempSiteData)));
            setSiteDataOg(JSON.parse(JSON.stringify(tempSiteDataOg)));

            createOrUpdate(equipDataToUpload, 'company/' + compId + '/equipment', eqId).then( async ()=>{

                var tempEqImgUrl = eqImgUrl ?? {};
                !tempEqImgUrl[compId] && (tempEqImgUrl[compId] = {});
                const imgURL = await getImgUrl(newFilePath);
                if (imgURL) {
                    tempEqImgUrl[compId][eqId] = imgURL;
                }

                setEqImgUrl(tempEqImgUrl);
                setLoadingImgVal(null);
                setHoveredImg(null);
                setEditingEquipField(null);
                setEditingEquipFieldVal(null);
                setHoveredEquipField(null);

                setLoadingPage(false);
                setLoadingImg(false);

            }).catch((er)=>{
                console.log(er);
            });

        }).catch((er)=>{
            console.log(er);
        });
    };
    
    const addEquipClick = ()=> {
        const tempSiteData = JSON.parse(JSON.stringify(siteData));
        tempSiteData.companies[expandedComp].equipment.push({name:null, id:'temp'});

        var tempArr = [...expandedEquip];
        tempArr.push(tempSiteData.companies[expandedComp].equipment.length-1);

        var tempAddingEquipVal = {};
        for (var i = 0; i < siteEquipFields.length; i++) {
            tempAddingEquipVal[siteEquipFields[i]] = '';
        }

        setSiteData(tempSiteData);
        setExpandedEquip(tempArr);
        setAddingEquip(true);
        setAddingEquipVal(tempAddingEquipVal);

        setEditingEquipField(null);
        setEditingEquipFieldVal(null);
        setHoveredImg(null);
        setHoveredEquipField(null);

    };

    const cancelAddEquipClick = ()=> {

        var tempSiteData = JSON.parse(JSON.stringify(siteData));
        var tempArr = [...expandedEquip];
        
        tempSiteData.companies[expandedComp].equipment.pop();
        tempArr.pop();
        
        setSiteData(tempSiteData);
        setExpandedEquip(tempArr);
        setAddingEquip(false);
        setAddingEquipVal(null);
        setAddingEquipImgVal(null);
    };

    const saveAddEquipClick = async ()=> {
        setLoadingPage(true);

        var tempEquipInfo = {...addingEquipVal};
        const equipIndex = siteData.companies[expandedComp].equipment.length - 1;
        const compId = siteData.companies[expandedComp].id;
        var allOk = true;

        for (const i in tempEquipInfo) {
            const field = document.getElementById(equipIndex+'-'+i);  
            field.classList.remove('siteEquipAdmin-required');
            if (tempEquipInfo[i] === null || tempEquipInfo[i] === undefined || tempEquipInfo[i] === ''){           
                field.classList.add('siteEquipAdmin-required');
                allOk = false;
            }
        }

        if (!allOk){
            setLoadingPage(false);
            return;
        }

        createOrUpdate(tempEquipInfo, 'company/' + compId + '/equipment', null).then((doc)=>{
            
            tempEquipInfo.id = doc.id;

            var tempSiteData = JSON.parse(JSON.stringify(siteData));
            var tempSiteDataOg = JSON.parse(JSON.stringify(siteDataOg));
            tempSiteData.companies[expandedComp].equipment[equipIndex] = {...tempEquipInfo};
            tempSiteDataOg.companies[expandedComp].equipment.push({...tempEquipInfo});

            if (addingEquipImgVal && addingEquipImgVal.file) {

                uploadImg(addingEquipImgVal.file, compId, doc.id).then(async (newFilePath)=>{

                    tempEquipInfo.equipImg = newFilePath;
                    tempSiteData.companies[expandedComp].equipment[equipIndex].equipImg = newFilePath;
                    tempSiteDataOg.companies[expandedComp].equipment[equipIndex].equipImg = newFilePath;

                    var tempEqImgUrl = eqImgUrl;
                    const imgURL = await getImgUrl(newFilePath);
                    if (imgURL) {
                        if(!tempEqImgUrl[compId]){
                            tempEqImgUrl[compId] = {};
                        }
                        tempEqImgUrl[compId][doc.id] = imgURL;
                    }

                    setEqImgUrl(tempEqImgUrl);
                    await createOrUpdate(tempEquipInfo, 'company/' + compId + '/equipment', doc.id);

                }).catch((er)=>{
                    console.log(er);
                });

                
            }
            setSiteData(tempSiteData);
            setSiteDataOg(tempSiteDataOg);
            setLoadingImg(false)
            setLoadingImgVal(null);
            setHoveredImg(null);
            setAddingEquip(false);
            setAddingEquipVal(null);
            setAddingEquipImgVal(null);
            setEditingEquipField(false);
            setEditingEquipFieldVal(false);
            
            setLoadingPage(false);


        }).catch((er)=>{
            console.log(er);
        });

    };


    useEffect(()=>{
        getData();
        // eslint-disable-next-line
    }, []);
        

    return(
        <>
            {loadingImg && 
                <div className='modal-blurr-bk'>
                    <div className='modal-loading'>
                        <SectionContainer title={'Selecciona una Imagen'} closeHandler={cancelNewImgClick}>
                            <div className='siteEquipAdmin-img-load-modal'>
                                {loadingImgVal &&
                                    <ServiceReqImg img={loadingImgVal.fileUrl} style={equipImgStyle}/>
                                }
                                {addingEquipImgVal &&
                                    <ServiceReqImg img={addingEquipImgVal.fileUrl} style={equipImgStyle}/>
                                }
                                <input type='file' accept='image/*' onChange={preLoadImg}></input>
                                {(loadingImgVal || (addingEquipImgVal && siteData.companies[expandedComp].equipment[editingEquipField.equipIndex].id === 'temp')) && 
                                    <button className='siteEquipAdmin-img-load-modal-save' onClick={saveImgClick}>Guardar</button>
                                }
                                {addingImgSizeExceded && 
                                    <div>Tamaño de Imagen Excedido</div>
                                }
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

            <NavBar companyName={siteData && siteData.name}/>

            <div className='home-body'>
                <div className='home-body-contents'>
                    <div className='siteEquipAdmin--row'>

                        {siteData && 
                        <SectionContainer title={'Etiquetas'} expandible={true}>
                            <div className='siteEquipAdmin--labels-body'>
                                {siteData.companies.length > 0 &&
                                <button className='siteEquipAdmin--labels-button' onClick={goToLabels}>
                                    Ver Etiquetas
                                </button>
                                }
                                {siteData.companies.map((company, companyIndex)=>{return(
                                    <div className='siteEquipAdmin--labels-companyGroup'>
                                        <div className='siteEquipAdmin--labels-compName'>
                                            {company.companyName}
                                        </div>
                                        {company.equipment.length > 0 && 
                                        <div className='siteEquipAdmin--labels-selectAll'>
                                            <input type='checkbox' id={'labels-' + company.id + '-all'} name='Select All' onChange={()=>{selectAllLabelClick(company.id)}}></input>
                                            <label className='siteEquipAdmin--labels-checkLabel-all' for='labels-compId-all'> Todos</label>
                                        </div>
                                        }
                                        <div className='siteEquipAdmin--equips'>
                                            {company.equipment && company.equipment.map((equip, equipIndex)=>{return(
                                                <>
                                                <input checked={(selectedEquipLabel[company.id] && selectedEquipLabel[company.id][equip.id]) ? selectedEquipLabel[company.id][equip.id] : false} type='checkbox' id={'labels-compId-' + equip.id} name='Equipo 1' onChange={()=>{labelEquipSelected(company.id, equip.id)}}></input>
                                                <label for={'labels-compId-' + equip.id}> {equip.name + ' - ' + equip.model + ' - ' + equip.series + ' - ' + equip.area}</label>
                                                <br/>
                                                </>
                                            )})}
                                        </div>
                                    </div> 
                                )})

                                }
                            </div>
                        </SectionContainer>
                        }

                        <SectionContainer title={'Equipos'}>

                            <div className='siteEquipAdmin-site-cards-container'>
                                {siteData && siteData.companies.map((company, companyIndex)=>{return(
                                
                                    <div className='siteEquipAdmin--site-card' key={companyIndex}>
                                        <div className='siteEquipAdmin-site-card-title'>
                                            <div className='siteEquipAdmin-site-card-title-icons'>
                                                {expandedComp!==companyIndex && <i className='fa-regular fa-chevron-down' onClick={()=>{expandCompClick(companyIndex)}}></i>}
                                                {expandedComp===companyIndex && <i className='fa-regular fa-chevron-up' onClick={()=>{expandCompClick(companyIndex)}}></i>}
                                            </div>
                                            <div className='siteEquipAdmin--site-card-title-body'>
                                                <i className='fa-light fa-hospital'></i>&nbsp;&nbsp;{company.companyName}
                                            </div>
                                        </div>

                                        <div className={expandedComp===companyIndex ? 'siteEquipAdmin--site-card-body visible' : 'siteEquipAdmin--site-card-body'}>
                                            {/* <div className='siteEquipAdmin--equip-card-groups-container'>

                                                <div className='siteEquipAdmin--equip-card-groups-title'>
                                                    <i className={expandedGroups ? 'fa-regular fa-chevron-up' : 'fa-regular fa-chevron-down'} onClick={expandGroups}></i>
                                                    <div>Editar Grupos</div>
                                                </div>
                                                <div className={expandedGroups ? 'siteEquipAdmin--equip-card-groups-body visible' : 'siteEquipAdmin--equip-card-groups-body'}>
                                                    {company.equipGroups.map((group, groupIndex)=>{return(
                                                        <div className='siteEquipAdmin--group-form-ele' key={groupIndex}>
                                                            <div className='siteEquipAdmin--group-form-name'>
                                                                Nombre de Grupo
                                                            </div>
                                                            <div className='siteEquipAdmin--group-form-value' onMouseEnter={null}>
                                                                {group.name}
                                                            </div>
                                                        </div>
                                                    )})}
                                                    <div className='siteEquipAdmin--group-form-add-icon-container'>
                                                        <i className='fa-light fa-circle-plus siteEquipAdmin--group-form-add-icon'></i>
                                                    </div>
                                                </div>
                                                
                                            </div> */}

                                            <div className='siteEquipAdmin--equip-cards-filter-group'>
                                                <div>Grupo</div>
                                                <select className='siteEquipAdmin--equip-cards-filter-group-select' onChange={(e)=>{groupFilterClick(e.target.value,companyIndex)}}>
                                                    <option value={'all'}>Todos</option>
                                                    {groupData.map((grp, grpKey)=>{return(
                                                        <option key={'group' + grpKey} value={grp.id}>{grp.name}</option>
                                                    )})}
                                                </select>
                                            </div>

                                            <div className='siteEquipAdmin--equip-cards-filter-container'>
                                                <div></div>
                                                <div className='siteEquipAdmin--equip-cards-filter'>
                                                    <div onDoubleClick={()=>{filterByClick('name', companyIndex)}}>
                                                        Nombre&nbsp;{(filterBy && filterBy[companyIndex].field === 'name') && <i className={filterBy[companyIndex].reversed ? 'fa-regular fa-arrow-down-z-a' : 'fa-regular fa-arrow-down-a-z'}></i>}
                                                    </div>
                                                </div>
                                                <div className='siteEquipAdmin--equip-cards-filter'>
                                                    <div onDoubleClick={()=>{filterByClick('series', companyIndex)}}>
                                                        No. Serie&nbsp;{(filterBy && filterBy[companyIndex].field === 'series') && <i className={filterBy[companyIndex].reversed ? 'fa-regular fa-arrow-down-z-a' : 'fa-regular fa-arrow-down-a-z'}></i>}
                                                    </div>
                                                </div>
                                                <div className='siteEquipAdmin--equip-cards-filter'>
                                                    <div onDoubleClick={()=>{filterByClick('area', companyIndex)}}>
                                                        Área&nbsp;{(filterBy && filterBy[companyIndex].field === 'area') && <i className={filterBy[companyIndex].reversed ? 'fa-regular fa-arrow-down-z-a' : 'fa-regular fa-arrow-down-a-z'}></i>}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='siteEquipAdmin--equip-cards-container'>
                                                {company.equipment && company.equipment.map((equip, equipIndex)=>{return(
                                                    <div className='siteEquipAdmin--equip-card' key={equipIndex}>
                                                        <div className='siteEquipAdmin--equip-card-title-container'>
                                                            <div className='siteEquipAdmin--equip-card-title-icon'>
                                                                {(!expandedEquip.includes(equipIndex) && equip.id !== 'temp') && <i className='fa-regular fa-chevron-down' onClick={()=>{expandEquipClick(equipIndex)}}></i>}
                                                                {(expandedEquip.includes(equipIndex) && equip.id !== 'temp') && <i className='fa-regular fa-chevron-up' onClick={()=>{expandEquipClick(equipIndex)}}></i>}
                                                            </div>
                                                            {equip.id !== 'temp' && 
                                                                <div className='siteEquipAdmin--equip-card-title'>
                                                                    <i className='fa-light fa-computer-classic'></i>&nbsp;&nbsp;{equip.name}
                                                                </div>
                                                            }
                                                            {equip.id === 'temp' &&
                                                                <div className='siteEquipAdmin--equip-card-add-new-icons'>
                                                                    <i className='fa-light fa-xmark siteEquipAdmin--site-card-address-form-cancel' onClick={cancelAddEquipClick}></i>
                                                                    <i className='fa-light fa-check siteEquipAdmin--site-card-address-form-ok' onClick={saveAddEquipClick}></i>
                                                                </div>
                                                            }
                                                            <div>{equip.series}</div>
                                                            <div>{equip.area}</div>
                                                        </div>
                                                        <div className={expandedEquip.includes(equipIndex) ? 'siteEquipAdmin--equip-card-body visible' : 'siteEquipAdmin--equip-card-body'}>

                                                            <div className='siteEquipAdmin--equip-card-body-img'
                                                            onMouseEnter={()=>{hoverOnImage(equipIndex)}}
                                                            onMouseLeave={()=>{hoverOnImage(null)}}>
                                                                {(hoveredImg === equipIndex && equip.id) && 
                                                                    <div className='siteEquipAdmin--equip-card-body-img-new-cont'>
                                                                        <button className='siteEquipAdmin--equip-card-body-img-new' onClick={(e)=>{newImgClick(e,equipIndex)}}>
                                                                            <i className='fa-light fa-upload'>&nbsp;&nbsp;</i>
                                                                            {equip.id === 'temp' ? 'Cargar' : 'Nueva'}
                                                                        </button>
                                                                    </div>
                                                                }
                                                                {(equip.id !== 'temp' && equip.equipImg) && <ServiceReqImg style={equipImgStyle} img={(eqImgUrl && eqImgUrl[company.id] && eqImgUrl[company.id][equip.id]) ? eqImgUrl[company.id][equip.id] : null}/>}
                                                                {(equip.id !== 'temp' && !equip.equipImg) && <div className='siteEquipAdmin--equip-card-body-no-img' onClick={(e)=>{newImgClick(e,equipIndex)}}><i className='fa-duotone fa-camera-viewfinder'></i></div>}
                                                                {(addingEquipImgVal && addingEquipImgVal.fileUrl && equip.id === 'temp') && <ServiceReqImg style={equipImgStyle} img={addingEquipImgVal.fileUrl}/>}
                                                                {((!addingEquipImgVal || !addingEquipImgVal.fileUrl) && equip.id === 'temp') && <div className='siteEquipAdmin--equip-card-body-no-img'  onClick={(e)=>{newImgClick(e,equipIndex)}}><i className='fa-duotone fa-camera-viewfinder'></i></div>}
                                                            </div>
                                                            <div>
                                                            {siteEquipFields.map((equipField, equipFieldIndex)=>{return(
                                                                
                                                                <div className='siteEquipAdmin--site-card-address-form-ele' key={'name'+equipFieldIndex}>
                                                                    <div className='siteEquipAdmin--site-card-address-form-name'>
                                                                        {siteEquipFieldsEsp[equipFieldIndex]}
                                                                    </div>

                                                                    {((editingEquipField && editingEquipField.equipIndex === equipIndex && editingEquipField.equipField === equipField) || equip.id === 'temp')
                                                                    ?
                                                                        <div className='siteEquipAdmin--site-card-address-form-value-editing-container'>
                                                                            {(equipField === 'groupId') && 
                                                                            <select id={equipIndex+'-'+equipField} 
                                                                            className={'siteEquipAdmin--site-card-address-form-value-input'} 
                                                                            type='text' 
                                                                            value={equip.id === 'temp' ? addingEquipVal[equipField] : editingEquipFieldVal??null} 
                                                                            onChange={equip.id === 'temp' ? (e)=>{setAddingEquipVal((preVal)=>({ ...preVal, [equipField]: e.target.value }))} : (e)=>setEditingEquipFieldVal(e.target.value)}>
                                                                                <option value={''}></option>
                                                                                {groupData.map((eqGr, qeGrIndex)=>{return(
                                                                                    <option key={'eqGr' + qeGrIndex} value={eqGr.id}>{eqGr.name}</option>
                                                                                )})}
                                                                            </select>
                                                                            }
                                                                            {(equipField === 'maintPeriod') && 
                                                                            <select id={equipIndex+'-'+equipField} 
                                                                            className={'siteEquipAdmin--site-card-address-form-value-input'} 
                                                                            type='text' 
                                                                            value={equip.id === 'temp' ? addingEquipVal[equipField] : editingEquipFieldVal??null} 
                                                                            onChange={equip.id === 'temp' ? (e)=>{setAddingEquipVal((preVal)=>({ ...preVal, [equipField]: e.target.value }))} : (e)=>setEditingEquipFieldVal(e.target.value)}>
                                                                                <option value={''}></option>
                                                                                {Object.keys(maintenancePeriodicity).map((month, monthIndex)=>{return(
                                                                                    <option key={'month' + monthIndex} value={month}>{maintenancePeriodicity[month]}</option>
                                                                                )})}
                                                                            </select>
                                                                            }
                                                                            {(equipField !== 'groupId' && equipField !== 'maintPeriod') && 
                                                                                <input id={equipIndex+'-'+equipField} 
                                                                                className={'siteEquipAdmin--site-card-address-form-value-input'} 
                                                                                type='text' 
                                                                                value={equip.id === 'temp' ? addingEquipVal[equipField] : editingEquipFieldVal??null} 
                                                                                onChange={equip.id === 'temp' ? (e)=>{setAddingEquipVal((preVal)=>({ ...preVal, [equipField]: e.target.value }))} : (e)=>setEditingEquipFieldVal(e.target.value)}>
                                                                                </input>
                                                                            }

                                                                            {equip.id !== 'temp' && <i className='fa-light fa-xmark siteEquipAdmin--site-card-address-form-cancel' onClick={cancelEditingEquipField}></i>}
                                                                            {equip.id !== 'temp' && <i className='fa-light fa-check siteEquipAdmin--site-card-address-form-ok' onClick={(e)=>{saveEditingField(equipIndex, equipField)}}></i>}
                                                                        </div>
                                                                    :<>
                                                                        {(hoveredEquipField && hoveredEquipField.equipIndex === equipIndex && hoveredEquipField.equipField === equipField) && 
                                                                            <div id={equipIndex+'-'+equipField} className='siteEquipAdmin--site-card-address-form-value-hovered' onMouseLeave={deHoverOnEquipField} onDoubleClick={()=>{editEquipFieldClick(equipIndex, equipField)}}>
                                                                                <div onClick={cancelEditingEquipField}>
                                                                                    {(equipField !== 'groupId' && equipField !== 'assignedTech' && equipField !== 'maintPeriod') && (equip[equipField] ?? null)}
                                                                                    {equipField === 'maintPeriod' && maintenancePeriodicity[equip[equipField]]}
                                                                                    {equipField === 'groupId' && sitesEquipAdminRetValFromArr(equip[equipField], groupData).name}
                                                                                    {equipField === 'assignedTech' && sitesEquipAdminRetValFromArr(equip[equipField], uData[company.id]).name}
                                                                                </div>
                                                                                <i className='fa-light fa-pencil siteEquipAdmin--site-card-address-form-pencil' onClick={()=>{editEquipFieldClick(equipIndex, equipField)}}></i>
                                                                            </div>
                                                                        }
                                                                        {(!hoveredEquipField || hoveredEquipField.equipIndex !== equipIndex || hoveredEquipField.equipField !== equipField) && 
                                                                            <div id={equipIndex+'-'+equipField} className='siteEquipAdmin--site-card-address-form-value' onMouseEnter={()=>{hoverOnEquipField(equipIndex, equipField)}}>
                                                                                {(equipField !== 'groupId' && equipField !== 'assignedTech' && equipField !== 'maintPeriod') && (equip[equipField] ?? null)}
                                                                                {equipField === 'maintPeriod' && maintenancePeriodicity[equip[equipField]]}
                                                                                {equipField === 'groupId' && sitesEquipAdminRetValFromArr(equip[equipField], groupData).name}
                                                                                {equipField === 'assignedTech' && sitesEquipAdminRetValFromArr(equip[equipField], uData[company.id]).name}
                                                                            </div>
                                                                        }
                                                                    </>
                                                                    }
                                                                </div>
                                                            )})}

                                                            
                                                            </div>

                                                        </div>
                                                    </div>
                                                )})}

                                                {!addingEquip && 
                                                    <div className='siteEquipAdmin--site-card-address-add-icon-container'>
                                                        <i className='fa-light fa-circle-plus siteEquipAdmin--site-card-address-add-icon' onClick={addEquipClick}></i>
                                                    </div>
                                                }

                                            </div>
                                        </div>
                                    </div>
                                
                                )})}

                                



                            </div>

                        </SectionContainer>
                    </div>
                </div>
            </div>

        </>
    );
};
