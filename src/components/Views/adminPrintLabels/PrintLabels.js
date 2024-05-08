import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { decryptURL } from '../../../scripts/auth';
import { QrLabels } from './QrLabels';

export const PrintLabels = () => {

    let {params} = useParams();
    params = decryptURL(params);
    const data = JSON.parse(params);

    const [dataObject, setDataObject] = useState(null);

    const initialize = ()=> {
        var dataObject = [];
        for (const comp in data) {
            var tempObject = {companyId: comp, equips: []}
            for (const equip in data[comp]) {
                if (data[comp][equip]){
                    tempObject.equips.push({equipId:equip});
                }
            }
            dataObject.push(JSON.parse(JSON.stringify(tempObject)));
        }
        console.log(data);
        
        setDataObject(dataObject);
    }

    useEffect(()=>{
        initialize();
        // eslint-disable-next-line
    },[]);

    return (
        <div>
            <div className='allStickers'>
            {dataObject && dataObject.map((comp, comIndex)=>{return(
                <>
                {comp.equips.length > 0 &&  comp.equips.map((equip, equipIndex)=>{return(         
                    <QrLabels companyId={comp.companyId} equipId={equip.equipId}/>
                )})}
                </>
            )})}
            </div>
        </div>
    );
}
