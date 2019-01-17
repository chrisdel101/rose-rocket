import React from 'react'

function Box(props){
    let num = props.num
    let arr = Array.from({length: num}, (v, i) => i);
    return arr.map((i) => {
        return(
            <div className="box-container" key={i}>
                <div className="box">

                </div>
            </div>
        )
    })
}

export default Box
