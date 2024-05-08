import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { dbQueryById } from '../../../scripts/queries';
import logoSl from '../../../img/logo_azul_sl.png';
import { encryptURL } from '../../../scripts/auth';

export const QrLabels = ( {companyId, equipId} ) => {

    const [companyInfo, setCompanyInfo] = useState(null);


    const getData = async () => {
        let collection = 'company/';
        let docData = await dbQueryById(collection, companyId);
        if (!docData) {
            setCompanyInfo(false);
            return;
        }
        collection = 'company/' + companyId + '/equipment/';
        const equipDocData = await dbQueryById(collection, equipId);
        if (!equipDocData) {
            setCompanyInfo(false);
            return;
        }
        docData.equipment = equipDocData;
        docData.equipment.id = equipId;
        setCompanyInfo(docData);
    }

    useEffect(()=>{
        getData();
        // eslint-disable-next-line
    },[]);

    console.log(companyId, equipId);

    return (
        <>
        {companyInfo &&
            <div className='sticker-body'>
                <div className='sticker-container'>
                    <img src={logoSl} alt='' className='sticker-img'></img>
                    <div className='sticker-head'>
                        <div className='sticker-comp'>{companyInfo.companyName}</div>
                        <div className='sticker-equip'>{companyInfo.equipment.name}</div>
                    </div>
                </div>
                <div className='sticker-middle'>
                    <div>
                        <div className='sticker-details-cont'>
                            <div className='ss-details-tag'>Marca:</div>
                            <div className='ss-details-val'>{companyInfo.equipment.brand}</div>
                        </div>
                        <div className='sticker-details-cont'>
                            <div className='ss-details-tag'>Modelo:</div>
                            <div className='ss-details-val'>{companyInfo.equipment.model}</div>
                        </div>
                        <div className='sticker-details-cont'>
                            <div className='ss-details-tag'>No. Serie:</div>
                            <div className='ss-details-val'>{companyInfo.equipment.series}</div>
                        </div>
                        <div className='sticker-details-cont'>
                            <div className='ss-details-tag'>Área:</div>
                            <div className='ss-details-val'>{companyInfo.equipment.area}</div>
                        </div>
                    </div>
                    <div className='sticker-qr-container'>
                        <QRCodeSVG 
                        // value={window.location} 
                        value={'http://cie.biomedicasustentable.com/equipdetails/' + encryptURL(companyId + ':' + equipId)}
                        // value={'http://192.168.1.71:3000/equipdetails/' + encryptURL(companyId + ':' + equipId)}
                        
                        size={100}   
                        // imageSettings={{
                        //     src: logoBk,
                        //     x: undefined,
                        //     y: undefined,
                        //     height: 20,
                        //     width: 20,
                        //     excavate: true,
                        // }}
                    />
                    </div>
                    {/* <div className='sticker-details-foot'><br/>Biomédica Sustentable</div> */}
                </div>
            </div>
        }
        </>
    )
}
