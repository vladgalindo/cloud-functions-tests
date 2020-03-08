const moment = require('moment');
const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');
const fireFunctions = require('firebase-functions');
const fireAdmin = require('firebase-admin');
const cors = require('cors')({ origin: true });

fireAdmin.initializeApp(fireFunctions.config().firebase);

const actionCodeSettings = {
    url: 'https://www.example.com/finishSignUp?cartId=1234',
    // This must be true.
    handleCodeInApp: true,
    dynamicLinkDomain: 'example.page.link'
};


const showMessage = (req, res) => {
    const message = `your message is: ${req.body.msg}, i'm getting deployed automatically
    
    ${req}
    `;
    res.send(message)
};

const getTime = (req, res) => {
    res.send(`${moment().format('LLLL')}, this a test`);
};

const envVars = (req, res) => {
    res.send(process.env)
};

const getSecrets = async (req, res) => {
    const PROJECT = 'projects/cloud-function-test-269618';
    const client = new SecretManagerServiceClient();

    const [secrets] = await client.listSecrets({
        parent: PROJECT,
    });

    secrets.forEach(secret => {
        const policy = secret.replication.replication;
        console.log(`${secret.name} (${policy})`);
    });

    res.send(secrets);
};

/*const getSecretVersion = async (req, res) => {
    const PROJECT = `projects/cloud-function-test-269618/secrets/${req.body.secret}/versions/${req.body.version}`;
    const client = new SecretManagerServiceClient();

    const [version] = await client.accessSecretVersion({
        name: PROJECT,
    });

    const payload = version.payload.data.toString('utf8');

    console.info(`Payload: ${payload}`);
    res.send(`${req.body.secret} - version ${req.body.version} - Payload: ${payload}`);
};*/

function validateToken(req) {
    if(req.header.authorization && req.header.authorization.startsWith('Bearer ')) {
        console.log(`Token is ${req.header.authorization}`);
        return req.header.authorization.split('Bearer ')[1];
    }
    return false;
}

function decodedAuthToken(token) {
    return fireAdmin.auth()
        .verifyIdToken(token)
        .then(decodedToken => decodedToken)
}

const authTest = fireFunctions.https.onRequest((req, res) => {
    cors(async (req, res) => {
        const reqUid = req.body.uid;
        const authToken = validateToken(req);

        if(!authToken) {
            res.status(403).send('Unauthtorize!!! missing token');
        }

        const decodedAuthToken = await decodedAuthToken(authToken);
        console.log(decodedAuthToken);

        if(decodedAuthToken.uid === reqUid) {
            res.status(200).send(decodedAuthToken);
        } else {
            res.status(403).send('Unauthorize!!! invalid user')
        }

    })
});


const sendLoginLink = (req, res) => {
    fireAdmin.auth().sendSignInLinkToEmail(req.body.email, actionCodeSettings)
        .then(function() {
            window.localStorage.setItem('emailForSignIn', req.body.email);
        })
        .catch(function(error) {
            console.log(error);
        });

};

module.exports = {
    showMessage,
    getTime,
    envVars,
    getSecrets,
    authTest,
    sendLoginLink,
};
