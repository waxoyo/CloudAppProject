import React, {useState} from 'react';


export const SectionContainer = ( {title, children, searchPlaceholder, searchHandler, closeHandler, expandible})  => {
    
    const [expanded, SetExpanded] = useState(expandible ? false : true);

    return (
        <div className='section-container'>
            <div className='section-title'>
                <p>{title}{searchPlaceholder && <>&nbsp;&nbsp;</>}</p>
                {searchPlaceholder ? <input type='search' id='search-equip' placeholder={searchPlaceholder} onChange={searchHandler}></input> : <div></div>}
                {closeHandler && <i className='fa-regular fa-x section-close-xmark' onClick={closeHandler}></i>}
                {expandible && <i className={expanded ? 'fa-regular fa-chevron-up' : 'fa-regular fa-chevron-down'} onClick={()=>{SetExpanded(!expanded)}}></i>}
            </div>
            <div className={expandible ? (expanded ? 'section-container expanded' : 'section-container contracted') : ''}>
                {children}
            </div>
        </div>
    ) 
}
