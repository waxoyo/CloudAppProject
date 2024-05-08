import { checkLog } from "../../../scripts/auth";
import { dbQueryById, dbQueryCols, dbQuery } from "../../../scripts/queries";
import { createOrUpdate } from "../../../scripts/updates";
import { OrdAndFilt } from "../../../scripts/utils";

export const maintenancePeriodicity = {
    1:'Mensual',
    2:'Bimestral',
    3:'Trimestral',
    4:'Cada 4 Meses',
    5:'Cada 5 Meses',
    6:'Semestral',
    7:'Cada 7 Meses',
    8:'Cada 8 Meses',
    9:'Cada 9 Meses',
    10:'Cada 10 Meses',
    11:'Cada 11 Meses',
    12: 'Anual'
};

export const siteEquipFields = [
    'name',
    'localId',
    'brand',
    'model',
    'series',
    'area',
    'subArea',
    'maintPeriod',
    'groupId',
]

export const siteEquipFieldsEsp = [
    'Nombre',
    'Identificador Local',
    'Marca',
    'Modelo',
    'No. Serie',
    'Área',
    'Sub Área',
    'Periodo Mtto.',
    'Grupo',
]

export const equipImgStyle = 
{  
    'objectFit:': 'fill',
    'maxHeight': '300px',
    'maxWidth': '100%',
};


export const startFilterByObject = (companies)=> {
    
    var retVal = {}

    for (var i = 0; i < companies; i++){
        retVal[i] = {field: 'name' ,reversed: false};
    }  
    return retVal;
};



export const sitesEquipAdminStartData = async (siteId) => {
    const logInfo = checkLog(true);
    const logLevel = logInfo.split(':')[1]*1;

    var siteInfo = null;
    
    
    if (logLevel === 1){
        siteInfo = await dbQueryById('group', siteId);
        const companies = siteInfo.companiesStr.split(',')
        siteInfo.companies = [];

        for (var i = 0; i < companies.length; i++){

            //equip Companies and Groups
            var companyInfo = await dbQueryById('company', companies[i]);
            siteInfo.companies.push({...companyInfo});

            //equipment
            const equipment = await dbQueryCols('company/' + companies[i] + '/equipment');
            if (equipment){
                var temp = [...OrdAndFilt.order(equipment, 'series', false)];
                temp = [...OrdAndFilt.order(temp, 'area', false)];
                temp = [...OrdAndFilt.order(temp, 'name', false)];
                siteInfo.companies[i].equipment = temp;
            }

        }
    }else if (logLevel === 0){
        var tempCompanies = await dbQueryCols('company');
        tempCompanies = OrdAndFilt.order(tempCompanies, 'companyName');
        const companies = [...tempCompanies];

        for (var i = 0; i < companies.length; i++){
            const equipment = await dbQueryCols('company/' + companies[i].id + '/equipment');
            if (equipment){
                                
                var temp = [...OrdAndFilt.order(equipment, 'series', false)];
                temp = [...OrdAndFilt.order(temp, 'area', false)];
                temp = [...OrdAndFilt.order(temp, 'name', false)];
                companies[i].equipment = [...temp];
            }
        }

        siteInfo = {
            name: 'Administrador',
            companyLimit: 10000,
            active: 'Y',
            companies: companies
        };
    }

console.log(siteInfo);

    return siteInfo;
};


export const sitesEquipAdminGetUData = async (companies)=> {
    var uDataAll = {};

    for (var i = 0; i < companies.length; i++){
        const uData = await dbQuery('uData', {attribute:'company', operator:'==', value:companies[i].id});
        uDataAll[companies[i].id] = uData;
    }
    return uDataAll;
};


export const sitesEquipAdminRetValFromArr = (id, arr)=> {
    if (!id || !arr) {
        return {};
    }

    for (var i = 0; i < arr.length; i++){
        
        if (arr[i].id === id){
            return arr[i]; 
        }
    }
    return {};
};


export const sitesEquipAdminGroupData = async ()=> {
    var tempGroups = await dbQueryCols('equipGroups');
    tempGroups = OrdAndFilt.order(tempGroups, 'name');
    return tempGroups;
};




// export const migrateGroups = async ()=> {
//     const docs = await dbQueryCols('company/XEiZ0aedYWd7BI3QW9eK/equipGroups');
//     for (var i = 0; i < docs.length; i++){
//         var group = {name: docs[i].name}
//         await createOrUpdate(group, 'equipGroups');
//     }
    
// }