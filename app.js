const searchCandidate = require('./candidate-index');
const searchJobs = require('./job-index');

const { crc32 } = require('crc');
//candidate search
//to find relevant candidates from external job source
let externalJobTitle = 'sales associate';
let externalJobTitleCity = 'chicago';
let externalJobTitleState = 'il';

//job search
//to find relevant jobs based on candidate chat title
let candidateChatTitle = 'nurse';
let candidateChatTitleCity = 'Atlanta';
let candidateChatTitleState = 'GA';

const filtersCandidate = createParamsForFilter(externalJobTitleCity, externalJobTitleState);
searchCandidate(externalJobTitle, filtersCandidate).then((candidateResult) => {
    candidateResult.matches.map((element) => {
        if (element.attrs.sourceindex === 1) {
            console.log("chatsessionid===> ", parseInt(element.id / 10),"title---> ", element.attrs.jobtitle,"city---> ", element.attrs.city,"state---> ", element.attrs.state);
        } else {
            console.log("pdlId===> ", parseInt(element.id / 10),"title---> ", element.attrs.jobtitle,"city---> ", element.attrs.city,"state---> ", element.attrs.state);
        }
    });
    console.log('------------------------------------------------------------');
});
const filtersJob = createParamsForFilter(candidateChatTitleCity, candidateChatTitleState);
if (filtersJob) {
    filtersJob.city = crc32(filtersJob.city);
    filtersJob.state = crc32(filtersJob.state);
}
searchJobs(candidateChatTitle, filtersJob).then((jobsResult) => {
    jobsResult.map((element) => console.log("jobId====> ", element));
});
function createParamsForFilter(city, state) {
    let filters;
    if (city != null && state != null) {
        filters = {
            city: city.trim().toLowerCase(),
            state: state.trim().toLowerCase()
        }
    }
    else {
        filters = {}
    }
    return filters;
}
