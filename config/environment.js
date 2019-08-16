
module.exports =  function(keyName, defaultValue) {
    let value = process.env[keyName];

    if (value === undefined && defaultValue !== undefined) {
        value = defaultValue;
    }

    if (value === undefined) {
        console.log(new Error(`Environment variable not defined: ${keyName}`));
    }

    return value;
}
