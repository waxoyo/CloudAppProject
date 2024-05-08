
import { getStorage, ref, getDownloadURL, listAll, deleteObject, uploadBytes } from 'firebase/storage';
import { cleanFilename } from './utils';

const storage = getStorage();

export async function getFileUrl(id){
        var fUrl = 
        getDownloadURL(ref(storage, `${id}.pdf`)).then((url)=>{
            return(url);        
        }).catch( () => {
            return(null);
        } 
        );
    return (fUrl);
}

export async function getImgUrl(imgUrl){
    var fUrl = 
    getDownloadURL(ref(storage, '/' + imgUrl)).then((url)=>{
        return(url);        
    }).catch( () => {
        return(null);
    } 
    );
return (fUrl);
}

export async function allFiles () {
    const listRef = ref(storage, '/');
    const response = await listAll(listRef);
    
    if(response){
        let files = []
        for (let i=0; i<response.items.length; i++){
            files.push(response.items[i]._location.path);
        }
        return(files);
    }
    return(null);
}

export async function deleteFile(fileName) {
    const desertRef = ref(storage, fileName);
    await deleteObject(desertRef);
}

export async function uploadFile(file) {
    const name = file.name.substring(0, file.name.length - 4);
    const fileRef = ref(storage, cleanFilename(`${Math.floor(Math.random()*100000)}_${name}`) + '.pdf');
    await uploadBytes(fileRef, file);
}

export async function uploadImg(file, companyId, equipId) {
    const fileRef = ref(storage, `/${companyId}/${equipId}/${Math.floor(Math.random()*100000)}_${file.name}`);
    const retval = await uploadBytes(fileRef, file);
    return(retval.metadata.fullPath);
}


export async function uploadReportImg(file, companyId, equipId, reportId) {
    const fileRef = ref(storage, `/${companyId}/${equipId}/reports/${reportId}/${Math.floor(Math.random()*100000)}_${file.name}`);
    const retval = await uploadBytes(fileRef, file);
    return(retval.metadata.fullPath);
}