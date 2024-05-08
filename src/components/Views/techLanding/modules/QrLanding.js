import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { decryptURL, encryptURL } from '../../../../scripts/auth';

import { equipImgStyle, qrLandingNextMaint } from '../Scripts';
import { NavBar } from '../../../Misc/navBar/NavBar';
import { SectionContainer } from '../../../Misc/sectionContainer/SectionContainer';
import { qrLandingGetImg, qrLandingStartInfo } from '../Scripts';
import { ServiceReqImg } from '../../../Misc/imgComponents/ServiceReqImg';

export const QrLanding = () => {
//U2FsdGVkX1wwSBxkp91ySKaaFGIAxIIljN24dHMKN64PvhARhRriY3DCmMhscigRmYPIlqIcC0yT7wwSBx1xxPSx

const [compData, setCompData] = useState(null);
const [imgUrl, setImgUrl] = useState(null);
const [nextMaintDate, setNExtMaintDate] = useState(null);
const [isError, setIsError] = useState(false);

    let {params} = useParams();
    params = decryptURL(params)
    const companyId = params.split(':')[0];
    const equipId = params.split(':')[1];
 
    
    const getCompData = async () => {

        const tempCompData = await qrLandingStartInfo(companyId, equipId);        
        if (tempCompData !== null){
            const tempImgUrl = await qrLandingGetImg(tempCompData.equipment.equipImg);
            const tempNextMaintDate = await qrLandingNextMaint(tempCompData);
            setCompData(tempCompData);
            setImgUrl(tempImgUrl);
            setNExtMaintDate(tempNextMaintDate);
        }else{
            setIsError(true);
        }

    }

    // const gotoQr = () => {
    //     const encriptedURL = encryptURL(companyId + ':' + equipId);
    //     window.location = '/serviceSheet/' + encriptedURL;
    // };

    const gotoReport = () => {
        const encriptedURL = encryptURL(companyId + ':' + equipId);
        window.location = '/newRep/' + encriptedURL;
    };


    useEffect(()=>{
        getCompData();
        // eslint-disable-next-line
    },[]);

    
    return (
        <>

            {isError && 
                <div className='modal-blurr-bk'>
                    <div className='modal-body'>
                        <div>
                            <i className="fa-light fa-face-sad-sweat"></i>&nbsp;&nbsp;Ocurrió un error!
                        </div>
                    </div>
                </div>
            }

            {(compData) && 
                <NavBar companyName={compData.companyName}/>
            }
            {(compData && !isError) && 
                <div className='home-body'>
                    <div className='home-body-contents'>
                        <SectionContainer title={'Detalles'}>
                            <div className='qrLanding--body-container'>
                                <div className='qrLanding-img-container'>
                                    {imgUrl && <ServiceReqImg img={imgUrl} style={equipImgStyle}></ServiceReqImg>}
                                </div>
                                <div className='qrLanding-details-container'>
                                    <div className='qrLanding--equip-name'>
                                        {compData.equipment.name}
                                    </div>
                                    <div className='qrLanding--next-maint-container'>
                                        <div className='qrLanding--next-maint-title'>
                                            Próximo Mantenimiento:
                                        </div>
                                        <div className='qrLanding--next-maint-value'>
                                            {nextMaintDate}
                                        </div>
                                    </div>
                                    <div className='qrLanding--details-item'>
                                        <div className='qrLanding--details-tag'>
                                            Marca:
                                        </div>
                                        <div className='qrLanding--details-value'>
                                            {compData.equipment.brand}
                                        </div>
                                    </div>
                                    <div className='qrLanding--details-item'>
                                        <div className='qrLanding--details-tag'>
                                            Modelo:
                                        </div>
                                        <div className='qrLanding--details-value'>
                                            {compData.equipment.model}
                                        </div>
                                    </div>
                                    <div className='qrLanding--details-item'>
                                        <div className='qrLanding--details-tag'>
                                            No. Serie:
                                        </div>
                                        <div className='qrLanding--details-value'>
                                            {compData.equipment.series}
                                        </div>
                                    </div>
                                    <div className='qrLanding--details-item'>
                                        <div className='qrLanding--details-tag'>
                                            Área:
                                        </div>
                                        <div className='qrLanding--details-value'>
                                            {compData.equipment.area}
                                        </div>
                                    </div>
                                    <div className='qrLanding--details-item'>
                                        <div className='qrLanding--details-tag'>
                                            Sub Área:
                                        </div>
                                        <div className='qrLanding--details-value'>
                                            {compData.equipment.subArea}
                                        </div>
                                    </div>
                                    <div className='qrLanding--details-item'>
                                        {/* <div className='qrLanding--links'>
                                            <i onClick={gotoQr} className='fa-sharp fa-light fa-qrcode qrLanding-icon'></i>
                                            <div>Ver Etiqueta</div>
                                        </div> */}
                                        <div className='qrLanding--links'>
                                            <i onClick={gotoReport} className='fa-regular fa-light fa-toolbox qrLanding-icon'></i>
                                            <div>Crear Reporte</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SectionContainer>
                    </div>
                </div>
            }
        </>
    );


}
