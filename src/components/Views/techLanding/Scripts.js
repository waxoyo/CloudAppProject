import { checkLog } from "../../../scripts/auth";
import { getImgUrl } from "../../../scripts/files";
import { dbQueryCols, dbQueryById, dbQuery } from "../../../scripts/queries";
import { createOrUpdate } from "../../../scripts/updates";
import { OrdAndFilt, getDate } from "../../../scripts/utils";


export const equipImgStyle = 
{  
    'objectFit:': 'fill',
    'maxHeight': '300px',
    'maxWidth': '100%',
};

export const reportImgStyle = 
{  
    'objectFit:': 'fill',
    'maxHeight': '150px',
    'maxWidth': '100%',
};

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


export const techLandingStartData = async (params)=> {
    const compId = params ? params : checkLog(true).split(':')[0];
    var compData = await dbQueryById('company',compId);

    if (compData.active !== 'Y'){
        return null;
    }

    var equipData = await dbQueryCols('company/' + compId + '/equipment');
    equipData = OrdAndFilt.order(equipData,'name');

    var reportData = await dbQueryCols('company/' + compId + '/reports');
    reportData = OrdAndFilt.orderDate(reportData,'reportedDate', true)

    var maintData = await dbQueryCols('company/' + compId + '/maintenances');
    maintData = OrdAndFilt.orderDate(maintData,'createdDate', true)

    var tempReportObject = {};
    var tempMaintObject = {};


    if (reportData){
        for (let i = 0; i < reportData.length; i++){

            if(!tempReportObject[reportData[i].equipId]){
                tempReportObject[reportData[i].equipId] = [];
            }
            tempReportObject[reportData[i].equipId].push(reportData[i]);

        }
        
        for (let i = 0; i < equipData.length; i++){
            if (!tempReportObject[equipData[i].id]){
                equipData[i].reports = [];
            }else{
                equipData[i].reports = tempReportObject[equipData[i].id];
            }
        }
    }

    if (maintData){
        for (let i = 0; i < maintData.length; i++){

            if(!tempMaintObject[maintData[i].equipId]){
                tempMaintObject[maintData[i].equipId] = [];
            }
            tempMaintObject[maintData[i].equipId].push(maintData[i]);

        }
        
        for (let i = 0; i < equipData.length; i++){
            if (!tempMaintObject[equipData[i].id]){
                equipData[i].maintenances = [];
            }else{
                equipData[i].maintenances = tempMaintObject[equipData[i].id];
            }
        }
    }
    
    compData.equipment = equipData;
       

    return compData;
};

export const getGroupsData = async ()=> {
    const groupsData = await dbQueryCols('equipGroups/');
    return groupsData;
};

export const newMaintGetTests = async ()=> {
    var testListsData = await dbQueryCols('testLists/');
    for (var i = 0; i < testListsData.length; i++){
        var listData = await dbQueryCols('testLists/' + testListsData[i].id + '/tests/');
        if (listData){
            listData = OrdAndFilt.order(listData, 'orderBy');
        }
        testListsData[i].tests = listData
    }

    testListsData = OrdAndFilt.order(testListsData, 'name');

    return testListsData;
}

export const getGroupName = (groupId, groupsData)=> {
    for (var i = 0; i < groupsData.length; i++){
        if (groupId === groupsData[i].id){
            return groupsData[i].name;
        }
    }
    return null;
};

export const getAllGroupNames = (equipInfo, groupsData)=> {
    for (var i = 0; i < equipInfo.length; i++){
        equipInfo[i].groupName = getGroupName(equipInfo[i].groupId, groupsData);
    }
    return equipInfo;
};

export const getSelectedTiles = (equipInfo)=> {
    var tempSelectedTiles = {};
    for (var i = 0; i < equipInfo.length; i++){
        tempSelectedTiles[equipInfo[i].id] = 0;
    }
    return tempSelectedTiles;
};



export const newReportFormStartData = async (compId, eqId)=> {

    const tempEquipInfo = await dbQueryById('company/' + compId + '/equipment', eqId);
    return tempEquipInfo;
};

export const newReportFormUData = async (uId) => {
    const uData = await dbQueryById('uData',uId);
    return uData;
};

export const repDetailsGetRepInfo = async (compId, repId)=> {
    const repData = await dbQueryById('company/' + compId + '/reports', repId);
    return repData;
};

export const repDetailsGetRepImgs = async (imgs)=> {
    if (!imgs) {
        return null;
    }

    const imgArr = imgs.split(':');
    const retImgs = [];

    for (var i = 0; i < imgArr.length; i++){
        const imgUrl = await getImgUrl(imgArr[i]);
        retImgs.push(imgUrl);
    }
    return retImgs;
};

export const repDetailsGetEvidenceImgs = async (imgs)=> {
    if (!imgs || imgs==='') {
        return null;
    }
    const imgArr = imgs.split(':');
    const retImgs = [];

    for (var i = 0; i < imgArr.length; i++){
        const imgUrl = await getImgUrl(imgArr[i]);
        const imgObj = {fileUrl:imgUrl, saved:true, fileName:imgArr[i]}
        retImgs.push(imgObj);
    }
    
    return retImgs;

};

export const repDetailsGetPendingReports = (repInfo)=> {
    var retval = 0;
    for (var i = 0; i < repInfo.length; i++){
        if(repInfo[i].status === 'Reportado'){
            retval += 1;
        }
    }
    return retval;
};

export const repDetailsGetDonutInfo = (repInfo)=> {
    
    var donut =     
    [{name: 'Reportado', value: 0, color: 'rgb(245, 197, 239)'},
    {name: 'Finalizado', value: 0, color: 'rgb(213, 250, 225)'},
    {name: 'En Proceso', value: 0, color: 'rgb(249, 246, 188)'},
    {name: 'Cancelado', value: 0, color: 'rgb(240, 240, 240)'},];

    if (!repInfo){
        return donut;
    }


    for (var i = 0; i < repInfo.length; i++){
        if (repInfo[i].status === 'Reportado'){
            donut[0].value += 1;
        }else if (repInfo[i].status === 'Finalizado'){
            donut[1].value += 1;
        }else if (repInfo[i].status === 'En Proceso'){
            donut[2].value += 1;
        }else if (repInfo[i].status === 'Cancelado'){
            donut[3].value += 1;
        }
    }

    return donut;
};

export const getMaintInfo = async (compId, maintId)=> {
    const maintInfo = await dbQueryById('company/' + compId + '/maintenances/', maintId)
    return maintInfo;
};

export const getNextMantainDate = (maintData, period)=> {
    if (!maintData || !period){
        return null;
    }

    const orderedMaints = OrdAndFilt.orderDate(maintData, 'closeDate', true);
    var lastMaintDate = null;
    
    for (var i = 0; i < orderedMaints.length; i++){
        if(orderedMaints[i].maintStatus === 'Closed'){
            lastMaintDate = orderedMaints[i].closeDate;
        }
        break;
    }

    if (!lastMaintDate){
        return null;
    }

    const ts = (lastMaintDate.seconds+lastMaintDate.nanoseconds/1000000000)*1000;    
    lastMaintDate = new Date(ts);

    var month = getDate(lastMaintDate,'MM')*1 + period*1;
    var year = month > 12 ? getDate(lastMaintDate,'YYYY')*1 + 1 : getDate(lastMaintDate,'YYYY')*1;
    month = month > 12 ? month -12 : month;
       
    lastMaintDate = new Date(year + '-' + month + '-01');

    return(lastMaintDate);

};

export const getMaintIsOnTime = (maintData, period)=> {
    if (!maintData || maintData.length === 0 || !period){
        return null;
    }

    const nextMaintDate = getNextMantainDate(maintData, period);
    const month = getDate(nextMaintDate,'MM')*1;
    const year = getDate(nextMaintDate,'YYYY')*1;
    const currMonth = getDate(new Date(),'MM')*1;
    const currYear = getDate(new Date(),'YYYY')*1;

    if ((currMonth > month && currYear === year) || currYear > year){
        return false;
    }
    return true;
};

export const qrLandingStartInfo = async (companyId, equipId)=> {

    var compData = await dbQueryById('company',companyId);
    if(!compData || compData.active !== 'Y'){
        return null;
    }

    const equipData = await dbQueryById('company/' + companyId + '/equipment', equipId);
    compData.equipment = {...equipData};
    
    return compData;
};

export const qrLandingGetImg = async (route)=> {
    const imgUrl = await getImgUrl(route);
    return imgUrl;
};

export const qrLandingNextMaint = async (compData)=> {

    const compId = compData.id;
    const equipId = compData.equipment.id;
    var maintenances = await dbQuery('company/' + compId + '/maintenances', {attribute:'equipId', operator:'==', value:equipId});
    if (!maintenances || maintenances.length === 0){
        return null;
    }
    maintenances = OrdAndFilt.filter(maintenances, 'maintStatus', 'Closed');
    if (!maintenances || maintenances.length === 0){
        return null;
    }
    
    maintenances = OrdAndFilt.orderDate(maintenances, 'closeDate', true);
    const ts = (maintenances[0].closeDate.seconds+maintenances[0].closeDate.nanoseconds/1000000000)*1000;   
    const lastMaintDate = getDate(new Date(ts));
    var month = getDate(lastMaintDate,'MM')*1
    const nextMonth = month + compData.equipment.maintPeriod*1;
    const year = nextMonth > 12 ? 1 + getDate(lastMaintDate,'YYYY')*1 : getDate(lastMaintDate,'YYYY')*1;
    month = nextMonth > 12 ? month : nextMonth;
    const nextMaintDate = getDate('01-'+month+'-'+year,'MMM-YYYY','DD-MM-YYYY');

    return nextMaintDate;
}






export const uploadTestsLists = async ()=> {
    return;
    const testList = {display:true, name:'Monitor de Signos Vitales'};
    const tests =[
        {desc:'Limpieza Externa',display:true,template:'OKREGULAR',unit:'',orderBy:10},
        {desc:'Limpieza Interna',display:true,template:'OKREGULAR',unit:'',orderBy:20},
        {desc:'Integridad de la carcasa',display:true,template:'OKREGULAR',unit:'',orderBy:30},
        {desc:'Integridad de la pantalla',display:true,template:'OKREGULAR',unit:'',orderBy:40},
        {desc:'Integridad del cable de AC',display:true,template:'OKREGULAR',unit:'',orderBy:50},
        {desc:'Estado de sensor de Oximetria',display:true,template:'OKREGULAR',unit:'',orderBy:60},
        {desc:'Estado de sensor de Temperatura',display:true,template:'OKREGULAR',unit:'',orderBy:70},
        {desc:'Estado de sensor de ECG',display:true,template:'OKREGULAR',unit:'',orderBy:80},
        {desc:'Estado de Manguera de PANI',display:true,template:'OKREGULAR',unit:'',orderBy:90},
        {desc:'Estado de Brazalete de PANI',display:true,template:'OKREGULAR',unit:'',orderBy:100},
        {desc:'Estado de Cable de IBP',display:true,template:'OKREGULAR',unit:'',orderBy:110},
        {desc:'Estado de sensor de Capnografia',display:true,template:'OKREGULAR',unit:'',orderBy:120},
        {desc:'Integridad de la bateria',display:true,template:'OKREGULAR',unit:'',orderBy:130},
        {desc:'ECG Rate 60 BPM',display:true,template:'SINGLEUNIT',unit:'BPM',orderBy:140},
        {desc:'Resp Rate 20 BRPM',display:true,template:'SINGLEUNIT',unit:'BRPM',orderBy:150},
        {desc:'NIBP 120/80 mmHg',display:true,template:'XYZ-SINGLEUNIT',unit:'mmHG',orderBy:160},
        {desc:'SpO2 97%',display:true,template:'SINGLEUNIT',unit:'%',orderBy:170},
        {desc:'ECG Rate 130 (93) BPM',display:true,template:'SINGLEUNIT',unit:'BPM',orderBy:180},
        {desc:'Resp Rate 40 BRPM',display:true,template:'SINGLEUNIT',unit:'BRPM',orderBy:190},
        {desc:'NIBP 200/150 (167)mmHg',display:true,template:'XYZ-SINGLEUNIT',unit:'mmHG',orderBy:200},
        {desc:'SpO2 94%',display:true,template:'SINGLEUNIT',unit:'%',orderBy:210},
        {desc:'ECG Rate 40 BPM',display:true,template:'SINGLEUNIT',unit:'BPM',orderBy:220},
        {desc:'Resp Rate 15 BRPM',display:true,template:'SINGLEUNIT',unit:'BRPM',orderBy:230},
        {desc:'NIBP 60/30 (40) mmHg',display:true,template:'XYZ-SINGLEUNIT',unit:'mmHG',orderBy:240},
        {desc:'SpO2 95%',display:true,template:'SINGLEUNIT',unit:'%',orderBy:250},
        {desc:'ECG Rate 180 BPM',display:true,template:'SINGLEUNIT',unit:'BPM',orderBy:260},
        {desc:'Resp Rate 50 BRPM',display:true,template:'SINGLEUNIT',unit:'BRPM',orderBy:270},
        {desc:'NIBP 80/50 (60) mmHg',display:true,template:'XYZ-SINGLEUNIT',unit:'mmHG',orderBy:280},
        {desc:'SpO2 88%',display:true,template:'SINGLEUNIT',unit:'%',orderBy:290},
        {desc:'Indicadores visuales de alarma',display:true,template:'OKREGULAR',unit:'',orderBy:300},
        {desc:'Indicadores Sonoros de alarma',display:true,template:'OKREGULAR',unit:'',orderBy:310},
        {desc:'Deteccion de arritmias',display:true,template:'OKREGULAR',unit:'',orderBy:320},
        {desc:'Impresora Termica',display:true,template:'OKREGULAR',unit:'',orderBy:330},
    ];

    createOrUpdate(testList,'testLists').then(async (doc)=>{
        for (let i = 0; i < tests.length; i++) {
            await createOrUpdate(tests[i],'testLists/' + doc.id + '/tests');
        }
        console.log('done');
    })

}
