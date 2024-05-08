import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import loadingGif from '../../../../img/loading.gif';
import { SectionContainer } from '../../../Misc/sectionContainer/SectionContainer';
import { loadingModalStyle } from '../../../../scripts/consts';
import { NewReportForm } from './NewReportForm';
import { decryptURL, encryptURL } from '../../../../scripts/auth';

export const NewReportEnvelope = () => {

    const [loadingPage, setLoadingPage] = useState(false);
    const [reportCreated, setReportCreated] = useState(false);

    let { params } = useParams();
    params = decryptURL(params);
    const companyId = params.split(':')[0];
    const equipId = params.split(':')[1];

    const loadingToggle = (loading)=> {
        setLoadingPage(loading);
    };

    const closeHandler = (data)=> {
        if (data){
            setReportCreated(true);
        }else{
            const url = encryptURL(params);
            window.location = '/equipdetails/' + url;
        }
    }

    return (
        <>

            {loadingPage && 
                <div className='modal-blurr-bk'>
                    <div className='modal-loading'>
                        <img src={loadingGif} alt='' style={loadingModalStyle}/>
                    </div>
                </div>
            }

            {(reportCreated) &&
                <div className='modal-blurr-bk'>
                    <div className='modal-loading'>
                        <SectionContainer title={'Reporte Creado'}>
                            <div className='techLand--callback-button-container'>
                                <button className='techLand--callback-button' onClick={()=>{closeHandler()}}>Aceptar</button>
                            </div>
                        </SectionContainer>
                    </div>
                </div>
            }

            <div className="home-body">
                <div className="home-body-contents">
                    <NewReportForm
                        compId={companyId}
                        eqId={equipId}
                        loadingToggle={loadingToggle}
                        closeHandler={closeHandler}
                    />
                </div>
            </div>
        </>
    );
};
