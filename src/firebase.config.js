const firebaseConfig = {
    apiKey: process.env['FIRE_APIKEY'],
    authDomain: process.env['FIRE_AUTHDOMAIN'],
    databaseURL: process.env['FIRE_DATABASEURL'],
    projectId: process.env['FIRE_PROJECTID'],
    storageBucket: process.env['FIRE_STORAGEBUCKET'],
    messagingSenderId: process.env['FIRE_MESSAGINGSENDERID'],
    appId: process.env['FIRE_APPID'],
    measurementId: process.env['FIRE_MEASUREMENTID'],
};

module.exports = {
    firebaseConfig
};
