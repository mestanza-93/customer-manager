const remote = require('electron').remote;
const db = remote.getGlobal('database');
const workDB = db.connect().work;