const dialogflow = require("dialogflow");
// const serviceAccount = require('./service_account1/serviceaccountkey.json');
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });
exports.entity = async (agent, entityName, list_of_codes) => {
    let data;
    console.log("speechOutput: ", list_of_codes);
    await senti(list_of_codes)
    console.log("session entity is : ", data)
    const client = new dialogflow.SessionEntityTypesClient();
    const sessionEntityTypeName = agent.session + '/entityTypes/' + entityName;
    console.log(sessionEntityTypeName)
    const sessionEntityType = {
        name: sessionEntityTypeName,
        entityOverrideMode: 'ENTITY_OVERRIDE_MODE_OVERRIDE',
        entities: data
    };
    const request = {
        parent: agent.session,
        sessionEntityType: sessionEntityType,
    };
    return client.createSessionEntityType(request).then((responses) => {
        console.log('Successfully created session entity type:', JSON.stringify(request));
    }).catch((err) => {
        agent.add(`I'm sorry, I'm having trouble remembering that status.`);
        console.error('Error creating session entitytype: ', err);
    });
    function senti(dat) {
        data = []
        dat.map((name) => {
            let value = name
            let synonyms = [name]
            data.push({
                value: value,
                synonyms: synonyms // synonyms looks like: ["geo fence group", "1", "1st", "first"]
            })
        })
        return data
    }
}

