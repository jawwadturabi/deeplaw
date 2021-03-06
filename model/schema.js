const mongoose = require("mongoose");

//////////
//making schema for collection already exist in db
const userSchema = new mongoose.Schema({

    accessCode: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    sessionPath: {
        type: String
    },
    subscriptionType: {
        type: String
    },
    status: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },

    TOA: [String],

    Employee_NonCompete_Agreement: {
        businesstype: String,
        industrydescr: String,
        employerfirstname: String,
        employerlastname: String,
        businessaddress: String,
        businesscomp: String,
        businessdescr: String,
        jobtitle: String,
        date: String,
        employeefirstname: String,
        employeelastname: String,
        employeeaddress: String,
        duration: String,
        scope: String,
        nonsolicit: String,
    },
    Dress_Code_Policy: {
        image: String,
        contact: String,
        businesscasual: String,
        employeename: String,
        clientcustomer: String
    },
    Independent_Contractor_Agreement: {
        contractoraddress: String,
        contractorname: String,
        enddate: String,
        otherconfinfo: String,
        companyname: String,
        contractordeliverables: String,
        agreementdate: String,
        entitytype: String,
        startdate: String,
        feeamount: String,
    },
    BuySell_Agreement: {
        parvalue: String,
        spouseinterest: String,
        companyname: String,
        insuranceaddress: String,
        insurancecomp: String,
        scorp: String,
        installment: String,
        divorce: String,
        companyshares: String,
        interest: String,
        spouseinstallments: String
    },
    Operating_Agreement: {
        companyname: String,
        companyaddress: String,
        username: String,
        mailingaddress: String,
        titleatcompany: String,
    },
    Equal_Opportunity_Employment_Policy: {
        employername: String,
        accommadation: String,
        complaints: String,
        complainttwo: String,
    },
    Mutual_Non_Disclosure_Agreement: {
        partyoneaddress: String,
        partyonestate: String,
        partytwoaddress: String,
        partyonecity: String,
        partytwostate: String,
        partyonecounty: String,
        partyone: String,
        timeperiod: String,
        partyoneentity: String,
        partytwoentity: String,
        purpose: String,
        partytwo: String,
    },
    Operating_Agreement_Multi_Member: {
        membernames: String,
        minimumnoticean: String,
        loanlimit: String,
        lawsuitlimit: String,
        aoo: String,
        advancenotice: String,
        address: String,
        transactionlimit: String,
        transaction: String,
        companyname: String,
        action: String,
        management: String,
        vote: String,
        memberschedule: String,
        memberinterest: String,
        quorum: String,
        removal: String,
        elect: String,
        transfers: String,
        tax: String,
        taxremoval: String,
        taxauthority: String,
        taxapproval: String,
        dissolution: String,
        managername: String,
        articlesofincorporationdate: String,
        city: String,
        county: String,
        address: String,
        fax: String,
        email: String,
        title: String,
        manager: String,
        managerfax: String,
        manageremail: String,
        modification: String,
    },
    Corporate_Bylaws: {
        board: String,
        voting: String,
        meetings: String,
        quorum: String,
        remove: String,
        compensation: String,
        address: String,
        vacancy: String,
        corporatename: String
    },
    Family_Medical_Leave_Policy: {
        contact: String,
        changeposition: String,
        paymentmethod: String,
        formsdepartment: String,
        statuscontact: String,
        permitrequired: String,
        transactionlimit: String,
        employername: String
    },
    Background_Check_Policy: {
        employeeName: String,
        requireMayRequire: String,
        humanResourcesDepartmentName: String,
        administration: String,
        union: String,
        position: String
    }

});

var User = new mongoose.model("User", userSchema);
module.exports = {
    User
}