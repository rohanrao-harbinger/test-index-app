const searchCandidate = require('./candidate-index');
const searchJobs = require('./job-index');

const { crc32 } = require('crc');
//candidate search
//to find relevant candidates from external job source
let externalJobTitle = 'nurse';
let externalJobTitleCity = 'Atlanta';
let externalJobTitleState = 'GA';

//job search
//to find relevant jobs based on candidate chat title
let candidateChatTitle = 'nurse';
let candidateChatTitleCity = 'Atlanta';
let candidateChatTitleState = 'GA';

const filtersCandidate = createParamsForFilter(externalJobTitleCity, externalJobTitleState);
searchCandidate(externalJobTitle, filtersCandidate).then( (candidateResult) => {
    candidateResult.matches.map( (element) => {
        if(element.attrs.sourceindex === 1){
            console.log("chatsessionid===> ",parseInt(element.id / 10));
        }else{
            console.log("pdlData===> ",parseInt(element.id / 10)); 
        }
    });
    console.log('------------------------------------------------------------');
});
const filtersJob = createParamsForFilter(candidateChatTitleCity, candidateChatTitleState);
searchJobs(candidateChatTitle, filtersJob).then( (jobsResult) => {
    jobsResult.map((element) => console.log("jobId====> ",element));
});
function createParamsForFilter(city, state) {
    let filters;
    if (city != null && state != null) {
        filters = {
            city: crc32(city.trim().toLowerCase()),
            state: crc32(state.trim().toLowerCase())
        }
    }
    else {
        filters = {}
    }
    return filters;
}