const Sphinx = require('sphinxapi');
const env = require('./config/environment');
const configureSphinx = require('./configure');

configureSphinx();

let host = env('FLYING_SPHINX_HOST', 'localhost');
let port = env('FLYING_SPHINX_PORT', '9312');
port = parseInt(port, 10);

var sphinx = new Sphinx();
sphinx.SetServer(host, port);

let SPHINX_QUERY_REPLACE_PATTERNS = [
    /\|/g,
    /-/g,
    /!/g,
    /@/g,
    /"/g,
    /~/g,
    /\//g,
    /=/g,
    /\$/g,
    /\^/g,
    /MAYBE/g,
    /NEAR/g,
    /SENTENCE/g,
    /PARAGRAPH/g,
    /ZONE/g,
    /ZONESPAN/g
];

function sanitize(string) {
    SPHINX_QUERY_REPLACE_PATTERNS.forEach(token => {
        string = string.replace(token, ' ');
    });
    return string.trim();
}

module.exports = function searchCandidates(keyword, filters, limit=1000){
    let query = '';
    if (keyword) {
        keyword = sanitize(keyword);
        query = `@jobTitle "${keyword}"/1`;
    }
    return new Promise(function(resolve, reject) {
        sphinx.ResetFilters();
        sphinx.SetMatchMode(Sphinx.SPH_MATCH_EXTENDED);
        sphinx.SetLimits(0, limit);
        Object.entries(filters).forEach(([key, value]) => {
            sphinx.SetFilterString(key, value);
        });
        sphinx.Query(query, 'CandidateIndex', function(error, result) {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        });
    });
}
