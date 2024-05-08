import './firebase-config';
import Cookies from 'js-cookie';
import { getFirestore, query, where, getDocs, collection } from 'firebase/firestore/lite';
import { dbQuery, dbQueryById } from './queries';
import { WryMy2qSqEa5p } from './consts';

const db = getFirestore();

const checkLogLocal = () => {
    return Cookies.get('_uu_aulvid');
};

const checkLogEncripted = () => {
    var CryptoJS = require("crypto-js");
    const compId = Cookies.get('_uu_aulvid');
    
    if (!compId){
        return null;
    } 
    var decrypted = CryptoJS.AES.decrypt(compId, WryMy2qSqEa5p);

    return decrypted.toString(CryptoJS.enc.Utf8);

    // return Cookies.get('_uu_aulvid')
    //         .replace('+','xxPSxy')
    //         .replace('/','wwSBwz')
    //         .replace('=','yyESyx');
};


export function encryptURL(url) {
    var CryptoJS = require("crypto-js");
    var encripted = CryptoJS.RC4Drop.encrypt(url,WryMy2qSqEa5p)
    
    encripted = encripted.toString()
            .replace(/\+/g,'xxPSx')
            .replace(/\//g,'wwSBx')
            .replace(/\?/g,'qwSBx')
            // eslint-disable-next-line
            .replace(/\=/g,'yyESx');

    return encripted;
}

export function decryptURL(url){
    url = url
        .replace(/xxPSx/g,'+')
        .replace(/wwSBx/g,'/')
        .replace(/qwSBx/g,'?')
        .replace(/yyESx/g,'=');
    var CryptoJS = require("crypto-js");
    var decrypted = CryptoJS.RC4Drop.decrypt(url, WryMy2qSqEa5p).toString(CryptoJS.enc.Utf8);

    return decrypted;
}


export async function login(email, pass) {
    
    const q = query(collection(db, "uData"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    var retVal = {}
    
    if (!querySnapshot.empty){
        querySnapshot.forEach((doc) => {

            if (doc.data().active !== 'Y'){
                return null;
            }

            if (doc.data().renew){
                const url = encryptURL(doc.id);
                window.location = '/PwRnw/' + url;
            }

            const passw = doc.data().pass;
            
            retVal.level = doc.data().level*1;
            if (passw === pass){
                if (retVal.level === 0){
                    retVal.id = doc.id;
                }else if(retVal.level === 1){
                    retVal.id = doc.data().group;
                    retVal.uId = doc.id;
                }else{
                    retVal.id = doc.data().company;
                    retVal.uId = doc.id;
                }
            }

        });
    }

    if (retVal && retVal.level  > 0){
        var companySnap = null;
        if (retVal.level === 1){
            companySnap = await dbQueryById('group', retVal.id);
        }else{
            companySnap = await dbQueryById('company', retVal.id);
        }
        if (companySnap.active !== 'Y') {        
            return null;
        }
    }

    return(retVal);
}


export function logout(){
    Cookies.remove('_uu_aulvid');
}


export async function checkAdmin (id){
    const q = query(collection(db, "admins"), where("uId", "==", id));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty){      
        return(true);
    }
    return(false);
}

export async function getCompName(userId) {
    
    const qsnap = await dbQueryById('company', userId);
    const companyName = qsnap.companyName;    
    return (companyName);
}

export function checkLog(encripted = false) {
    if (encripted === false) {
        return checkLogLocal();
    }else{
        return checkLogEncripted();
    }
}
