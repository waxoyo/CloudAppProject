import './firebase-config';
import { getFirestore, query, where, getDocs, getDoc, doc, collection } from 'firebase/firestore/lite';

const db = getFirestore();

export async function dbQuery(coll, constr) {
    const q = query(collection(db, coll), where(constr.attribute, constr.operator, constr.value));
    const querySnapshot = await getDocs(q);
    const retVal = [];
    if (!querySnapshot.empty){

        querySnapshot.forEach((doc)=>{
            let data = {...doc.data()};
            data.id = doc.id;
            retVal.push(data);
        });
        return (retVal);
    }    
    return (null);
}

export async function dbQueryCols(coll) {
    const q = query(collection(db, coll));
    const querySnapshot = await getDocs(q);
    const retVal = [];
    if (!querySnapshot.empty){

        querySnapshot.forEach((doc)=>{
            let data = {...doc.data()};
            data.id = doc.id;
            retVal.push(data);
        });
        return (retVal);
    }    
    return ([]);
}

export async function dbQueryAll(col1) {
    const q = query(collection(db, col1));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty){
        return (querySnapshot.docs);
    }
    return (null);
}

export async function dbQueryById(coll, id) {
    const docRef = doc(db, coll, id);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    
    data.id = docSnap.id;
    return(data);
}

export async function dbQuerySubCols(col1, id, col2){
    const colRef = col1 + '/' + id + '/' + col2;
    const q = query(collection(db, colRef));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty){
        return (querySnapshot.docs);
    }
    return (null);
}

export async function dbQuerySubSubCols(col1, id, col2, id2, col3){
    const colRef = col1 + '/' + id + '/' + col2 + '/' + id2 + '/' + col3 ;
    
    const q = query(collection(db, colRef));
    const querySnapshot = await getDocs(q);    
    if (!querySnapshot.empty){
        return (querySnapshot.docs);
    }
    
}

export async function getAllCompInfo(compId) {
    let id = null;  
    

    let company = await dbQueryById('company',compId);
    
    const snap1 = await dbQueryAll('company/' + compId + '/equipment');
    const snap11 = await dbQueryAll('company/' + compId + '/equipGroups');

    company.equipment = [];
    company.equipGroups = [];

    if (snap1) {
        snap1.forEach((doc)=>{
            let data = {...doc.data()};
            data.id = doc.id;
            
            company.equipment.push(data);
        });
    }

    if (snap11) {
        snap11.forEach((doc)=>{
            let data = {...doc.data()};
            data.id = doc.id;            
            company.equipGroups.push(data);
        });
    }


    for (let i = 0; i < company.equipment.length; i++) {
        id = company.equipment[i].id;

        const snap2 = await dbQueryAll('company/' + compId + '/equipment/' + id + '/maintenances');
        const snap3 = await dbQueryAll('company/' + compId + '/equipment/' + id + '/preventives');

        company.equipment[i].maintenances = [];
        company.equipment[i].preventives = [];
        if (snap2) {
            snap2.forEach((doc)=>{
                let data = {...doc.data()};
                data.id = doc.id;
                company.equipment[i].maintenances.push(data);
            });
        }
        if (snap3) {
            snap3.forEach((doc)=>{
                let data = {...doc.data()};
                data.id = doc.id;
                company.equipment[i].preventives.push(data);
            });
        }
    }

    return company;

}


export async function getAllSubCols(col1, col2, col3) {
    
    let retVal = [];
    let id = null;
    let id2 = null;

    const snap1 = await dbQueryAll(col1);
    if (snap1){

        snap1.forEach((doc) => {
            let data = {};
            data[col1+'Id'] = doc.id;
            Object.assign(data, doc.data());
            retVal.push(data);
        });

        //next level
        if(!col2){
            return(retVal);
        }

        for (let i = 0; i < retVal.length; i++) { 
            id = retVal[i].companyId;
            const snap2 = await dbQuerySubCols(col1,id,col2)
            if (snap2){
                retVal[i][col2] = [];

                snap2.forEach((doc)=>{
                    let data2 = {};
                    data2[col2+'Id'] = doc.id;
                    Object.assign(data2,doc.data());
                    retVal[i][col2].push(data2);
                })
            }

            //next level
            if(!col3){
                return(retVal);
            }
            
            for (let j = 0; j<retVal[i][col2].length; j++){
                id2 = retVal[i][col2][j][col2+'Id'];
                const snap3 = await dbQuerySubSubCols(col1,id ,col2 ,id2, col3);
                if (snap3){
                    retVal[i][col2][j][col3] = [];

                    snap3.forEach((doc)=>{
                        let data3 = {};
                        data3[col3+'Id'] = doc.id;
                        Object.assign(data3, doc.data());
                        retVal[i][col2][j][col3].push(data3);
                    });
                }
            }

        }
        
    }
    return(retVal);

}

export async function getAllSubColsData(col1, col2) {
    
    let data = [];

    const snap = await dbQueryAll(col1);
    if (snap) {    
        snap.forEach((doc)=>{
            let subData = {...doc.data()};
            subData.id = doc.id;
            data.push({...subData})
            }
        );
    }

    if (!col2){
        return data;
    }

    for (var i = 0; i < data.length; i++) {
        data[i].tests = [];
        const snap2 = await dbQueryAll(col1 + '/' + data[i].id + '/' + col2);
        if (snap2) {
            snap2.forEach((doc)=>{
                let subData = {...doc.data()};
                subData.id = doc.id;
                data[i].tests.push({...subData})
            })
        }

    }

    return data;

}
