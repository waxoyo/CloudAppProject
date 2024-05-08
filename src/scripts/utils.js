
import moment from 'moment';
// eslint-disable-next-line
import localization from 'moment/locale/es';
import { maintainanceStatus } from './consts';

export function cleanFilename(str){
    str = str.replace(/[^a-zA-Z0-9 -_]/g, "").replace(/[_ .:;&%$"/()=]/g,'-');
    return(str);
}

export function capitalize(str) {
    if (!str){
        return null;
    }
    let temp = str.toLowerCase();
    return temp.charAt(0).toUpperCase() + temp.slice(1);
    
}

export function objectIsEmpty(object){
    if (!object){
        return(true);
    }
    if (Object.keys(object).length === 0){
        return(true);
    }
    return(false);
}

export function getDateFromForm (date, separator) {
    const day = date.split(separator)[2]*1;
    const month = date.split(separator)[1]*1-1;
    const year = date.split(separator)[0]*1;
    return new Date(year, month, day);
}

export function sysdate (dateFormat) {
    const format = (dateFormat===null?'DD-MMM-YYYY':dateFormat);
    const date = moment().toDate();
    const retVal =  moment(date).locale('mx').format(format);
    return retVal;
}

export function sysdatePlusMonths (months, dateFormat) {
    const format = (dateFormat===null?'DD-MMM-YYYY':dateFormat);
    const date = moment().add(months, 'months').toDate();
    const retVal =  moment(date).locale('mx').format(format);
    return retVal;
}

export function getDate (date, format, inputFormat) {
    if (!date){
        return null;
    }
    format = format ?? 'DD-MMM-YYYY';
    var formattedDate = null;
    if (date instanceof Date){
        formattedDate = moment(date).locale('es').format(format).toUpperCase().replace('.','');
    }else if (typeof date === "string"){
        formattedDate = moment(date, inputFormat).locale('es').format(format).toUpperCase().replace('.','');   
    }
    else{
        const ts = (date.seconds+date.nanoseconds/1000000000)*1000;
        formattedDate = moment(new Date(ts)).locale('es').format(format).toUpperCase().replace('.','');   
    }
    return(formattedDate);  
}

export function getJsDate (date) {
    var timestamp = Date.parse(date);
    var dateObject = new Date(timestamp);
    console.log(dateObject);
}

export function showDate (date, format) {
    
    if (!date) {
        return(null);
    }
    format = format ?? 'DD/MMM/YYYY';
    const retVal = moment(date.toDate()).locale('es').format(format).toUpperCase().replace('.','');
    return (retVal);
}

export function getDay (date) {
    const retVal =  moment(date.toDate()).locale('es').format('DD');
    return (retVal);
}

export function getMonth (date){
    const retVal =  moment(date.toDate()).locale('es').format('MMM').toUpperCase().replace('.','');
    return (retVal);
}


export function getFullMonth (date){
    const retVal =  moment(date.toDate()).locale('es').format('MMMM').toUpperCase().replace('.','');
    return (retVal);
}

export function getMonthNum (date){
    const retVal =  moment(date.toDate()).locale('es').format('MM');
    return (retVal);
}

export function getMonthFromNumber (month, format){
    format = format ?? 'MMM';
    const date = moment(month +'-01-2000', 'MM/DD/YYYY');
    const retVal =  moment(date.toDate()).locale('es').format(format).replace('.','');
    return (retVal);
}

export function getYear (date) {
    const retVal =  moment(date.toDate()).locale('es').format('YYYY');
    return (retVal);
}

function orderBy(objects, field, desc) {
    var sorted = objects.slice();

    sorted.sort((a,b)=>{
        
        if (typeof a[field] === 'number') {
            return (a[field] - b[field]);
        }else{
            return a[field].localeCompare(b[field]);
        }
    })   
    desc && sorted.reverse();
    
    return sorted;
}

function orderByDate(objects, field, desc) {
    if (!objects){
        return null;
    }
    var sorted = objects.slice();

    sorted.sort((a,b)=>{
            var date = getDate(a[field],'YYYY-MM-DD');            
            const dateA = new Date(date);
            date = getDate(b[field],'YYYY-MM-DD');
            const dateB = new Date(date);
            return (dateA - dateB); 
    })   

    desc && sorted.reverse();
    return sorted;
}

function filterBy(objects, field, value, diff) {
    var filtered = [];
    
    for (let i=0; i<objects.length; i++) {

        diff ? objects[i][field] !== value && filtered.push(objects[i])
        : objects[i][field] === value && filtered.push(objects[i]);  
    }
    return(filtered);
}

const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
} 

function filterLike(objects, field, value, diff) {
    var filtered = [];
    
    for (let i=0; i<objects.length; i++) {
        
        diff ? !removeAccents(objects[i][field].toLowerCase()).includes(removeAccents(value.toLowerCase()).trim()) && filtered.push(objects[i])
        : removeAccents(objects[i][field].toLowerCase()).includes(removeAccents(value.toLowerCase()).trim()) && filtered.push(objects[i]);

    }
    return(filtered);
}

function greaterThan(objects, field, value, smaller) {
    var filtered = [];
    
    for (let i=0; i<objects.length; i++) {
        
        smaller ? objects[i][field] < value && filtered.push(objects[i])
        : objects[i][field] > value && filtered.push(objects[i]); 
    }
    return(filtered);
}

export const OrdAndFilt = 
{
    order:orderBy,
    orderDate:orderByDate,
    filter:filterBy,
    filterLike:filterLike,
    greaterThan:greaterThan,
}

export function getMantainStatus (maintanances) {

    if (maintanances.length === 0 || maintanances === null){
        return 0;
    }

    const newToday = new Date();
    let retVal = 0;    
    
    for (let i = 0; i < maintanances.length; i++){
        if (maintanances[i].display === false){
            continue;
        }

        if (maintanances[i].status === 'Programado' && maintanances[i].date.toDate().getTime() < newToday.getTime()){
            retVal < 4 && (retVal = 4);
        }else if (maintanances[i].status === 'En Proceso'){
            retVal < 3 && (retVal = 3);
        }else if (maintanances[i].status === 'Reportado'){
            retVal < 2 && (retVal = 2);
        }else{
            retVal < 1 && (retVal = 1);
        }        
    }
    return retVal;

}

export function getNextPrevMaintenances (companyInfo) {
    const equipGroups = companyInfo.equipGroups;
    const equipment = companyInfo.equipment;
    let nextMaintenances = []
    if (equipGroups.length < 1 || equipment.length < 1) {
        return null;
    }


    for (let i = 0; i < equipGroups.length; i++){

        if(sysdate('MM')*1 < equipGroups[i].preventiveMonth*1){
            nextMaintenances.push(
                {
                groupId:equipGroups[i].id,
                groupName:equipGroups[i].name,
                month:equipGroups[i].preventiveMonth*1,
                // monthName:getMonth(moment(equipGroups[i].preventiveMonth + '-01-' + sysdate('YYYY')*1)),
                year:sysdate('YYYY')*1,
                status: 'Programado'
                }
            );
        }else{
            nextMaintenances.push(
                {
                groupId:equipGroups[i].id,
                groupName:equipGroups[i].name,
                month:(equipGroups[i].preventiveMonth*1 + equipGroups[i].preventivePeriod*1) % 12,
                // monthName: getMonth(moment(((equipGroups[i].preventiveMonth + 12/equipGroups[i].preventivePeriod) % 12) + '-01-' + sysdate('YYYY')*1)),
                year:sysdate('YYYY')*1,
                status: 'Programado',
                }
            ); 
        }

        if (equipGroups[i].preventiveMonth*1 + equipGroups[i].preventivePeriod*1 > 12){
            nextMaintenances[nextMaintenances.length - 1].year += 1;
        }

    }

    return nextMaintenances;
}

export function getMaintAccomplish (companyInfo) {
    console.log(0,companyInfo);
    
    const equipGroups = companyInfo.equipGroups ? companyInfo.equipGroups : null;
    const equipment = companyInfo.equipment ? companyInfo.equipment : null;

    if (!equipGroups || !equipment){
        return null;
    }

    let allMaintenances = [];

    for (let i = 0; i < equipment.length; i++){

        let maintGroup = equipment[i].groupId ? equipment[i].groupId : null;
        let maintenances = equipment[i].preventives ? equipment[i].preventives : null;
        
        // maintenances = maintenances ? filterBy(maintenances, 'type', 'Preventivo', false) : null;        
        
        if (!maintGroup || !maintenances || maintenances.length < 1){
            continue;
        }
        
        for (let j = 0; j < equipGroups.length; j++){

            let nextMont = equipGroups[j].preventiveMonth*1;
            
            while (nextMont <= 12){
                
                allMaintenances.push(
                    {
                        groupId:equipGroups[j].id,
                        groupName:equipGroups[j].name,
                        month:nextMont*1,
                        year:sysdate('YYYY')*1,
                        equipId: equipment[i].id,
                        status: 'Saved'
                    }
                );

                for (let k = 0; k < maintenances.length; k++){
                    let maintMonth = maintenances[k].deliveredDate ? getMonthNum(maintenances[k].deliveredDate)*1 : null;
                    
                    
                    if (!maintMonth){
                        continue;
                    }

                    if (allMaintenances[allMaintenances.length-1].month === maintMonth){
                        allMaintenances[allMaintenances.length-1].status = maintenances[k].status;
                        break;
                    }
                }

                nextMont += equipGroups[j].preventivePeriod*1;
            }
        
        }
    }


    let retVal = [];
    for (let i = 1; i <= 12; i++){

        let month = getFullMonth(moment(i+'-01-2000', 'MM/DD/YYYY')).substring(0,3).toUpperCase();
        let sumDone = 0;
        let sumAll = 0;
        

        for (let j = 0; j < allMaintenances.length; j++){
            if (allMaintenances[j].month === i){
                sumAll++;
                if (allMaintenances[j].status === 'Closed'){
                    sumDone++;
                }
            }
        }
        
        if(sysdate('MM')*1 > i){
            retVal.push({
                name:month + ' (' + sumDone + ' de ' + sumAll + ')',
                Objetivo: companyInfo.maintenanceGoal,
                Cumplimiento: sumAll === 0 ? 100 : (sumDone/sumAll)*100
            });
        }else{
            retVal.push({
                name:month + ' (' + sumDone + ' de ' + sumAll + ')',
                Objetivo: companyInfo.maintenanceGoal,
                Cumplimiento: 0
            });
        
        }
    }


    return retVal;
}


export function getNextMantain (compEquipment) {
    if (compEquipment.length < 1) {
        return null;
    }

    let nextMaint = [];



    for (let i = 0; i < compEquipment.length; i++) {
         
        if(sysdate('MM')*1 < compEquipment[i].preventiveMonth){
            nextMaint.push(
                {
                equipId:compEquipment[i].id,
                equipName:compEquipment[i].name,
                month:compEquipment[i].preventiveMonth,
                year:sysdate('YYYY')*1,
                status: 'Programado'
                }
            );

        }else{
            nextMaint.push(
                {
                equipId:compEquipment[i].id,
                equipName:compEquipment[i].name,
                month:(compEquipment[i].preventiveMonth + 12/compEquipment[i].preventivePeriod) % 12,
                year:sysdate('YYYY')*1,
                status: 'Programado'
                }
            );
        }

        if (compEquipment[i].preventiveMonth + 12/compEquipment[i].preventivePeriod > 12){
            nextMaint[nextMaint.length - 1].year += 1;
        }

        //filter those already done!
    
    }
    const retVal = orderBy(nextMaint, 'startDate', true);    

    return retVal;
}


export function getMant4Chart (compEquipment) {

    if (compEquipment.length < 1) {
        return null;
    }

    let porProgramar = [];
    let programado = [];
    let finalizado = [];
    let enProceso = [];
    let cancelado = [];


    for (let i = 0; i < compEquipment.length; i++) {
        if (compEquipment[i].maintenances.length > 0) {

            const maint = compEquipment[i].maintenances;
            
            for (let j = 0; j < maint.length; j++) {

                if (maint[j] === false || maint[j].type === 'Preventivo' || !maint[j].display) {
                    continue;
                }

                if (maint[j].status === 'Reportado') {
                    porProgramar.push(maint[j]);
                }else if (maint[j].status === 'Programado') {
                    programado.push(maint[j]);
                }else if (maint[j].status === 'Finalizado') {
                    finalizado.push(maint[j]);
                }else if (maint[j].status === 'En Proceso') {
                    enProceso.push(maint[j]);
                }else if (maint[j].status === 'Cancelado') {
                    cancelado.push(maint[j]);
                }
                
            }            
        }
    }

    const retVal = [
        {name:'Reportado', value:porProgramar.length, color: maintainanceStatus['Reportado'].backgroundColor},
        {name:'Programado', value:programado.length, color: maintainanceStatus['Programado'].backgroundColor},
        {name:'Finalizado', value:finalizado.length, color: maintainanceStatus['Finalizado'].backgroundColor},
        {name:'En Proceso', value:enProceso.length, color: maintainanceStatus['En Proceso'].backgroundColor},
        {name:'Cancelado', value:cancelado.length, color: maintainanceStatus['Cancelado'].backgroundColor},
    ]; 

    return retVal;     
}


export function getServiceOrderFolio() {
    return Math.trunc(Math.random()*100000000000);
}