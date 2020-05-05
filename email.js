const fs = require("fs");
const carbone = require('carbone');
require("datejs");

exports.email1 = async (info, toa) => {
  file(info, toa)
}


async function file(data, agreementType) {
  await carbone.render('./Documents/' + agreementType + '.docx', data, async (err, result) => {
    if (err) {
      return console.log("error in render is : ", err);
    } else {
      await fs.writeFileSync('./gen_document/' + agreementType + '.docx', result);
      console.log("document has been generated")
    }
  });



}