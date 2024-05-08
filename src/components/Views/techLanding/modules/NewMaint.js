import React, { useState, useEffect} from 'react';
import { SectionContainer } from '../../../Misc/sectionContainer/SectionContainer';
import { newReportFormStartData, newMaintGetTests, getMaintInfo, uploadTestsLists } from '../Scripts';
import { createOrUpdate } from '../../../../scripts/updates';
import { checkLog } from '../../../../scripts/auth';
import { TestTemplates } from './TestTemplates';
import { getDate, getDateFromForm } from '../../../../scripts/utils';

export const NewMaint = ({compId, eqId, loadingToggle, closeHandler, readOnly, maintId}) => {

    const [addTestList, setAddTestList] = useState(false);
    const [testListsInfo, setTestListsInfo] = useState(null);
    const [selectedTest, setSelectedTest] = useState(null);
    const [equipData, setEquipData] = useState(null);
    const [tests, setTests] = useState ([{desc: '',value:''}]);
    const [observations, setObservations] = useState(null);
    const [maintInfo, setMaintInfo] = useState(null);
    // const [logInfo, setLogInfo] = useState(null);
    const [closedDate, setClosedDate] = useState( getDate(new Date(), "yyyy-MM-DD") );

    const startData = async ()=> {
        loadingToggle(true);
        const log = checkLog(true);
        if (!log){
            window.location = '/';
        } 

        const tempTestListsInfo = await newMaintGetTests();
        const tempEquipData = await newReportFormStartData(compId, eqId);

        setTestListsInfo(tempTestListsInfo);
        setEquipData(tempEquipData);
        // setLogInfo(log)

        if (maintId) {
            await startMaintInfo();
        }

        loadingToggle(false);
    };

    const startMaintInfo = async () =>{
        const tempMaintInfo = await getMaintInfo(compId, maintId);
        const tempTests = JSON.parse(tempMaintInfo.tests);        
        const tempCloseDate = tempMaintInfo.closeDate ? getDate(new Date((tempMaintInfo.closeDate.seconds+tempMaintInfo.closeDate.nanoseconds/1000000000)*1000), "yyyy-MM-DD") : getDate(new Date(), "yyyy-MM-DD")
        setMaintInfo(tempMaintInfo);
        setTests(tempTests);
        setClosedDate(tempCloseDate);
        setObservations(tempMaintInfo.observations)
    }

    const addTestListCLickExpand = ()=>{
        const tempAddTestList = addTestList;
        setAddTestList(!tempAddTestList);
    };

    const addTestListChange = (e)=> {
        setSelectedTest(e.target.value);
    };

    const appendTestClick = () => {
        var tempTests = [...tests];
        tempTests.push({desc: '', value:''});
        setTests(tempTests);
    };

    const delTestClick = (index) => {
        var tempTests = [...tests];
        tempTests.splice(index,1);
        setTests(tempTests);
    }
    

    const testChange = (index, value)=> {
        const element = document.getElementById('test-' + index);
        element.classList.remove('NewMaint--requiered');

        const tempTests = [...tests];
        tempTests[index].desc = value;        
        setTests(tempTests);
    };

    const closedDateChange = (e)=> {
        e.preventDefault();
        setClosedDate(getDateFromForm(e.target.value,'-'));

        
    }

    const testValChange = (index, value)=> {
        const tempTests = [...tests];
        tempTests[index].value = value;    
        
        setTests(tempTests);
    };

    const addTestListClick = ()=>{        
        
        for (var i = 0; i < testListsInfo.length; i++){
            
            if (testListsInfo[i].id === selectedTest){
                const addingTestList = testListsInfo[i].tests;
                for (var j = 0; j < addingTestList.length; j++){
                    addingTestList[j].value = '';
                }

                const tempTests = (tests.length === 1 && tests[0].desc === '') ? [...addingTestList] : [...tests,...addingTestList];
                setTests(tempTests);
                setSelectedTest(null);
                setAddTestList(false);
            }
        }
    };

    const saveMaint = (isClosed)=> {
        var allOk = true;
        for (var i = 0; i < tests.length; i++){

            if ( (!tests[i].desc || tests[i].desc === '')
                || (isClosed && tests[i].value === '')
                || (isClosed && tests[i].template === 'XYZ' && (tests[i].value[0] === '' || tests[i].value[1] === '' || tests[i].value[2] === '' ))
            ){
                allOk = false;
                if(tests[i].template && tests[i].template === 'XYZ'){
                    var element = document.getElementById('XYZ-X' + i);
                    element.classList.add('NewMaint--requiered');
                    element = document.getElementById('XYZ-Y' + i);
                    element.classList.add('NewMaint--requiered');
                    element = document.getElementById('XYZ-Z' + i);
                    element.classList.add('NewMaint--requiered');
                }else{
                    const element = document.getElementById('test-val-' + i);
                    element.classList.add('NewMaint--requiered');
                }
            }
        }

        if (!allOk){
            return;
        }

        loadingToggle(true);

        const logLevel = checkLog(true).split(':')[1]*1;
        const uId = logLevel === 0 ? checkLog(true).split(':')[0] : checkLog(true).split(':')[2];
        var maintenance = {...equipData};
        delete maintenance.id;

        if (!maintId){
            maintenance.createdDate = new Date();
        }else{
            const ts = (maintInfo.createdDate.seconds+maintInfo.createdDate.nanoseconds/1000000000)*1000;    
            maintenance.createdDate = new Date(ts);
        }
    
        maintenance.techId = uId;
        maintenance.tests = JSON.stringify(tests);
        maintenance.observations = observations;
        maintenance.equipId = eqId;
        maintenance.maintStatus = isClosed ? 'Closed' : 'Saved';
        maintenance.closeDate = getDateFromForm(document.getElementById('closeDate-value').value, '-');

        createOrUpdate(maintenance, 'company/' + compId + '/maintenances/', maintId).then((doc)=>{

            if (!maintId){
                maintenance.id = doc.id;
            }else{
                maintenance.id = maintId;
           }

            loadingToggle(false);
            if (maintId){
                closeHandler(null, maintenance);
            }else{
                closeHandler(maintenance);
            }
        });

    };


    useEffect(()=>{
        startData();
        uploadTestsLists();
        // eslint-disable-next-line
    },[])

    return (
        <>
            <SectionContainer title={'Mantenimiento Preventivo'} closeHandler={()=>{closeHandler()}}>
                <div className='NewMaint--body'>
                    <div className='NewMaint--title'>
                        Datos del Equipo:
                    </div>
                    {equipData && 
                    <div className='NewMaint--equip-details-body'>
                        <div className='NewMaint--equip-details-body-element'>
                            <div className='NewMaint--equip-details-name'>Nombre</div>
                            <div className='NewMaint--equip-details-value'>{equipData.name}</div>
                        </div>
                        <div className='NewMaint--equip-details-body-element'>
                            <div className='NewMaint--equip-details-name'>Identificador Local</div>
                            <div className='NewMaint--equip-details-value'>{equipData.mac}</div>
                        </div>
                        <div className='NewMaint--equip-details-body-element'>
                            <div className='NewMaint--equip-details-name'>Marca</div>
                            <div className='NewMaint--equip-details-value'>{equipData.brand}</div>
                        </div>
                        <div className='NewMaint--equip-details-body-element'>
                            <div className='NewMaint--equip-details-name'>Modelo</div>
                            <div className='NewMaint--equip-details-value'>{equipData.model}</div>
                        </div>
                        <div className='NewMaint--equip-details-body-element'>
                            <div className='NewMaint--equip-details-name'>No. Serie</div>
                            <div className='NewMaint--equip-details-value'>{equipData.series}</div>
                        </div>
                        <div className='NewMaint--equip-details-body-element'>
                            <div className='NewMaint--equip-details-name'>Área</div>
                            <div className='NewMaint--equip-details-value'>{equipData.area}</div>
                        </div>
                        <div className='NewMaint--equip-details-body-element'>
                            <div className='NewMaint--equip-details-name'>Sub Área</div>
                            <div className='NewMaint--equip-details-value'>{equipData.subArea}</div>
                        </div>
                    </div>
                    }

                    <div className='NewMaint--title'>
                        Mantenimiento Preventivo:
                    </div>

                    <div className='NewMaint--equip-details-body'>
                        <div className='NewMaint--equip-details-body-element'>
                            <div className='NewMaint--equip-details-name'>Fecha de Cierre</div>
                            <input id='closeDate-value' value={getDate(closedDate, "yyyy-MM-DD")} type='date' className='NewMaint--equip-details-value' onChange={closedDateChange} disabled={(maintId && maintInfo && maintInfo.maintStatus === 'Closed')}></input>
                        </div>
                    </div>

                    <div className='NewMaint--equip-details-body-bigelement'>
                        <div className='NewMaint--equip-details-bigname'>
                            Pruebas / Acciones Realizadas:
                        </div>
                        <div id='reportedFailure' className='NewMaint--equip-details-bigvalue'>
                            <div className='NewMaint--add-test-container'>
                                {!(maintId && maintInfo && maintInfo.maintStatus === 'Closed') &&
                                <div className='NewMaint--add-test-button1' onClick={addTestListCLickExpand}>
                                    {addTestList ? 
                                        <><i className="fa-solid fa-angle-left"></i>&nbsp;&nbsp;Cancelar</>
                                    : 
                                        <>Agregar Pruebas&nbsp;&nbsp;<i className="fa-solid fa-angle-right"></i></>}
                                </div>}
                                {addTestList && <>
                                <select className='NewMaint--add-test-dropdown' onChange={addTestListChange}>
                                    <option value={null}>{''}</option>
                                    {testListsInfo && testListsInfo.map((testList, testListIndex)=>{return(
                                        <option key={testListIndex} value={testList.id}>{testList.name}</option>
                                    )})}
                                </select>
                                <div className='NewMaint--add-test-button2' onClick={addTestListClick}>
                                    <i className="fa-solid fa-check"></i>&nbsp;&nbsp;Agregar
                                </div>
                                </>}
                            </div>

                            <div className='NewMaint--testList-container'>

                                {tests.map((test, testIndex)=>{return(
                                <div className='NewMaint--testList-row'>
                                    {!(maintId && maintInfo && maintInfo.maintStatus === 'Closed') && tests.length > 1 ? <i className="fa-solid fa-trash-can NewMaint--testList-icon" onClick={()=>{delTestClick(testIndex)}}></i> : <div></div>}
                                    <textarea id={'test-' + testIndex} className='NewMaint--testList-desc' value={test.desc} onChange={(e)=>testChange(testIndex,e.target.value)} disabled={(maintId && maintInfo && maintInfo.maintStatus === 'Closed')}></textarea>
                                    
                                    <TestTemplates template={test.template ?? 'OKREGULAR'} testIndex={testIndex} value={test.value} units={test.unit} onChange={testValChange} disabled={(maintId && maintInfo && maintInfo.maintStatus === 'Closed')}></TestTemplates>
                                    {/* value={test.val} onChange={(e)=>testValChange(testIndex,e.target.value)} */}
                                </div>
                                )})
                                }
                                
                                {!(maintId && maintInfo && maintInfo.maintStatus === 'Closed') && <i className="fa-light fa-circle-plus NewMaint--testList-add" onClick={appendTestClick}></i>}
                            </div>

                        </div>


                        <div className='NewMaint--equip-details-bigname'>
                            Observaciones:
                        </div>
                        <textarea id='reportedFailure' value={observations} onChange={(e)=>{setObservations(e.target.value)}} className='NewMaint--equip-details-bigvalue' disabled={(maintId && maintInfo && maintInfo.maintStatus === 'Closed')}></textarea>

                    </div>

                    { (maintId && maintInfo && maintInfo.maintStatus === 'Closed') ?
                    <div className='NewMaint--buttons-container'>
                        <button className='NewMaint--cancel-buton' onClick={()=>{closeHandler()}}>Cerrar</button>
                    </div>
                    :
                    <div className='NewMaint--buttons-container'>
                        <button className='NewMaint--create-buton' onClick={()=>{saveMaint(true)}}>Terminar</button>
                        <button className='NewMaint--save-buton' onClick={()=>{saveMaint(false)}}>Guardar</button>
                        <button className='NewMaint--cancel-buton' onClick={()=>{closeHandler()}}>Cancelar</button>
                    </div>
                    }
                    
                </div>
            </SectionContainer>
        </>
    );
};
