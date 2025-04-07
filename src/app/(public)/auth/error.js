import React from "react";

const AuthCodeError = () => {
  if (params.get("error_code").startsWith("4")) {
    // show error message if error is a 4xx error
    window.alert(params.get("error_description"));
  }

  console.log("params", params);

  return <div>AuthCodeError</div>;
};

export default AuthCodeError;
