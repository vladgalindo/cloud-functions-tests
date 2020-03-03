const moment = require('moment');
const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');

const showMessage = (req, res) => {
    const message = `your message is: ${req.body.msg}, i'm getting deployed automatically
    
    ${JSON.stringify(req)}
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
    const PROJECT = 'cloud-function-test-269618';
    const client = new SecretManagerServiceClient();

    // Access the secret.
    const [accessResponse] = await client.accessSecretVersion({
        name: 'my-secret',
    });

    const responsePayload = accessResponse.payload.data.toString('utf8');
    const message = `Payload: ${responsePayload}`;
    console.info(message);
    res.send(message);
};

module.exports = {
    showMessage,
    getTime,
    envVars,
    getSecrets,
};
