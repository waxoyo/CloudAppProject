import { dbQueryById, dbQuery, dbQueryAll, dbQueryCols } from "../../../scripts/queries";
import { OrdAndFilt } from "../../../scripts/utils";


export const siteAddressFields = [
    'street',
    'number',
    'col',
    'city',
    'state',
    'cP',
    'tel'
]

export const siteAddressFieldsEsp = [
    'Calle',
    'Número',
    'Colonia',
    'Ciudad',
    'Estado',
    'Código Postal',
    'Teléfono'
]


export async function sitesStartData(siteId, logLevel){
    var siteInfo = null;

    if (logLevel === 1){ 
        siteInfo = await dbQueryById('group', siteId);
        
        const companies = siteInfo.companiesStr.split(',')
        siteInfo.companies = [];
        for (var i = 0; i < companies.length; i++){
            var companyInfo = await dbQueryById('company', companies[i])
            if (companyInfo){
                const uData = await dbQuery('uData', {attribute:'company', operator:'==', value:companyInfo.id});
                
                if (uData){                
                    companyInfo.users = ([...uData]);
                }
            }
            siteInfo.companies.push({...companyInfo});
        }
    }else if (logLevel === 0 ){

        const allCompanies = await dbQueryCols('company');
        for (var i = 0; i < allCompanies.length; i++){
            
            const uData = await dbQuery('uData', {attribute:'company', operator:'==', value:allCompanies[i].id});
            if (uData){                
                allCompanies[i].users = ([...uData]);
            }
            
        }
        
        siteInfo = {
            name: 'Administrador',
            companyLimit:10000,
            companies:allCompanies
        }
    }

    siteInfo.companies = OrdAndFilt.order(siteInfo.companies, 'companyName');

    return siteInfo;
};


export const validateEmail = async (email, id)=> {
    id = id ?? 0;
    const usersData = await dbQueryCols('uData');

    if (!usersData || usersData.length === 0){
        return true;
    }

    for (var i = 0; i < usersData.length; i++){
        if(usersData[i].email === email && id !== usersData[i].id){
            return false;
        }
    }

    return true;

}