
import { dbQueryById, dbQueryCols } from "../../../scripts/queries"

export const siteAddressFields = [
    'companyName',
    'street',
    'number',
    'col',
    'city',
    'state',
    'cP',
    'tel'
]

export const siteAddressFieldsEsp = [
    'Nombre',
    'Calle',
    'Número',
    'Colonia',
    'Ciudad',
    'Estado',
    'Código Postal',
    'Teléfono'
]



export const SitesSAStartData = async ()=> {
    const sitesData = await dbQueryCols('group');
    return sitesData;
}

export const getSiteData = async (companies)=> {
    let tempCompanies = [];
    if (!companies || companies[0]===''){
        return [];
    }

    for (let i = 0; i < companies.length; i++) {
        const siteData = await dbQueryById('company', companies[i]);
        tempCompanies.push({...siteData});
    }

    return tempCompanies;
}

export const getAllHospisNotInGroup = async (currentHospis)=>{
    const allHospis = await dbQueryCols('company');

    if (!allHospis){
        return [];
    }

    const retVal = []

    for (let i = 0; i < allHospis.length; i++) {
        let alreadyThere = false;
        for (let j = 0; j < currentHospis.length; j++){
            if (currentHospis[j].id === allHospis[i].id){
                alreadyThere = true;
            }
        }
        if(!alreadyThere) {
            retVal.push(allHospis[i]);
        }
    }

    return retVal;

}