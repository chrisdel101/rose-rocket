
function giantArray(val){
    console.log('arr val', val)
    let giantArr = Array.from({length: val}, (v, i) => i)
    console.log(giantArr)
    return(giantArr)
}
export default giantArray
