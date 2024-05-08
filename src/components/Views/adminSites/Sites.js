import React, {useState, useEffect} from 'react';
import { NavBar } from '../../Misc/navBar/NavBar';
import loadingGif from '../../../img/loading.gif';
import { loadingModalStyle } from '../../../scripts/consts';

import { SectionContainer } from '../../Misc/sectionContainer/SectionContainer';
import { sitesStartData, siteAddressFields, siteAddressFieldsEsp, validateEmail } from './Scripts';
import { checkLog } from '../../../scripts/auth';
import { createOrUpdate } from '../../../scripts/updates';

export const Sites = () => {
    const [loadingPage, setLoadingPage] = useState(true);
    const [groupData, setGroupData] = useState(null);
    const [expandedComp, setExpandedComp] = useState(null);
    const [expandedUsers, setExpandedUsers] = useState(false);
    const [hoverElement, setHoverElement] = useState(null);
    const [editingElement, setEditingElement] = useState(null);
    const [editingElementVal, setEditingElementVal] = useState(null);
    const [editingCompanyName, setEditingCompanyName] = useState(null);
    const [editingCompanyNameVal, setEditingCompanyNameVal] = useState(null);
    const [addingNewUser, setAddingNewUser] = useState(null);
    const [addingNewUserVal, setAddingNewUserVal] = useState({name:null,lastName:null,email:null,active:'Y',renew:true});
    const [editingUser, setEditingUser] = useState(null);
    const [editingUserVal, setEditingUserVal] = useState(null);
    const [addingNewSiteName, setAddingNewSiteName] = useState(false);
    const [addingNewSiteNameVal, setAddingNewSiteNameVal] = useState(null);
    const [userNotValid, setUserNotValid] = useState(false);

    document.addEventListener('keydown', (event) => {
        // event.preventDefault();
        var name = event.key;
        // var code = event.code;
        if (name === 'Escape'){
            if(editingElement !== null){
                cancelEditingAddress();
            }
        }
    }, false);

    const userIsLoggedCheck = ()=> {
        const logInfo = checkLog(true);
        if (!logInfo) {
            window.location = '/';
        }
    };

    const getData = async ()=> {
        const logInfo = checkLog(true);
        if (!logInfo) {
            window.location = '/';
        }
        
        const groupId = logInfo.split(':')[0];
        const logLevel = logInfo.split(':')[1]*1;
        if (logLevel !== 1){
            window.location = '/';
        }
        
        const tempData = await sitesStartData(groupId, logLevel);
        if (tempData){
            
            setGroupData(tempData);
            cancelEditingCompName();
            setLoadingPage(false);
        }        
    };

    const expandCompClick = (index)=>{
        setExpandedUsers(false)
        setHoverElement(null);
        setEditingElement(null);
        cancelEditingCompName();
        cancelUserEdit();
        if (expandedComp === index){
            setExpandedComp(null);
        }else{
            setExpandedComp(index);
        }
        
    };

    const expandUsersClick = ()=>{
        cancelUserEdit();
        cancelAddingUser();
        setExpandedUsers(!expandedUsers);
    };

    const hoverOnField = (name, index)=>{
        setHoverElement({name:name, index:index});
    };

    const deHoverOnField = ()=> {
        setHoverElement(null);
    };

    const editingCompName = (index)=> {
        userIsLoggedCheck();
        
        setEditingCompanyNameVal(groupData.companies[index].companyName);
        setEditingCompanyName(index);
    };

    const saveEditingCompName = (index)=> {
        
        userIsLoggedCheck();
        
        if (groupData.companies[index].id === 'temp'){

            if(addingNewSiteNameVal !== null){
                setLoadingPage(true);

                const newSiteTemp = {companyName:addingNewSiteNameVal, active:'Y'};

                createOrUpdate(newSiteTemp, 'company', null).then((doc)=>{
                    var tempGroupData = JSON.parse(JSON.stringify(groupData));
                    tempGroupData.companiesStr = tempGroupData.companiesStr + ',' + doc.id;
                    tempGroupData.companies[index].companyName = addingNewSiteNameVal;
                    tempGroupData.companies[index].id = doc.id;
                
                    const groupInfoTest ={
                        active: tempGroupData.active,
                        companiesStr: tempGroupData.companiesStr,
                        companyLimit: tempGroupData.companyLimit,
                        name: tempGroupData.name
                    }
                   
                    createOrUpdate(groupInfoTest, 'group', tempGroupData.id).then(()=>{
                        setAddingNewSiteNameVal(null);
                        setAddingNewSiteName(false);
                        setGroupData(tempGroupData);
                        setLoadingPage(false);
                    }).catch((er)=>{
                        console.log(er);
                    });
                }).catch((er)=>{
                    console.log(er);
                });

            }else{
                return;
            }
            
        }else{

            if(editingCompanyNameVal !== groupData.companies[index].companyName){
                setLoadingPage(true);
                var tempCompInfo = JSON.parse(JSON.stringify(groupData.companies[index]))
                tempCompInfo.companyName = editingCompanyNameVal;
                delete tempCompInfo.id;
                delete tempCompInfo.users;
                
                createOrUpdate(tempCompInfo, 'company', groupData.companies[index].id).then(()=>{
                    var tempGroupData = JSON.parse(JSON.stringify(groupData));
                    tempGroupData.companies[index].companyName = editingCompanyNameVal;
                    
                    cancelEditingCompName();
                    setGroupData(tempGroupData);
                    setLoadingPage(false);
                    
                }).catch((er)=>{
                    console.log(er);
                    cancelEditingCompName();
                    // setLoadingPage(false);
                });
            }else{
                cancelEditingCompName();
                setLoadingPage(false);
            }
        }
    };

    const cancelEditingCompName = ()=>{
        userIsLoggedCheck();
        setEditingCompanyNameVal(null);
        setEditingCompanyName(null);
    };

    const enterEditingAddress = (name, index)=>{
        userIsLoggedCheck();
        setHoverElement(null);
        setEditingElementVal(groupData.companies[index][name]);
        setEditingElement({name:name, index:index});
    };

    const cancelEditingAddress = ()=> {
        userIsLoggedCheck();
        setHoverElement(null);
        setEditingElement(null);
    };

    const editAddressElement = async (name, index)=>{
        userIsLoggedCheck();
        console.log(index, name);
        
        if(editingElementVal !== groupData.companies[index][name]){
            setLoadingPage(true);
            var tempCompInfo = JSON.parse(JSON.stringify(groupData.companies[index]))
            tempCompInfo[name] = editingElementVal;
            delete tempCompInfo.id;
            delete tempCompInfo.users;
            
            createOrUpdate(tempCompInfo, 'company', groupData.companies[index].id).then(()=>{
                var tempGroupData = JSON.parse(JSON.stringify(groupData));
                tempGroupData.companies[index][name] = editingElementVal;
                
                setEditingElement(null);
                setEditingElementVal(null);
                setGroupData(tempGroupData);
                setHoverElement(null);
                setLoadingPage(false);
                
            }).catch((er)=>{
                console.log(er);
                setEditingElement(null);
                setEditingElementVal(null);
                setHoverElement(null);
                setLoadingPage(false);
            });
        }else{
            setEditingElement(null);
            setEditingElementVal(null);
            setHoverElement(null);
            setLoadingPage(false);
        }

    }

    const editNewSiteClick = ()=> {
        userIsLoggedCheck();
        const newSiteTemp = {
            active:'Y',
            id:'temp',
            cP:null,
            city:null,
            col:null,
            companyName:null,
            number:null,
            state:null,
            street:null,
            tel:null,
            users:[]
        }

        var tempGroupData = JSON.parse(JSON.stringify(groupData));
        tempGroupData.companies.push(newSiteTemp);
        setAddingNewSiteName(true);
        setGroupData(tempGroupData);
    }

    const cancelAddingSite = ()=> {
        userIsLoggedCheck();
        var tempGroupData = JSON.parse(JSON.stringify(groupData));
        tempGroupData.companies.pop();
        setAddingNewSiteName(false);
        setGroupData(tempGroupData);
    };

    const addNewUser = (index)=> {
        userIsLoggedCheck();
        setAddingNewUser(index);
    };

    const cancelAddingUser = ()=>{
        userIsLoggedCheck();
        setAddingNewUser(null);
        setAddingNewUserVal({name:null,lastName:null,email:null,active:'Y',renew:true});
    };

    const newUserChange = (e)=> {
        userIsLoggedCheck();
        e.preventDefault();
        e.target.classList.remove('sites-admin--required');
        const { name, value } = e.target;
        setAddingNewUserVal((prev)=>({ ...prev, [name]: value }));
    };

    const validateAddingUser = (obj, prep)=> {
        userIsLoggedCheck();
        const keys = Object.keys(obj);
        var nulls = 0;
        

        for (var i = 0; i < keys.length; i++){
            if(obj[keys[i]] === null || obj[keys[i]] === ''){
                nulls++;
                const elementId = keys[i] + '-' + prep;
                const element = document.getElementById(elementId);
                element.classList.add('sites-admin--required');
            }
        }
        if (nulls > 0){
            return false;
        }
        return true;
    };

    const saveAddingUser = async (index)=> {
        userIsLoggedCheck();
        var temp = {...addingNewUserVal};
        temp.company = groupData.companies[index].id;
        temp.level = 2;
        temp.renew = true;
        
        if (!validateAddingUser(addingNewUserVal, 'new')){
            return;
        }

        const validEmail = await validateEmail(temp.email);
        if (!validEmail){
            setUserNotValid(true);
            return;
        }

        setLoadingPage(true);

        createOrUpdate(temp, 'uData', null).then((id)=>{
            temp.id = id;
            var tempGroupData = {...groupData};
            tempGroupData.companies[index].users.push(temp);
            setGroupData(tempGroupData);
            cancelAddingUser();
            cancelUserEdit();
            setLoadingPage(false);
        }).catch((e)=>{
            console.log(e);
            setLoadingPage(false);
        });

    };

    const userEdit = (index, index3)=> {
        userIsLoggedCheck();
        const temp = {...groupData.companies[index].users[index3]};
        setEditingUserVal(temp);
        setEditingUser([index, index3]);
    };

    const cancelUserEdit = ()=> {
        userIsLoggedCheck();
        setEditingUserVal(null);
        setEditingUser(null);
    };

    const userEditChange = (e)=> {
        userIsLoggedCheck();
        e.preventDefault();
        e.target.classList.remove('required');
        const { name, value } = e.target;
        setEditingUserVal((prev)=>({ ...prev, [name]: value }));
    };

    const invalidUserClick = ()=> {
        setUserNotValid(false);
        setLoadingPage(false);
    }

    const saveUserEdit = async (index, index3)=> {
        userIsLoggedCheck();
        const id = editingUserVal.id;
        var temp = {...editingUserVal};
        delete temp.id;
        
        if (!validateAddingUser(editingUserVal, 'edit')){
            return;
        }
        
        const validEmail = await validateEmail(temp.email, id);
        if (!validEmail){
            setUserNotValid(true);
            return;
        }

        setLoadingPage(true);
        
        createOrUpdate(temp, 'uData', id).then(()=>{
            var tempGroupData = {...groupData};

            tempGroupData.companies[index].users[index3] = {...temp};
            setGroupData(tempGroupData);
            cancelUserEdit();
            setLoadingPage(false);
        }).catch((e)=>{
            console.log(e);
            setLoadingPage(false);
        });

    };

    useEffect(()=>{
        getData();
        // eslint-disable-next-line
    },[]);



    return <>

        { userNotValid && 
            <div className='modal-blurr-bk'>
                <div className='modal-loading'>
                    <SectionContainer title={'Usuario No Válido'}>
                        <div className='sites-admin--invalid-user-container'>
                            El Email del Usuario ya está registrado
                        </div>
                        <button className='sites-admin--invalid-user-button' onClick={invalidUserClick}>Aceptar</button>
                    </SectionContainer>
                </div>
            </div>
        }

        { loadingPage && 
            <div className='modal-blurr-bk'>
                <div className='modal-loading'>
                    <img src={loadingGif} alt='' style={loadingModalStyle}/>
                </div>
            </div>
        }

        {groupData && <NavBar companyName={groupData.name}/>}
            <div className='home-body'>
                <div className='home-body-contents'>
                    <div className='sites-admin--row'>
                        <SectionContainer title='Aministración de Sedes'>
                            {groupData && <div className='sites-admin--container'>
                                {groupData.companies.map((item, index)=>{return(

                                    <div className='sites-admin--site-card' key={index}>

                                        <div className='sites-admin--site-card-head'>
                                            <div className='sites-admin--site-card-head-icons'>
                                                {(expandedComp !== index && item.id !=='temp') && <i className='fa-regular fa-chevron-down' onClick={()=>{expandCompClick(index)}}></i>}
                                                {(expandedComp === index && item.id !=='temp') && <i className='fa-regular fa-chevron-up' onClick={()=>{expandCompClick(index)}}></i>}
                                                { item.id ==='temp' && <div></div>}
                                                {(expandedComp === index && editingCompanyName !== index && item.id !=='temp') && <i className='fa-light fa-pencil' onClick={()=>{editingCompName(index)}}></i>}
                                                {((expandedComp === index && editingCompanyName === index) ||  item.id ==='temp') && 
                                                <div>
                                                    <i className='fa-solid fa-check sites-admin--site-card-head-check' onClick={()=>{saveEditingCompName(index)}}></i>
                                                    {item.id !=='temp' && <i className='fa-solid fa-xmark sites-admin--site-card-head-cancel' onClick={cancelEditingCompName}></i>}
                                                    {item.id ==='temp' && <i className='fa-solid fa-xmark sites-admin--site-card-head-cancel' onClick={cancelAddingSite}></i>}
                                                </div>
                                                }
                                            </div>
                                            {(editingCompanyName !== index && item.id !=='temp') && <div className='sites-admin--site-card-head-name'>
                                                {item.companyName}
                                            </div>}
                                            {(editingCompanyName === index || item.id ==='temp') && <div className='sites-admin--site-card-head-name-editing'>
                                                {item.id !=='temp' && <input className={'sites-admin--site-card-head-name-editing-input'} value={editingCompanyNameVal} onChange={(e)=>{setEditingCompanyNameVal(e.target.value)}}></input>}
                                                {item.id ==='temp' && <input className={'sites-admin--site-card-head-name-editing-input'} value={addingNewSiteNameVal} onChange={(e)=>{setAddingNewSiteNameVal(e.target.value)}}></input>}
                                            </div>}
                                        </div>

                                        <div className={(expandedComp === index && item.id !=='temp') ? 'sites-admin--site-card-body visible' : 'sites-admin--site-card-body'}>
                                            <div className='sites-admin--site-card-address'>
                                                <div className='sites-admin--site-card-address-title'>
                                                    Dirección:
                                                </div>
                                                
                                                <div className='sites-admin--site-card-address-form'>

                                                    {siteAddressFields.map((item2, index2)=>{
                                                    return(
                                                        <div className='sites-admin--site-card-address-form-ele' key={index2}>
                                                            <div className='sites-admin--site-card-address-form-name'>
                                                                {siteAddressFieldsEsp[index2]+':'}
                                                            </div>
                                                            {(editingElement && editingElement.name === item2 && editingElement.index === index) ?
                                                                <div className='sites-admin--site-card-address-form-value-editing'>
                                                                    <input className='sites-admin--site-card-address-form-value-input' type='text' value={editingElementVal} onChange={(e)=>{setEditingElementVal(e.target.value)}}></input>
                                                                    <i className='fa-solid fa-check sites-admin--site-card-address-form-value-check-icon' onClick={()=>{editAddressElement(item2, index)}}></i>
                                                                    <i className='fa-solid fa-xmark sites-admin--site-card-address-form-value-cancel-icon' onClick={cancelEditingAddress}></i>
                                                                </div>
                                                            :
                                                                <>
                                                                {(hoverElement && hoverElement.name === item2 && hoverElement.index === index) ?
                                                                    <div className='sites-admin--site-card-address-form-value-editing' onMouseLeave={()=>{deHoverOnField()}} onDoubleClick={()=>{enterEditingAddress(item2, index)}}>
                                                                        {item[item2]}
                                                                        <div/>
                                                                        <i className='fa-light fa-pencil sites-admin--site-card-address-form-value-editing-icon' onClick={()=>{enterEditingAddress(item2, index)}}></i>
                                                                    </div>
                                                                :
                                                                    <div className='sites-admin--site-card-address-form-value' onMouseEnter={()=>{hoverOnField(item2, index)}}>
                                                                        {item[item2]}
                                                                    </div>
                                                                }
                                                                </>                                                            
                                                            }
                                                        </div> 
                                                    )})}

                                                </div>
                                            </div>

                                            <div className='sites-admin--site-card-users'>
                                                <div className='sites-admin--site-card-users-title-container'>
                                                    {expandedUsers && <i className='fa-regular fa-chevron-up' onClick={()=>{expandUsersClick(expandedUsers)}}></i>}
                                                    {!expandedUsers && <i className='fa-regular fa-chevron-down' onClick={()=>{expandUsersClick(expandedUsers)}}></i>}
                                                    <div className='sites-admin--site-card-users-title'>Usuarios (Técnicos)</div>
                                                </div>

                                                <div className={expandedUsers ? 'sites-admin--site-card-users-contents visible' : 'sites-admin--site-card-users-contents'}>
                                                    
                                                    <div className='sites-admin--site-card-users-table'>

                                                        <div className='sites-admin--site-card-users-table-headers'>
                                                            <div className='sites-admin--site-card-users-table-header'></div>
                                                            <div className='sites-admin--site-card-users-table-header'>Nombre(s)</div>
                                                            <div className='sites-admin--site-card-users-table-header'>Apellido(s)</div>
                                                            <div className='sites-admin--site-card-users-table-header'>Correo</div>
                                                            <div className='sites-admin--site-card-users-table-header'>Activo</div>
                                                        </div>
                                                        {(item.users && item.users.length > 0) && 
                                                        <>

                                                        {item.users.map((item3, index3)=>{
                                                            if (editingUser && editingUser[0] === index && editingUser[1] === index3){
                                                                return(
                                                                    <>
                                                                        <div className='sites-admin--site-card-users-table-bodies'>
                                                                            <div className='sites-admin--site-card-users-table-body'>
                                                                                <div>
                                                                                    <i className='fa-light fa-check sites-admin--site-card-users-table-check' onClick={()=>{saveUserEdit(index, index3)}}></i>&nbsp;&nbsp;&nbsp;
                                                                                    <i className='fa-light fa-xmark sites-admin--site-card-users-table-cancel' onClick={cancelUserEdit}></i>
                                                                                </div>
                                                                            </div>
                                                                            <div className='sites-admin--site-card-users-table-body'>
                                                                                <input className='sites-admin--site-card-users-table-body-input' id='name-edit' type='text' name='name' value={editingUserVal.name} onChange={userEditChange}></input>
                                                                            </div>
                                                                            <div className='sites-admin--site-card-users-table-body'>
                                                                                <input className='sites-admin--site-card-users-table-body-input' id='lastName-edit' type='text' name='lastName' value={editingUserVal.lastName} onChange={userEditChange}></input>
                                                                            </div>
                                                                            <div className='sites-admin--site-card-users-table-body'>
                                                                                <input className='sites-admin--site-card-users-table-body-input' id='email-edit' type='text' name='email' value={editingUserVal.email} onChange={userEditChange}></input>
                                                                            </div>
                                                                            <div className='sites-admin--site-card-users-table-body'>
                                                                                <select className='sites-admin--site-card-users-table-body-input' id='active-edit' type='text' name='active' value={editingUserVal.active} onChange={userEditChange}>
                                                                                    <option value={'Y'}>Y</option>
                                                                                    <option value={'N'}>N</option>
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                )
                                                            }else{
                                                                return(
                                                                    <div className='sites-admin--site-card-users-table-bodies' key={index3}>
                                                                        <div className='sites-admin--site-card-users-table-body'>
                                                                            <i className='fa-light fa-pencil' onClick={()=>{userEdit(index, index3)}}></i>
                                                                        </div>
                                                                        <div className='sites-admin--site-card-users-table-body'>{item3.name}</div>
                                                                        <div className='sites-admin--site-card-users-table-body'>{item3.lastName}</div>
                                                                        <div className='sites-admin--site-card-users-table-body'>{item3.email}</div>
                                                                        <div className='sites-admin--site-card-users-table-body'>{item3.active}</div>
                                                                    </div>
                                                                )
                                                            }
                                                        })}

                                                        </>}

                                                        {addingNewUser === index &&
                                                        <div className='sites-admin--site-card-users-table-bodies'>
                                                            <div className='sites-admin--site-card-users-table-body'>
                                                                <div>
                                                                    <i className='fa-light fa-check sites-admin--site-card-users-table-check' onClick={()=>{saveAddingUser(index)}}></i>&nbsp;&nbsp;&nbsp;
                                                                    <i className='fa-light fa-xmark sites-admin--site-card-users-table-cancel' onClick={cancelAddingUser}></i>
                                                                </div>
                                                            </div>
                                                            <div className='sites-admin--site-card-users-table-body'>
                                                                <input className='sites-admin--site-card-users-table-body-input' id='name-new' type='text' name='name' value={addingNewUserVal.name} onChange={newUserChange}></input>
                                                            </div>
                                                            <div className='sites-admin--site-card-users-table-body'>
                                                                <input className='sites-admin--site-card-users-table-body-input' id='lastName-new' type='text' name='lastName' value={addingNewUserVal.lastName} onChange={newUserChange}></input>
                                                            </div>
                                                            <div className='sites-admin--site-card-users-table-body'>
                                                                <input className='sites-admin--site-card-users-table-body-input' id='email-new' type='text' name='email' value={addingNewUserVal.email} onChange={newUserChange}></input>
                                                            </div>
                                                            <div className='sites-admin--site-card-users-table-body'>
                                                                <select className='sites-admin--site-card-users-table-body-input' id='active-new' type='text' name='active' value={addingNewUserVal.active} onChange={newUserChange}>
                                                                    <option value={'Y'}>Y</option>
                                                                    <option value={'N'}>N</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        }

                                                        <div className='sites-admin--site-card-users-table-foot'>
                                                            <i className='fa-light fa-circle-plus' onClick={()=>{addNewUser(index)}}></i>
                                                        </div>
                                                        
                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                    </div>
                                )})}

                                {(!addingNewSiteName && groupData.companies && groupData.companies.length < groupData.companyLimit) &&
                                    <i className='fa-light fa-circle-plus sites-admin--new-site-icon' onClick={editNewSiteClick}></i>
                                }

                            </div>}
                        </SectionContainer>
                    </div>
                </div>
            </div>
        </>;
};
