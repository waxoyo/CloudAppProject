import { dbQuery, dbQueryById, dbQueryCols } from "../../../scripts/queries";
import { OrdAndFilt, getDate } from "../../../scripts/utils";

export const dashStartData = async (groupId)=> {

    var groupInfo = await dbQueryById('group',groupId);
    groupInfo.companiesIds = groupInfo.companiesStr.split(',');
    groupInfo.companies = [];


    for (let i = 0; i < groupInfo.companiesIds.length; i++){
        const companyInfo = await dbQueryById('company', groupInfo.companiesIds[i]);
        var maintenances = await dbQueryCols('company/' + companyInfo.id + '/maintenances');
        var reports = await dbQueryCols('company/' + companyInfo.id + '/reports');
        var equipment = await dbQueryCols('company/' + companyInfo.id + '/equipment');

        maintenances = OrdAndFilt.filter(maintenances, 'maintStatus', 'Closed');
        maintenances = OrdAndFilt.orderDate(maintenances,'closeDate', true);
        reports = OrdAndFilt.orderDate(reports, 'reportedDate', true);

        companyInfo.allMaintenances = maintenances;
        companyInfo.allReports = reports;

        var maintenancesObject = {};
        for (let j = 0; j < maintenances.length; j++){
            if (!maintenancesObject[maintenances[j].equipId]){
                maintenancesObject[maintenances[j].equipId] = [];
            }
            maintenancesObject[maintenances[j].equipId].push(maintenances[j]);
        }
        

        var reportsObject = {};
        for (let j = 0; j < reports.length; j++){
            if (!reportsObject[reports[j].equipId]){
                reportsObject[reports[j].equipId] = [];
            }
            reportsObject[reports[j].equipId].push(reports[j]);
        }


        for (let j = 0; j < equipment.length; j++){
            equipment[j].maintenances = maintenancesObject[equipment[j].id] ?? [];
            equipment[j].reports = reportsObject[equipment[j].id] ?? [];
        }


        companyInfo.equipment = equipment;
        groupInfo.companies.push(companyInfo);


    } 

    return groupInfo;

};


export const dashGetGroups = async ()=>{
    const groupInfo = await dbQueryCols('equipGroups');
    return groupInfo;
};


export const dashGetUsersData = async (groupInfo)=> {
    var companies = groupInfo.companies;
    var usersData = [];

    for (let i = 0; i < companies.length; i++){
        const compId = companies[i].id;
        const predicate = {attribute: 'company', operator: '==', value: compId};
        const tempUData = await dbQuery('uData',predicate);

        tempUData && usersData.push(...tempUData);
    }
    usersData = OrdAndFilt.filter(usersData, 'active', 'Y');

    const adminUData = await dbQuery('uData', {attribute:'technician', operator:'==', value:true});
    usersData = usersData.concat(adminUData);  

    return usersData;

};


export const dashGetAccData = (groupInfo, dials)=> {
    var maintenances = [];
    var equipment = [];
    var totalRequired = 0;
    const months = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC']
    const actualAccomp = {};

    for (let i = 0; i < months.length; i++){
        actualAccomp[months[i]]=0;
    }

    if (dials.site === 'all'){
        for (let i = 0; i < groupInfo.companies.length; i++){
            maintenances = [...maintenances, ...groupInfo.companies[i].allMaintenances];
            equipment = [...equipment, ...groupInfo.companies[i].equipment]
        }
    }else{
        for (let i = 0; i < groupInfo.companies.length; i++){
            if (groupInfo.companies[i].id === dials.site){
                maintenances = [...groupInfo.companies[i].allMaintenances];
                equipment = [...groupInfo.companies[i].equipment];
            }
        } 
    }

//applying filters
    maintenances = OrdAndFilt.filter(maintenances, 'maintStatus', 'Closed');
    maintenances = OrdAndFilt.orderDate(maintenances, 'closeDate', true);
    for (let i = 0; i < maintenances.length; i++){
        maintenances[i].year = getDate(maintenances[i].closeDate,'YYYY')*1;
        maintenances[i].month = getDate(maintenances[i].closeDate,'MMM');
    }
    
    if (dials.equipGroup !== 'all'){
        for (let i = 0; i < maintenances.length; i++){
            const equipId = maintenances[i].equipId;

            for (let j = 0; j < equipment.length; j++){
                if (equipId === equipment[j].id){
                    maintenances[i].groupId = equipment[j].groupId;
                }
            }
        }

        maintenances = OrdAndFilt.filter(maintenances, 'groupId', dials.equipGroup);
    }

    
    
// actual maints

    for (let i = 0; i < maintenances.length; i++){
        if (maintenances[i].year*1 === dials.year*1){
            actualAccomp[maintenances[i].month] += 1;
        }
    }

//needed maints
    
    for (let i = 0; i < equipment.length; i++){
        if ((dials.equipGroup !== 'all' && equipment[i].groupId !== dials.equipGroup) || !equipment[i].maintPeriod){
            continue;
        }
        
        const periodicity = equipment[i].maintPeriod*1;
        totalRequired += Math.floor(12/periodicity);
    }


    var accomplishmentData = [];
    var totalSoFar = 0;
    for (let i = 0; i < months.length; i++){
        totalSoFar += actualAccomp[months[i]];
        accomplishmentData.push({
            name: months[i],
            Objetivo: 80,
            Cumplimiento: 100*totalSoFar/totalRequired
        });
    }

    return accomplishmentData;
    // const accomplishmentData = 
    //     [{name: 'ENE (0 de 0)', Objetivo: 80, Cumplimiento: 0},
    //     {name: 'FEB (0 de 1)', Objetivo: 80, Cumplimiento: 10},
    //     {name: 'MAR (0 de 2)', Objetivo: 80, Cumplimiento: 15},
    // ...
    //     {name: 'DIC (0 de 0)', Objetivo: 80, Cumplimiento: 95},]
};


export const dashGetMonthData = (groupInfo, dials)=> {
    var maintenances = [];
    var equipment = [];
    const months = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
    const actualAccomp = {};
    const needMaint = {};

    for (let i = 0; i < months.length; i++){
        actualAccomp[months[i]]=0;
        needMaint[months[i]]=0;
    }

    if (dials.site === 'all'){
        for (let i = 0; i < groupInfo.companies.length; i++){
            maintenances = [...maintenances, ...groupInfo.companies[i].allMaintenances];
            equipment = [...equipment, ...groupInfo.companies[i].equipment]
        }
    }else{
        for (let i = 0; i < groupInfo.companies.length; i++){
            if (groupInfo.companies[i].id === dials.site){
                maintenances = [...groupInfo.companies[i].allMaintenances];
                equipment = [...groupInfo.companies[i].equipment];
            }
        } 
    }

//applying filters
    maintenances = OrdAndFilt.filter(maintenances, 'maintStatus', 'Closed');
    maintenances = OrdAndFilt.orderDate(maintenances, 'closeDate', true);
    for (let i = 0; i < maintenances.length; i++){
        maintenances[i].year = getDate(maintenances[i].closeDate,'YYYY')*1;
        maintenances[i].month = getDate(maintenances[i].closeDate,'MMM');
    }

    if (dials.equipGroup !== 'all'){
        for (let i = 0; i < maintenances.length; i++){
            const equipId = maintenances[i].equipId;

            for (let j = 0; j < equipment.length; j++){
                if (equipId === equipment[j].id){
                    maintenances[i].groupId = equipment[j].groupId;
                }
            }
        }

        maintenances = OrdAndFilt.filter(maintenances, 'groupId', dials.equipGroup);
    }

    if (dials.tech!=='all'){
        maintenances = OrdAndFilt.filter(maintenances, 'techId', dials.tech);
    }


// actual maints
    for (let i = 0; i < maintenances.length; i++){
        if (maintenances[i].year*1 === dials.year*1){
            actualAccomp[maintenances[i].month] += 1;
        }
    }

    var monthData = [];
    for (let i = 0; i < months.length; i++){
        monthData.push({name: months[i] + ' - ' + actualAccomp[months[i]], Realizados: actualAccomp[months[i]]})
    }

    return monthData;
    // [{name: 'ENE',Cumplimiento: 46,},
    // {name: 'FEB',Cumplimiento: 38,},]

};


export const dashGetNextMaintData = (groupsData, dials)=> {

    const companies = [...groupsData.companies];
    const dueMaints = {};
    var equipment = [];
    var totalEquipByGroup = {};

    for ( let i = 0; i < companies.length; i++){
        if (dials.site !== 'all' && companies[i].id !== dials.site){
            continue;
        }
        equipment.push(...companies[i].equipment);
    }
    
    for (let i = 0; i < equipment.length; i++){
        const groupId = equipment[i].groupId;
        if (!totalEquipByGroup[groupId]){
            totalEquipByGroup[groupId] = 0;
        }
        totalEquipByGroup[groupId] += 1;

        if (!equipment[i].maintenances.length > 0){
            continue;
        }      

        if (!equipment[i].groupId || equipment[i].groupId === '' || !equipment[i].maintPeriod || equipment[i].maintPeriod === ''){
            continue;
        }

        const maintPeriod = equipment[i].maintPeriod*1;
        const currMonth = getDate(new Date(), 'MM')*1 + dials.month;
        const currYear = getDate(new Date(), 'YYYY')*1;
        var maintMonth = getDate(equipment[i].maintenances[0].closeDate, 'MM')*1 + maintPeriod;
        var maintYear = getDate(equipment[i].maintenances[0].closeDate, 'YYYY')*1;
        if (maintMonth > 12){
            maintMonth -= 12;
            maintYear += 1;
        }
       
        if (maintYear === currYear && maintMonth === currMonth){
            if (!dueMaints[groupId]){
                dueMaints[groupId] = 0;
            }
            dueMaints[groupId] += 1;
        }
    }

    var retVal = [];
    for (const key in dueMaints){
        retVal.push({group: key, amount: dueMaints[key], totalEquip:totalEquipByGroup[key]});
    }

    return retVal;

};


export const dashGetDueMaint = (groupsData, siteId)=> {
    const companies = [...groupsData.companies];
    const dueMaints = {};
    var equipment = [];
    var totalEquipByGroup = {};

    for ( let i = 0; i < companies.length; i++){
        if (siteId !== 'all' && companies[i].id !== siteId){
            continue;
        }
        equipment.push(...companies[i].equipment);
    }
    
    for (let i = 0; i < equipment.length; i++){
        const groupId = equipment[i].groupId;
        if (!totalEquipByGroup[groupId]){
            totalEquipByGroup[groupId] = 0;
        }
        totalEquipByGroup[groupId] += 1;

        if (!equipment[i].maintenances.length > 0){
            continue;
        }      

        if (!equipment[i].groupId || equipment[i].groupId === '' || !equipment[i].maintPeriod || equipment[i].maintPeriod === ''){
            continue;
        }

        const maintPeriod = equipment[i].maintPeriod*1;
        const currMonth = getDate(new Date(), 'MM')*1;
        const currYear = getDate(new Date(), 'YYYY')*1;
        var maintMonth = getDate(equipment[i].maintenances[0].closeDate, 'MM')*1 + maintPeriod;
        var maintYear = getDate(equipment[i].maintenances[0].closeDate, 'YYYY')*1;
        if (maintMonth > 12){
            maintMonth -= 12;
            maintYear += 1;
        }

        
        if ( (maintYear === currYear && maintMonth < currMonth) || maintYear < currYear){
            if (!dueMaints[groupId]){
                dueMaints[groupId] = 0;
            }
            dueMaints[groupId] += 1;
        }
    }

    var retVal = [];
    for (const key in dueMaints){
        retVal.push({group: key, amount: dueMaints[key], totalEquip:totalEquipByGroup[key]});
    }

    return retVal;
}


export const dashGetGroupName = (groupsData, groupId)=> {
    const tempGroupsData = OrdAndFilt.filter(groupsData,'id',groupId);
    return tempGroupsData[0].name ?? null;
};


export const getYearsDials = ()=>{
    var retVal = [getDate(new Date(), 'YYYY')*1];
    for (let i = 1; i < 3; i++){
        retVal.push(getDate(new Date(), 'YYYY')*1 - i);
    }

    return retVal;
};


export const getSitesDials = (groupInfo)=> {
    var retVal = [];
    for (let i = 0; i < groupInfo.companies.length; i++){
        retVal.push({name:groupInfo.companies[i].companyName, compId: groupInfo.companies[i].id})
    }
    return retVal;
};
