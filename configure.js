let flyingSphinx = require('flying-sphinx');
let configuration = flyingSphinx.configuration();

module.exports = function() {
    if (process.env.NODE_ENV !== 'production') {
        return;
    }

    configuration.process('configure', function(configurer) {
        configurer.addEngine('sphinx');

        // http://support.flying-sphinx.com/kb/configuration/setting-your-sphinx-version
        configurer.addVersion('2.2.11');
    });
}
