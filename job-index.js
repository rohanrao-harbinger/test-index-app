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

function prepareQuery(filters, limit) {
    sphinx.ResetFilters();

    /*
        This rank expression is the default plus a tiebreaker of a random value `rand`.
        This "random" value is more likely to be higher for jobs with cost_per_click_in_cents > 0
        because of the index building query.

        Values:
            lcs: essentially gives you 1000 weight per word matched
            user_weight: any custom weight we've given to matching specific fields--so far, not used,
                which means this value is currently always 1
            bm25: gives you 500-600 weight, depending on the sequence of words involved
            rand: a random value we set up to be between 0-15
    */
    sphinx.SetMatchMode(Sphinx.SPH_MATCH_EXTENDED2);
    sphinx.SetRankingMode(Sphinx.SPH_RANK_EXPR, `sum(lcs*user_weight)*1000+bm25+rand`);
    sphinx.SetLimits(0, limit);
    Object.entries(filters).forEach(([key, value]) => {
        sphinx.SetFilter(key, [value]);
    });
}

module.exports = function searchJobs(keyword, filters, facet, limit=59) {
    let query = '';
    if (keyword) {
        keyword = sanitize(keyword);

        if (facet === 'company') {
            query = `@company "${keyword}"/1`;
        } else {
            // "keyword" search
            query = `@title "${keyword}"/1`;
        }
    }

    return new Promise(function(resolve, reject) {
        prepareQuery(filters, limit);

        sphinx.Query(query, 'JobIndex', function(error, result) {
            if (error) {
                reject(error);
                return;
            }
            let ids = result.matches.map(r => r.id);
            resolve(ids);
        });
    });
}
