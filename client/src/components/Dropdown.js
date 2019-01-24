import React from 'react'

function Dropdown(props){
    if(!props.legs) return null
    console.log(props)
    let legs = props.legs
        return(
            <div className="legs-container">
            <h6>Select a Leg</h6>
            <select>
            {
                legs.map(leg => {
                    return <option value={leg.legID}>{leg.legID}</option>
                })
            }

            </select>
            </div>
        )

}

export default Dropdown
