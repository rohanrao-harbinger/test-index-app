const searchCandidate  = require("./candidate_index");

searchCandidate('software', 'New York').then( (result) => {
     for(index in result.matches){
         let fullName ="";
        for(key of Object.keys(result.matches[index].attrs)){
            if(key === "firstname"){
                fullName= result.matches[index].attrs[key];
            }
           else  if(key !== "city")
            {
                if( key === "lastname"){
                    fullName+=` ${result.matches[index].attrs[key]}`;
                    console.log(`fullname ---> ${fullName}`);
                }else{
                console.log(`${key} ---> ${result.matches[index].attrs[key]}`); 
                }
            }
            
        }
        console.log("------------------------------------------------------------------------");
     }


});
