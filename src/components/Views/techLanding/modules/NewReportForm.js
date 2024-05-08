import React, {useState, useEffect} from 'react';
import { SectionContainer } from '../../../Misc/sectionContainer/SectionContainer';
import { newReportFormStartData, newReportFormUData, reportImgStyle } from '../Scripts';
import { ServiceReqImg } from '../../../Misc/imgComponents/ServiceReqImg';
import { createOrUpdate } from '../../../../scripts/updates';
import { uploadReportImg } from '../../../../scripts/files';
import { checkLog } from '../../../../scripts/auth';

export const NewReportForm = ( {compId, eqId, loadingToggle, closeHandler} ) => {

    const [loadedImgs, setLoadedImgs] = useState([]);
    const [hoveredImg, setHoveredImg] = useState(null);
    const [equipData, setEquipData] = useState(null);
    const [addingImgSizeExceded, setAddingImgSizeExceded] = useState(false);
    const [formData, setFormData] = useState({reporting:'',reportedFailure:''});
    const [uData, setUData] = useState(null);

    const startData = async ()=> {
        loadingToggle(true);

        const logDetails = checkLog(true);
        var tempUData = null;
        if (logDetails){ 
            
            if (logDetails.split(':')[1]*1 === 0){
                tempUData = await newReportFormUData(logDetails.split(':')[0]);
            }else{
                console.log(logDetails);
                tempUData = await newReportFormUData(logDetails.split(':')[2]);
            }
        }
        
        const tempEquipInfo = await newReportFormStartData(compId, eqId);
        if (tempUData){
            const tempFormData = {reporting:tempUData.name + ' ' + tempUData.lastName,reportedFailure:''};
            setFormData(tempFormData);
        }
        setUData(tempUData);
        setEquipData(tempEquipInfo);

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
        tempImgs.push({fileUrl:fileUrl, file:file});
        setLoadedImgs(tempImgs);
        setAddingImgSizeExceded(false);
    };

    const hoverImg = (index)=> {
        setHoveredImg(index);
    };

    const delImage = (index)=> {
        var tempImgs = [...loadedImgs];
        tempImgs.splice(index,1);
        setLoadedImgs(tempImgs);
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

    const saveForm = async ()=> {
        loadingToggle(true);
        var allOk = true;

        for (const key in formData){
            if (formData[key] === '' || !formData[key]){
                const element = document.getElementById(key);
                element.classList.add('NewRepForm--requiered')
                allOk = false;
            }
        }

        if (!allOk){
            loadingToggle(false);
            return;
        }

        const tempFormData = {...formData};
        tempFormData['equipId'] = eqId;
        tempFormData['status'] = 'Reportado'
        tempFormData['reportedDate'] = new Date();
        // tempFormData[createdBy] = sysdate();



        createOrUpdate(tempFormData,'company/' + compId + '/reports/').then( async (doc)=>{
            tempFormData.id = doc.id;
            if (loadedImgs.length > 0){
                const imgPaths = [];

                for (var i = 0; i < loadedImgs.length; i++){
                    const imgPath = await uploadReportImg(loadedImgs[i].file, compId, eqId, doc.id);
                    imgPaths.push(imgPath);
                }

                tempFormData['reportedImgs'] = imgPaths.join(':');
                await createOrUpdate(tempFormData,'company/' + compId + '/reports/', doc.id) 
            }
            
            loadingToggle(false);
            closeHandler(tempFormData);
        });


    };

    useEffect(()=>{
        startData();
        // eslint-disable-next-line
    },[])


    return(
        <>
            <SectionContainer title={'Crear Reporte'} closeHandler={()=>{closeHandler()}}>
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
                            <div className='NewRepForm--equip-details-name'>Quién Reporta:</div>
                            <input id='reporting' value={formData.reporting}  onChange={updateForm} type='text' className='NewRepForm--equip-details-value' disabled={uData}></input>
                        </div>
                        <div className='NewRepForm--equip-details-body-bigelement'>
                            <div className='NewRepForm--equip-details-bigname'>Falla Reportada / Servicio Requerido:</div>
                            <textarea id='reportedFailure' value={formData.reportedFailure} onChange={updateForm} className='NewRepForm--equip-details-bigvalue'></textarea>
                        </div>
                        <div className='NewRepForm--equip-details-body-bigelement'>
                            <div className='NewRepForm--equip-details-bigname'>
                                Imágenes:
                            </div>
                            <div className='NewRepForm--report-img-array'>
                                {loadedImgs.length > 0 &&
                                    loadedImgs.map((img, index)=>{return(
                                        
                                        <div key={index} className='NewRepForm--rep-img-container' onMouseEnter={()=>{hoverImg(index)}} onClick={()=>{hoverImg(index)}} onMouseLeave={()=>{hoverImg(null)}}>
                                            {hoveredImg === index ?
                                            <button className='NewRepForm--del-rep-img' onClick={()=>{delImage(index)}}><i className="fa-solid fa-trash-xmark"></i></button>
                                            :<div></div>
                                            }
                                            <ServiceReqImg key={index} img={img.fileUrl} style={reportImgStyle}></ServiceReqImg>
                                        </div>
                                        
                                    )})
                                }
                            </div>
                            { addingImgSizeExceded && <div className='NewRepForm--img-error-msg'>Tamaño de Imagen Excedido</div>}
                            {loadedImgs.length <= 2 &&
                            <>
                            <label htmlFor="files" className='NewRepForm--upload-img-button'>{loadedImgs.length > 0 ? 'Añadir Imagen':'Añadir imagen'}</label>
                            <input id="files" type='file' style={{visibility:'hidden'}} accept='image/*' onChange={preLoadImg}></input>
                            </>
                            }
                        </div>
                    </div>
                    <div className='NewRepForm--buttons-container'>
                        <button className='NewRepForm--create-buton' onClick={saveForm}>Crear</button>
                        <button className='NewRepForm--cancel-buton' onClick={()=>{closeHandler()}}>Cancelar</button>
                    </div>
                </div>}
            </SectionContainer>
        </>
    )
};
