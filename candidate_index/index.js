const Sphinx  = require("sphinx-promise");
const crc32 = require('crc');
let sphinx = new Sphinx({
    host: 'localhost',
    port: 9312
});

module.exports =  function searchCandidate(keyword, filterVal){

    let query = '';
    if (keyword) {
        query = `
            @jobTitle "${keyword}"/1
        `;
    }
  //  console.log(crc32);
    let city = crc32.crc32(filterVal.trim().toLowerCase());
    let filters = [{
        attr: "city",
        values: [city]
    }];
    return sphinx.query({
        index: 'CandidateIndex',
        query,
        filters
    });
}