// import * from 'fs';
import * as console from 'console';
import fs = require('fs');
import fsEx = require('fs-extra-promise');

fs.readFile('/etc/passwd', (err, data) => {
    if (err) throw err;
    console.log(data.toString());
});

fsEx.readFileAsync('/etc/passwd')
    .then(data => console.log(data.toString()))
    .then(() => fsEx.readFileAsync('/etc/sysctl.conf'))
    .then(data => console.log(data.toString()))
    .catch(err => console.error(err));