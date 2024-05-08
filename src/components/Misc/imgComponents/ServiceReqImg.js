import React from 'react'

export const ServiceReqImg = ({img, style}) => {

    if (img === null) {
        return(null);
    };

    const myImageStyle = style ? style :
    
    {  width:'200px', 
        height:'200px',
        borderRadius:'10px',
        borderStyle:'solid',
        borderWidth:'2px',
        borderColor:'#375d7e'
    };

    return (
        <img style={myImageStyle} src={img} alt=''/>
    )
}
