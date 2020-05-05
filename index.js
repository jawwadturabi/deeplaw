const express = require("express");
const bodyParser = require("body-parser");
const { WebhookClient } = require('dialogflow-fulfillment');
const app = express().use(bodyParser.json());
process.env.DEBUG = "dialogflow:debug"
const mongoose = require("mongoose");
var http = require("http");
require("dotenv");
const dburi = process.env.uri;
const Model1 = require("./model/schema").User;
const U_entity = require("./userEntity")
const docmail = require("./email");
require("datejs")
//connection with mongodb
mongoose.connect(dburi, { useNewUrlParser: true }).catch(err => {
    console.log("error occured", err);
});
mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
})
mongoose.connection.on("connected", () => {
    console.log("Connected with database");

});
mongoose.connection.on("disconnected", () => {
    console.log("Disconnected with database.");
    process.exit(1);
});
//// preventing app from sleeping
setInterval(function () {
    http.get("http://deeplaw.herokuapp.com");
}, 1800000);
///////
// writing webhook code for connecting with dialogflow

app.post("/webhook", function (request, response) {
    const _agent = new WebhookClient({ request, response });
    console.log("Dialogflow Request body: " + JSON.stringify(request.body));

    function welcome(agent) {
        agent.add(`Hi! I'm Elaina, DeepLaw's A.I. legal assistant. Thanks for logging in!
         What would you like to do today ? We can draft a document or you can ask me a general legal question.`)
        var code_list = []
        Model1.find({}).then(data => {
            console.log("data in db is : ", data)
            data.map((value) => {
                code_list.push(value.accessCode)
            })
            U_entity.entity(agent, "passcode", code_list)
        }).catch(e => {
            console.log("error retrieving data : ", e)
        })
    }

    function ask_ques(agent) {
        var access_code = agent.parameters['access_code'];
        if (!access_code) {
            agent.add("For verification please provide your valid access code")
        }
        else {
            agent.add(`Awesome! I'd love to help. Please check out the list of immediate documents 
            I can help you with and tell me the exact name of the document you need. 
            Or if you don't see what you're looking for on the list, let me know what you need, and if possible,
             I'll have my attorneys prepare it for you in no time so we can fill it out together. \nlist : \n\n- Operating Agreement
             \n- Employee Non-Compete Agreement`)
            agent.setContext({
                name: "user_credentials",
                lifespan: 5,
                "parameters": {
                    access_code
                }
            });
        }
    }

    function opr_agreement(agent) {
        var access_code = agent.getContext('user_credentials').parameters.access_code
        var companyname = agent.parameters['companyname']
        var companyaddress = agent.parameters['companyaddress']
        var username = agent.parameters['username']
        var mailingaddress = agent.parameters['mailingaddress']
        var titleatcompany = agent.parameters['titleatcompany']

        var info = {
            Operating_Agreement: {
                companyname,
                companyaddress,
                username,
                mailingaddress,
                titleatcompany,
            }
        }
        Model1.findOneAndUpdate({ accessCode: access_code }, info, { new: true }).then((result) => {
            console.log("data updated : ", result)
        }).catch((err) => {
            console.log("error is : ", err)
        });
        agent.add(`Company Name : ${companyname} .\nCompany Address : ${companyaddress} .\nMember Name : ${username} .
        \nMailing Address : ${mailingaddress} .\nTitle in Company : ${titleatcompany} .\n\nNote: These parameters/values will be added in to the document script .`)
    }

    function Employee_NonCompete_Agreement(agent) {
        var access_code = agent.getContext('user_credentials').parameters.access_code
        var employerfirstname = agent.parameters['employerfirstname']
        var employerlastname = agent.parameters['employerlastname']
        var businesstype = agent.parameters['businesstype']
        var businessaddress = agent.parameters['businessaddress']
        var employeefirstname = agent.parameters['employeefirstname']
        var employeelastname = agent.parameters['employeelastname']
        var employeeaddress = agent.parameters['employeeaddress']
        var date = agent.parameters['date']
        var jobtitle = agent.parameters['jobtitle']
        var industrydescr = agent.parameters['industrydescr']
        var duration = agent.parameters['duration']
        var businessdescr = agent.parameters['businessdescr']
        var businesscomp = agent.parameters['businesscomp']
        var nonsolicit = agent.parameters['nonsolicit']
        var scope = agent.parameters['scope']
        var info = {
            Employee_NonCompete_Agreement: {
                businesstype,
                industrydescr,
                employerfirstname,
                employerlastname,
                businessaddress,
                businesscomp,
                businessdescr,
                jobtitle,
                date,
                employeefirstname,
                employeelastname,
                employeeaddress,
                duration,
                scope,
                nonsolicit
            }
        }
        Model1.findOneAndUpdate({ accessCode: access_code }, info, { new: true }).then((result) => {
            console.log("data updated : ", result)
        }).catch((err) => {
            console.log("error is : ", err)
        });
        agent.add(`And we’re done! Please check your email for your completed document and further instructions. Thank you for letting me help you draft this Employee Non Compete Agreement :)`)
    }


    function Dress_Code_Policy(agent) {
        var access_code = agent.getContext('user_credentials').parameters.access_code
        var employeename = agent.parameters['employeename']
        var image = agent.parameters['image']
        var clientcustomer = agent.parameters['clientcustomer']
        var contact = agent.parameters['contact']
        var businesscasual = agent.parameters['businesscasual']
        var info = {
            Dress_Code_Policy: {
                image,
                contact,
                businesscasual,
                employeename,
                clientcustomer
            }

        }
        Model1.findOneAndUpdate({ accessCode: access_code }, info, { new: true }).then((result) => {
            console.log("data updated : ", result)
        }).catch((err) => {
            console.log("error is : ", err)
        });
        agent.add(`And we’re done! Please check your email for your attorney reviewed and completed document in the next 24 hours. Thank you for letting me help you draft this dress code policy :)`)
    }


    function Independent_Contractor_Agreement(agent) {
        var access_code = agent.getContext('user_credentials').parameters.access_code
        var contractorname = agent.parameters['contractorname']
        var contractoraddress = agent.parameters['contractoraddress']
        var agreementdate = agent.parameters['agreementdate']
        var companyname = agent.parameters['companyname']
        var entitytype = agent.parameters['entitytype']
        var feeamount = agent.parameters['feeamount']
        var startdate = agent.parameters['startdate']
        var enddate = agent.parameters['enddate']
        var contractordeliverables = agent.parameters['contractordeliverables']
        var otherconfinfo = agent.parameters['otherconfinfo']
        var info = {
            Independent_Contractor_Agreement: {
                contractoraddress,
                contractorname,
                enddate,
                otherconfinfo,
                companyname,
                contractordeliverables,
                agreementdate,
                entitytype,
                startdate,
                feeamount
            }
        }
        Model1.findOneAndUpdate({ accessCode: access_code }, info, { new: true }).then((result) => {
            console.log("data updated : ", result)
        }).catch((err) => {
            console.log("error is : ", err)
        });
        agent.add(`And we’re done! Please check your email for your completed document and further instructions. Thank you for letting me help you draft this Employee Non Compete Agreement.`)
    }

    function Buy_Sell_Agreement(agent) {
        var access_code = agent.getContext('user_credentials').parameters.access_code
        var companyname = agent.parameters['companyname']
        var companyshares = agent.parameters['companyshares']
        var parvalue = agent.parameters['parvalue']
        var scorp = agent.parameters['scorp']
        var insurancecomp = agent.parameters['insurancecomp']
        var insuranceaddress = agent.parameters['insuranceaddress']
        var installment = agent.parameters['installment']
        var interest = agent.parameters['interest']
        var divorce = agent.parameters['divorce']
        var spouseinterest = agent.parameters['spouseinterest']
        var spouseinstallments = agent.parameters['spouseinstallments']
        var info = {
            BuySell_Agreement: {
                parvalue,
                spouseinterest,
                companyname,
                insuranceaddress,
                insurancecomp,
                scorp,
                installment,
                divorce,
                companyshares,
                interest,
                spouseinstallments
            }
        }
        Model1.findOneAndUpdate({ accessCode: access_code }, info, { new: true }).then((result) => {
            console.log("data updated : ", result)
        }).catch((err) => {
            console.log("error is : ", err)
        });
        agent.add(`And we’re done! Please check your email for your attorney reviewed and completed document in the next 24 hours. Thank you for letting me help you draft this Employee Non Compete Agreement :)`)
    }

    function Equal_Opportunity_Employment_Policy(agent) {
        var access_code = agent.getContext('user_credentials').parameters.access_code
        var employername = agent.parameters['employername']
        var accommadation = agent.parameters['accommadation']
        var complaints = agent.parameters['complaints']
        var complainttwo = agent.parameters['complainttwo']
        var info = {
            Equal_Opportunity_Employment_Policy: {
                employername,
                accommadation,
                complaints,
                complainttwo
            }
        }
        Model1.findOneAndUpdate({ accessCode: access_code }, info, { new: true }).then((result) => {
            console.log("data updated : ", result)
        }).catch((err) => {
            console.log("error is : ", err)
        });
        agent.add(`And we’re done! Please check your email for your attorney reviewed and completed document in the next 24 hours. Thank you for letting me help you draft this equal opportunity employment policy :)`)
    }

    function Operating_Agreement_Multi_Member(agent) {
        var access_code = agent.getContext('user_credentials').parameters.access_code
        var companyname = agent.parameters['companyname']
        var membernames = agent.parameters['membernames']
        var address = agent.parameters['address']
        var aoo = agent.parameters['aoo']
        var memberschedule = agent.parameters['memberschedule']
        var memberinterest = agent.parameters['memberinterest']
        var advancenotice = agent.parameters['advancenotice']
        var minimumnoticean = agent.parameters['minimumnoticean']
        var quorum = agent.parameters['quorum']
        var vote = agent.parameters['vote']
        var action = agent.parameters['action']
        var management = agent.parameters['management']
        var transaction = agent.parameters['transaction']
        var transactionlimit = agent.parameters['transactionlimit']
        var loanlimit = agent.parameters['loanlimit']
        var lawsuitlimit = agent.parameters['lawsuitlimit']
        var removal = agent.parameters['removal']
        var elect = agent.parameters['elect']
        var transfers = agent.parameters['transfers']
        var tax = agent.parameters['tax']
        var taxremoval = agent.parameters['taxremoval']
        var taxauthority = agent.parameters['taxauthority']
        var taxapproval = agent.parameters['taxapproval']
        var dissolution = agent.parameters['dissolution']
        var managername = agent.parameters['managername']
        var articlesofincorporationdate = agent.parameters['articlesofincorporationdate']
        var city = agent.parameters['city']
        var county = agent.parameters['county']
        var address = agent.parameters['address']
        var fax = agent.parameters['fax']
        var email = agent.parameters['email']
        var title = agent.parameters['title']
        var manager = agent.parameters['manager']
        var managerfax = agent.parameters['managerfax']
        var manageremail = agent.parameters['manageremail']
        var modification = agent.parameters['modification']

        var info = {
            membernames,
            minimumnoticean,
            loanlimit,
            lawsuitlimit,
            aoo,
            advancenotice,
            address,
            transactionlimit,
            transaction,
            companyname,
            action,
            management,
            vote,
            memberschedule,
            memberinterest,
            quorum,
            removal,
            elect,
            transfers,
            tax,
            taxremoval,
            taxauthority,
            taxapproval,
            dissolution,
            managername,
            articlesofincorporationdate,
            city,
            county,
            address,
            fax,
            email,
            title,
            manager,
            managerfax,
            manageremail,
            modification
        }
        Model1.findOneAndUpdate({ accessCode: access_code }, info, { new: true }).then((result) => {
            console.log("data updated : ", result)
        }).catch((err) => {
            console.log("error is : ", err)
        });
        agent.add(` A few notes:  I’m going to use the standard language for the next section regarding Capital Contributions and Capital Accounts. It states that no Member is required to make additional Capital Contributions to the Company or is entitled to withdraw any part of its Capital Account. If you want to set up the company with different member tiers, including voting rights and profit distribution rights, please schedule attorney time for one of our attorneys to help you. 
Additionally, if you want to add anyone not already listed as a Member at any time, you’ll need to fill out a Joinder Agreement. I can help you with that whenever you need that, too.                For now, I'll mark this document as complete and send it off to our attorneys to review. They will get back to you and/or send you a finalized document in the next 24 hours or following business day. Thanks!`)
    }

    function Mutual_Non_Disclosure_Agreement(agent) {
        var access_code = agent.getContext('user_credentials').parameters.access_code
        var partyone = agent.parameters['partyone']
        var partyonestate = agent.parameters['partyonestate']
        var partyoneentity = agent.parameters['partyoneentity']
        var partyoneaddress = agent.parameters['partyoneaddress']
        var partytwo = agent.parameters['partytwo']
        var partytwostate = agent.parameters['partytwostate']
        var partytwoentity = agent.parameters['partytwoentity']
        var partytwoaddress = agent.parameters['partytwoaddress']
        var purpose = agent.parameters['purpose']
        var timeperiod = agent.parameters['timeperiod']
        var partyonecity = agent.parameters['partyonecity']
        var partyonecounty = agent.parameters['partyonecounty']
        var info = {
            Mutual_Non_Disclosure_Agreement: {
                partyoneaddress,
                partyonestate,
                partytwoaddress,
                partyonecity,
                partytwostate,
                partyonecounty,
                partyone,
                timeperiod,
                partyoneentity,
                partytwoentity,
                purpose,
                partytwo
            }
        }
        Model1.findOneAndUpdate({ accessCode: access_code }, info, { new: true }).then((result) => {
            console.log("data updated : ", result)
        }).catch((err) => {
            console.log("error is : ", err)
        });
        agent.add(`And we’re done! Please check your email for your attorney reviewed and completed document in the next 24 hours. Thank you for letting me help you draft this Mutual NDA :)`)
    }

    function Corporate_Bylaws(agent) {
        var access_code = agent.getContext('user_credentials').parameters.access_code
        var corporatename = agent.parameters['corporatename']
        var address = agent.parameters['address']
        var meetings = agent.parameters['meetings']
        var quorum = agent.parameters['quorum']
        var voting = agent.parameters['voting']
        var board = agent.parameters['board']
        var vacancy = agent.parameters['vacancy']
        var remove = agent.parameters['remove']
        var compensation = agent.parameters['compensation']
        var info = {
            Corporate_Bylaws: {
                board,
                voting,
                meetings,
                quorum,
                remove,
                compensation,
                address,
                vacancy,
                corporatename
            }
        }
        Model1.findOneAndUpdate({ accessCode: access_code }, info, { new: true }).then((result) => {
            console.log("data updated : ", result)
        }).catch((err) => {
            console.log("error is : ", err)
        });
        agent.add(`And we’re done! Please check your email for your attorney reviewed and completed document in the next 24 hours. Thank you for letting me help you draft these Corporate Bylaws :)`)
    }

    function Family_Medical_Leave_Policy(agent) {
        var access_code = agent.getContext('user_credentials').parameters.access_code
        var employername = agent.parameters['employername']
        var contact = agent.parameters['contact']
        var formsdepartment = agent.parameters['formsdepartment']
        var statuscontact = agent.parameters['statuscontact']
        var permitrequired = agent.parameters['permitrequired']
        var paymentmethod = agent.parameters['paymentmethod']
        var changeposition = agent.parameters['changeposition']
        var statuscontact = agent.parameters['statuscontact']
        var info = {
            Family_Medical_Leave_Policy: {
                contact,
                changeposition,
                paymentmethod,
                formsdepartment,
                statuscontact,
                permitrequired,
                transactionlimit,
                employername
            }
        }
        Model1.findOneAndUpdate({ accessCode: access_code }, info, { new: true }).then((result) => {
            console.log("data updated : ", result)
        }).catch((err) => {
            console.log("error is : ", err)
        });
        agent.add(`And we’re done! Please check your email for your attorney reviewed and completed document in the next 24 hours. Thank you for letting me help you draft this Family Medical Leave Policy :)`)
    }


    function Background_Check_Policy(agent) {
        var TOA = "Background Check Policy IL";
        var access_code = agent.getContext('user_credentials').parameters.access_code
        var employeeName = agent.parameters['employeeName']
        var requireMayRequire = agent.parameters['requireMayRequire']
        var humanResourcesDepartmentName = agent.parameters['humanResourcesDepartmentName']
        var union = agent.parameters['union']
        var position = agent.parameters['position']
        console.log("context is : ", access_code)
        var info = {
            TOA,
            Background_Check_Policy: {
                employeeName: titlecase(employeeName),
                requireMayRequire: titlecase(requireMayRequire),
                humanResourcesDepartmentName: titlecase(humanResourcesDepartmentName),
                union: titlecase(union),
                position: titlecase(position)
            }
        }
        Model1.findOneAndUpdate({ accessCode: access_code }, info, { new: true }).then((result) => {
            console.log("data updated : ", result)
            docmail.email1(info.Background_Check_Policy, TOA)
        }).catch((err) => {
            console.log("error is : ", err)
        });
        agent.add(`And we’re done! Please check your email for your attorney reviewed and completed document in the next 24 hours. Thank you for letting me help you draft this background check policy :)`)
    }




    let intents = new Map();
    intents.set("Default Welcome Intent", welcome);
    intents.set("operating agreement", opr_agreement)
    intents.set("Employee Non-Compete Agreement", Employee_NonCompete_Agreement)
    intents.set("Dress Code Policy", Dress_Code_Policy)
    intents.set("Independent Contractor Agreement", Independent_Contractor_Agreement)
    intents.set("Buy-Sell Agreement", Buy_Sell_Agreement)
    intents.set("draft a document", ask_ques)
    intents.set("Equal Opportunity Employment Policy", Equal_Opportunity_Employment_Policy)
    intents.set("Operating Agreement Multi-Member", Operating_Agreement_Multi_Member)
    intents.set("Mutual Non-Disclosure Agreement", Mutual_Non_Disclosure_Agreement)
    intents.set("Corporate Bylaws", Corporate_Bylaws)
    intents.set("Family Medical Leave Policy", Family_Medical_Leave_Policy)
    intents.set("Background Check Policy", Background_Check_Policy)

    _agent.handleRequest(intents)
});

app.listen(process.env.PORT || 4000, function () {
    console.log("server is running")
})

function titlecase(str) {
    var rt = str.toLowerCase().split(" ")
    for (i = 0; i < rt.length; i++) {

        rt[i] = rt[i].charAt(0).toUpperCase() + rt[i].slice(1)
    }
    var str1 = rt.join(' ')
    return str1
}