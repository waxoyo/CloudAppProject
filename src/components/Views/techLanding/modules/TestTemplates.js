import React from 'react';

export const TestTemplates = ({ template, testIndex, value, units, onChange, disabled }) => {

    const changeValueSingle = (e)=>{
        e.preventDefault();
        onChange(testIndex, e.target.value);
    }

    // const changeValueMultiple = (e)=>{
    //     e.preventDefault();
    //     var tempVal = [];
    //     tempVal[0] = document.getElementById('XYZ-X' + testIndex).value;
    //     tempVal[1] = document.getElementById('XYZ-Y' + testIndex).value;
    //     tempVal[2] = document.getElementById('XYZ-Z' + testIndex).value;

    //     onChange(testIndex, JSON.parse(JSON.stringify(tempVal)));
    // }

    const changeValueMultiple = (e, id, num)=> {
        e.preventDefault();
        var tempVal = [];
        for (let i = 1; i <= num; i++) {
            // console.log(id + i + testIndex);
            tempVal[i-1] = document.getElementById(id + i + testIndex).value;
        }
        onChange(testIndex, JSON.parse(JSON.stringify(tempVal)));
    }

    return(


        <div>
            {template === 'OKREGULAR' && <select value={value} id={'test-val-'+testIndex} onChange={changeValueSingle} className='NewMaint--testList-value' disabled={disabled}>
                                            <option value={''}></option>
                                            <option value={'OK'}>OK</option>
                                            <option value={'Regular'}>Regular</option>
                                            <option value={'Defectuoso'}>Defectuoso</option>
                                            <option value={'N/A'}>N/A</option>
                                        </select>}
            {template === 'SINGLEUNIT' &&  <div className='NewMaint--testList-tag-n-value'>
                                        <input value={value} id={'test-val-'+testIndex} onChange={changeValueSingle} className='NewMaint--testList-value' disabled={disabled}>

                                        </input>
                                        <div>
                                            {units}
                                        </div>
                                    </div>}
            {template === 'BPM' &&  <div className='NewMaint--testList-tag-n-value'>
                                        <input value={value} id={'test-val-'+testIndex} onChange={changeValueSingle} className='NewMaint--testList-value' disabled={disabled}>

                                        </input>
                                        <div>
                                            BPM
                                        </div>
                                    </div>}
            {template === 'BRPM' &&  <div className='NewMaint--testList-tag-n-value'>
                                        <input value={value} id={'test-val-'+testIndex} onChange={changeValueSingle} className='NewMaint--testList-value' disabled={disabled}>

                                        </input>
                                        <div>
                                            BRPM
                                        </div>
                                    </div>}
            {template === 'XY-SINGLEUNIT' &&  <div id={'test-val-'+testIndex} className='NewMaint--testList-2-1-value'>
                                        <input value={value[0]} onChange={(e)=>{changeValueMultiple(e,'XY', 2)}} className='NewMaint--testList-small-value' id={'XY1' + testIndex} disabled={disabled}>

                                        </input>
                                        <input value={value[1]} onChange={(e)=>{changeValueMultiple(e,'XY', 2)}} className='NewMaint--testList-small-value' id={'XY2' + testIndex} disabled={disabled}>

                                        </input>
                                        <div>
                                            {units}
                                        </div>
                                    </div>}
            {template === 'XY-2UNITS' &&  <div id={'test-val-'+testIndex} className='NewMaint--testList-2-2-value'>
                                        <input value={value[0]} onChange={(e)=>{changeValueMultiple(e,'XY2', 2)}} className='NewMaint--testList-small-value' id={'XY21' + testIndex} disabled={disabled}>

                                        </input>
                                        <div>
                                            {units.split(':')[0]}
                                        </div>
                                        <input value={value[1]} onChange={(e)=>{changeValueMultiple(e,'XY2', 2)}} className='NewMaint--testList-small-value' id={'XY22' + testIndex} disabled={disabled}>

                                        </input>
                                        <div>
                                            {units.split(':')[1]}
                                        </div>
                                    </div>}
            {template === 'XYZ-SINGLEUNIT' &&  <div id={'test-val-'+testIndex} className='NewMaint--testList-3-value'>
                                        <input value={value[0]} onChange={(e)=>{changeValueMultiple(e,'XYZ', 3)}} className='NewMaint--testList-small-value' id={'XYZ1' + testIndex} disabled={disabled}>

                                        </input>
                                        <input value={value[1]} onChange={(e)=>{changeValueMultiple(e,'XYZ', 3)}} className='NewMaint--testList-small-value' id={'XYZ2' + testIndex} disabled={disabled}>

                                        </input>
                                        <input value={value[2]} onChange={(e)=>{changeValueMultiple(e,'XYZ', 3)}} className='NewMaint--testList-small-value' id={'XYZ3' + testIndex} disabled={disabled}>

                                        </input>
                                        <div>
                                                {units}
                                        </div>
                                    </div>}
            {template === 'XYZ-3UNITS' &&  <div id={'test-val-'+testIndex} className='NewMaint--testList-3-3-value'>
                                        <input value={value[0]} onChange={(e)=>{changeValueMultiple(e,'XYZ3', 3)}} className='NewMaint--testList-small-value' id={'XYZ31' + testIndex} disabled={disabled}>

                                        </input>
                                        <div>
                                            {units.split(':')[0]}
                                        </div>
                                        <input value={value[1]} onChange={(e)=>{changeValueMultiple(e,'XYZ3', 3)}} className='NewMaint--testList-small-value' id={'XYZ32' + testIndex} disabled={disabled}>

                                        </input>
                                        <div>
                                            {units.split(':')[1]}
                                        </div>
                                        <input value={value[2]} onChange={(e)=>{changeValueMultiple(e,'XYZ3', 3)}} className='NewMaint--testList-small-value' id={'XYZ33' + testIndex} disabled={disabled}>

                                        </input>
                                        <div>
                                            {units.split(':')[2]}
                                        </div>
                                    </div>}
            {/* legacy */}
            {template === 'XYZ' &&  <div id={'test-val-'+testIndex} className='NewMaint--testList-3-value'>
                                        <input value={value[0]} onChange={(e)=>{changeValueMultiple(e,'XYZ', 3)}} className='NewMaint--testList-small-value' id={'XYZ1' + testIndex} disabled={disabled}>

                                        </input>
                                        <input value={value[1]} onChange={(e)=>{changeValueMultiple(e,'XYZ', 3)}} className='NewMaint--testList-small-value' id={'XYZ2' + testIndex} disabled={disabled}>

                                        </input>
                                        <input value={value[2]} onChange={(e)=>{changeValueMultiple(e,'XYZ', 3)}} className='NewMaint--testList-small-value' id={'XYZ3' + testIndex} disabled={disabled}>

                                        </input>
                                        <div>
                                                mmHg
                                        </div>
                                    </div>}
            {template === 'PERCENT' &&  <div className='NewMaint--testList-tag-n-value'>
                                            <input value={value} id={'test-val-'+testIndex}  onChange={changeValueSingle} className='NewMaint--testList-value' disabled={disabled}>

                                            </input>
                                            <div>
                                                %
                                            </div>
                                        </div>}
        </div>
    )
    
};
