import React, {useState, useEffect} from 'react';
import { SectionContainer } from '../../../Misc/sectionContainer/SectionContainer';
import { newReportFormStartData, newReportFormUData, reportImgStyle,repDetailsGetRepInfo, repDetailsGetRepImgs, repDetailsGetEvidenceImgs } from '../Scripts';
import { ServiceReqImg } from '../../../Misc/imgComponents/ServiceReqImg';
import { createOrUpdate } from '../../../../scripts/updates';
import { deleteFile, uploadReportImg } from '../../../../scripts/files';
import { checkLog } from '../../../../scripts/auth';

export const ReportDetails = ( {compId, eqId, reportId, loadingToggle, closeHandler, locked} ) => {

    const [loadedImgs, setLoadedImgs] = useState([]);
    const [reportedImgs, setReportedImgs] = useState(null);
    // const [editingReport, setEditingReport] = useState(false); 
    const [hoveredImg, setHoveredImg] = useState(null);
    const [equipData, setEquipData] = useState(null);
    const [addingImgSizeExceded, setAddingImgSizeExceded] = useState(false);
    const [formData, setFormData] = useState();
    const [repInfo, setRepInfo] = useState(null);
    const [uData, setUData] = useState(null);

    const startData = async ()=> {
        loadingToggle(true);

        const logDetails = checkLog(true);
        var tempUData = null;
        if (logDetails.split(':')[1]*1 === 0){
            tempUData = await newReportFormUData(logDetails.split(':')[0]);
        }else{
            tempUData = await newReportFormUData(logDetails.split(':')[2]);
        }
        const tempEquipInfo = await newReportFormStartData(compId, eqId);
        const tempRepInfo = await repDetailsGetRepInfo(compId, reportId);
        var tempFormData = {...{tech:'',foundings:'', observations:''},...tempRepInfo};
        if (tempUData && (!tempFormData.tech || tempFormData.tech === '')){
            tempFormData.tech = tempUData.name + ' ' + tempUData.lastName;
        }
        setFormData(tempFormData);
        const tempRepImgs = await repDetailsGetRepImgs(tempRepInfo.reportedImgs);
        const tempLoadedImgs = await repDetailsGetEvidenceImgs(tempRepInfo.evidenceImgs);
        setUData(tempUData);
        setEquipData(tempEquipInfo);
        setRepInfo(tempRepInfo);
        setReportedImgs(tempRepImgs);
        setLoadedImgs(tempLoadedImgs ?? []);

        loadingToggle(false);

    };

    const preLoadImg = (e)=> {
        const file = e.target.files[0];
        if (file.size > 2097152){
            setAddingImgSizeExceded(true);
            return;
        }
        var tempImgs = [...loadedImgs]
        const fileUrl = URL.createObjectURL(file);
        tempImgs.push({fileUrl:fileUrl, file:file, saved:false, fileName:null});
        setLoadedImgs(tempImgs);
        setAddingImgSizeExceded(false);
    };

    const hoverImg = (index)=> {
        setHoveredImg(index);
    };

    const delImage = async (index)=> {
    
        var tempImgs = [...loadedImgs];

        if (tempImgs[index].saved === true){

            tempImgs[index].saved = 'deleted';
            setLoadedImgs(tempImgs);

        }else{
            tempImgs.splice(index,1);
            setLoadedImgs(tempImgs);
        }

    

    };

    const updateForm = (e)=> {

        const fieldName = e.target.id;
        const fileVal = e.target.value;
        const tempFormData = {...formData};
        const element = document.getElementById(fieldName);

        element.classList.remove('NewRepForm--requiered')

        tempFormData[fieldName] = fileVal;
        setFormData(tempFormData);
    };

    const responseClcik = ()=> {
        var tempFormData = {...formData};
        tempFormData.status = 'En Proceso';
        setFormData(tempFormData);
    };

    const saveForm = async ()=> {
        loadingToggle(true);
        var allOk = true;

        for (const key in formData){

            if (formData[key] === '' || !formData[key]){
                if (key==='observations' || key === 'evidenceImgs'){
                    continue;
                }else if (key==='foundings' && formData.status !== 'Finalizado' && formData.status !== 'Cancelado'){
                    continue;
                }
                const element = document.getElementById(key);
                element.classList.add('NewRepForm--requiered')
                allOk = false;
            }
        }

        if (!allOk){
            loadingToggle(false);
            return;
        }

        var tempFormData = {...repInfo,...formData};

        for ( const key in tempFormData){
            if (key.toLowerCase().includes('date')){
                tempFormData[key] = tempFormData[key].toDate();
            }
        }
    
        tempFormData['lastUpdateDate'] = new Date();
        if (tempFormData.status === 'Finalizado'){
            tempFormData['closeDate'] = new Date();
        }

      
        delete tempFormData.id;

        createOrUpdate(tempFormData,'company/' + compId + '/reports/', reportId).then( async (doc)=>{
            tempFormData.id = reportId;
            if (loadedImgs.length > 0){
                const imgPaths = [];

                for (var i = 0; i < loadedImgs.length; i++){
                    if(loadedImgs[i].saved === false){
                        const imgPath = await uploadReportImg(loadedImgs[i].file, compId, eqId, reportId);
                        imgPaths.push(imgPath);
                    }else if (loadedImgs[i].saved === 'deleted'){
                        await deleteFile(loadedImgs[i].fileName);
                    }else if (loadedImgs[i].saved === true){
                        imgPaths.push(loadedImgs[i].fileName)
                    }
                }

                tempFormData['evidenceImgs'] = imgPaths.join(':');
                await createOrUpdate(tempFormData,'company/' + compId + '/reports/', reportId) 
            }

            closeHandler(null, tempFormData);
            loadingToggle(false);
        });


    };

    useEffect(()=>{
        startData();
        // eslint-disable-next-line
    },[])


    return(
        <>
            <SectionContainer title={'Reporte'} closeHandler={()=>{closeHandler(null)}}>
                {equipData &&
                <div className='NewRepForm--body'>
                    <div className='NewRepForm--title'>
                        Datos del Equipo:
                    </div>
                    <div className='NewRepForm--equip-details-body'>
                        <div className='NewRepForm--equip-details-body-element'>
                            <div className='NewRepForm--equip-details-name'>Nombre</div>
                            <div className='NewRepForm--equip-details-value'>{equipData.name}</div>
                        </div>
                        <div className='NewRepForm--equip-details-body-element'>
                            <div className='NewRepForm--equip-details-name'>Identificador Local</div>
                            <div className='NewRepForm--equip-details-value'>{equipData.mac}</div>
                        </div>
                        <div className='NewRepForm--equip-details-body-element'>
                            <div className='NewRepForm--equip-details-name'>Marca</div>
                            <div className='NewRepForm--equip-details-value'>{equipData.brand}</div>
                        </div>
                        <div className='NewRepForm--equip-details-body-element'>
                            <div className='NewRepForm--equip-details-name'>Modelo</div>
                            <div className='NewRepForm--equip-details-value'>{equipData.model}</div>
                        </div>
                        <div className='NewRepForm--equip-details-body-element'>
                            <div className='NewRepForm--equip-details-name'>No. Serie</div>
                            <div className='NewRepForm--equip-details-value'>{equipData.series}</div>
                        </div>
                        <div className='NewRepForm--equip-details-body-element'>
                            <div className='NewRepForm--equip-details-name'>Área</div>
                            <div className='NewRepForm--equip-details-value'>{equipData.area}</div>
                        </div>
                        <div className='NewRepForm--equip-details-body-element'>
                            <div className='NewRepForm--equip-details-name'>Sub Área</div>
                            <div className='NewRepForm--equip-details-value'>{equipData.subArea}</div>
                        </div>
                    </div>
                    <div className='NewRepForm--title'>
                        Reporte:
                    </div>
                    <div className='NewRepForm--equip-details-body'>
                        <div className='NewRepForm--equip-details-body-element'>
                            <div className='NewRepForm--equip-details-name'>Reportó:</div>
                            <div type='text' className='NewRepForm--equip-details-value'>{repInfo.reporting} </div>
                        </div>
                        <div className='NewRepForm--equip-details-body-bigelement'>
                            <div className='NewRepForm--equip-details-bigname'>Falla Reportada / Servicio Requerido:</div>
                            <div className='NewRepForm--equip-details-bigvalue'>{repInfo.reportedFailure}</div>
                        </div>

                        <div className='NewRepForm--equip-details-body-bigelement'>
                            <div className='NewRepForm--equip-details-bigname'>
                                Imágenes Reportadas:
                            </div>
                            <div className='NewRepForm--report-img-array'>
                                {reportedImgs &&
                                    reportedImgs.map((img, index)=>{return(
                                        
                                        <div key={index} className='NewRepForm--rep-img-container-ro'>
                                            <ServiceReqImg key={index} img={img} style={reportImgStyle}></ServiceReqImg>
                                        </div>
                                        
                                    )})
                                }
                            </div>
                        </div>

                    </div>



                    {formData.status !== 'Reportado' && <>
                    <div className='NewRepForm--title'>
                        Servicio:
                    </div>

                    <div className='NewRepForm--equip-details-body'>
                        <div className='NewRepForm--equip-details-body-element'>
                            <div className='NewRepForm--equip-details-name'>Técnico:</div>
                            <input id='tech' value={formData.tech}  onChange={updateForm} type='text' className='NewRepForm--equip-details-value' disabled={locked || uData || repInfo.status === 'Finalizado' || repInfo.status === 'Cancelado'}></input>
                        </div>
                        <div className='NewRepForm--equip-details-body-bigelement'>
                            <div className='NewRepForm--equip-details-bigname'>Falla Encontrada / Servicio Realizado:</div>
                            <textarea id='foundings' value={formData.foundings} onChange={updateForm} className='NewRepForm--equip-details-bigvalue' disabled={locked || repInfo.status === 'Finalizado' || repInfo.status === 'Cancelado'}></textarea>
                        </div>
                        <div className='NewRepForm--equip-details-body-bigelement'>
                            <div className='NewRepForm--equip-details-bigname'>Observaciones:</div>
                            <textarea id='observations' value={formData.observations} onChange={updateForm} className='NewRepForm--equip-details-bigvalue' disabled={locked || repInfo.status === 'Finalizado' || repInfo.status === 'Cancelado'}></textarea>
                        </div>
                    </div>

                    <div className='NewRepForm--equip-details-body-bigelement'>
                        <div className='NewRepForm--equip-details-bigname'>
                            Imágenes:
                        </div>
                        <div className='NewRepForm--report-img-array'>
                            {(loadedImgs && loadedImgs !== '' && loadedImgs.length <= 2) &&
                                loadedImgs.map((img, index)=>{return(
                                    
                                    <>{img.saved !== 'deleted' &&
                                    <div key={index} className='NewRepForm--rep-img-container' onMouseEnter={()=>{hoverImg(index)}} onClick={()=>{hoverImg(index)}} onMouseLeave={()=>{hoverImg(null)}}>
                                        {(hoveredImg === index && !locked && repInfo.status !== 'Finalizado' && repInfo.status !== 'Cancelado')?
                                        <button className='NewRepForm--del-rep-img' onClick={()=>{delImage(index)}}><i className="fa-solid fa-trash-xmark"></i></button>
                                        :<div></div>
                                        }
                                        <ServiceReqImg key={index} img={img.fileUrl} style={reportImgStyle}></ServiceReqImg>
                                    </div>
                                    }</>
                                )})
                            }
                        </div>
                        { addingImgSizeExceded && <div className='NewRepForm--img-error-msg'>Tamaño de Imagen Excedido</div>}
                        {(!locked && loadedImgs && loadedImgs !== '' && loadedImgs.length <= 2 && repInfo.status !== 'Finalizado' && repInfo.status !== 'Cancelado') &&
                        <>
                        <label htmlFor="files" className='NewRepForm--upload-img-button'>{loadedImgs.length > 0 ? 'Añadir Imagen':'Añadir imagen'}</label>
                        <input id="files" type='file' style={{visibility:'hidden'}} accept='image/*' onChange={preLoadImg}></input>
                        </>
                        }
                    </div>

                    <div className='NewRepForm--equip-details-body'>
                        <div className='NewRepForm--equip-details-body-element'>
                            <div className='NewRepForm--equip-details-name'>Estátus:</div>
                            <select id='status' value={formData.status}  onChange={updateForm} type='text' className='NewRepForm--equip-details-value' disabled={locked || repInfo.status === 'Finalizado' || repInfo.status === 'Cancelado'}>
                                <option>En Proceso</option>
                                <option>Cancelado</option>
                                <option>Finalizado</option>
                            </select>
                        </div>
                    </div>      
                    </>}
                    

                    <div className='NewRepForm--buttons-container'>
                        {(!locked && formData.status === 'Reportado') && <button className='NewRepForm--create-buton' onClick={responseClcik}>Responder</button>}
                        {(!locked && repInfo.status !== 'Finalizado' && repInfo.status !== 'Cancelado' && formData.status !== 'Reportado') && <button className='NewRepForm--create-buton' onClick={saveForm}>Guardar</button>}
                        <button className='NewRepForm--cancel-buton' onClick={()=>{closeHandler(null)}}>Cancelar</button>
                    </div>
                    

                </div>}
            </SectionContainer>
        </>
    )
};
