export const maintainanceStatus = 
    {
        Reportado: {color:'rgb(128, 128, 128)', backgroundColor:'rgb(245, 197, 239)'},
        Programado: {color:'rgb(128, 128, 128)', backgroundColor:'rgb(240, 240, 240)'},
        'En Proceso': {color:'rgb(128, 128, 128)', backgroundColor:'rgb(249, 246, 188)'},
        Cancelado: {color:'rgb(128, 128, 128)', backgroundColor:'rgb(249, 190, 188)'},
        Finalizado: {color:'rgb(128, 128, 128)', backgroundColor:'rgb(213, 250, 225)'},
    };

export const compMaintanStatus = 
    {
        0:{title:'No hay mantenimientos registrados', color:'red'},
        1:{title:'Mantenimientos al día', color:'green'},
        2:{title:'Mantenimientos pendientes de programar', color:'purple'},
        3:{title:'Mantenimientos en proceso', color:'orange'},
        4:{title:'Mantenimientos atrasados', color:'red'},
    }

export const maintainanceTypes = ['Correctivo', 'Preventivo'];
export const maintainanceShift = ['Matutino', 'Vespertino', 'Nocturno', 'Mixto'];
export const equipmentStatus = ['Activo', 'Retirado'];

export const WryMy2qSqEa5p = process.env.REACT_APP_ENCR_CODE;


export const loadingModalStyle = {  width:'100px', 
            height:'60px',
            borderRadius:'10px',
            borderStyle:'none',
            borderWidth:'0px',
            borderColor:'transparent'
            };