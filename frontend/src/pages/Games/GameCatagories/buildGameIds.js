const buildIds = (category, age)=> {
    let arr = [];
    
    for(let i=1; i<=100; i++){
        arr.push(`${category}-${age}-${i}`)
    }
    return arr;
}

export default buildIds;