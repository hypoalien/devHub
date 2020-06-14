const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateEducationInput(data) {
  let errors = {};

  data.school = !isEmpty(data.school) ? data.school : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  data.feildofstudy = !isEmpty(data.feildofstudy) ? data.feildofstudy : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (Validator.isEmpty(data.school)) {
    errors.school = "School feild is required";
  }

  if (Validator.isEmpty(data.degree)) {
    errors.degree = "degree feild is required";
  }

  if (Validator.isEmpty(data.feildofstudy)) {
    errors.feildofstudy = "Feild of study date is required";
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = "From date is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
