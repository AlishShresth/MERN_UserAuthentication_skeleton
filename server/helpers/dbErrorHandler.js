// to handle validation errors and other erros that the database may throw when we make queries to it
const getErrorMessage = (err) => {
  let message = "";
  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = getUniqueErrorMessage(err);
        break;
      default:
        message = "Something went wrong";
    }
  } else {
    for (let errName in err.errors) {
      if (err.errors[errName].message) message = err.errors[errName].message;
    }
  }
  return message;
};

export default { getErrorMessage };

// errors not thrown because of Mongoose validator violation will contain an associated error code, in some cases, they need to be handled differently
// to parse the unique constraint-related error object and construct an appropriate error message
const getUniqueErrorMessage = (err) => {
  let output;
  try {
    let fieldName = err.message.substring(
      err.message.lastIndexOf(".$") + 2,
      err.messagse.lastIndexOf("_1")
    );
    output =
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + "already exists";
  } catch (err) {
    output = "Unique field already exists";
  }
  return output;
};
