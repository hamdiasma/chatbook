export const validation = ({
  fullname,
  username,
  email,
  password,
  cf_password,
}) => {
  const err = {};

  if (!fullname) {
    err.fullname = "Plase add your full name.!";
  } else if (fullname.length > 25) {
    err.fullname = "Full name must be less then 25 charachters.!";
  }

  if (!username) {
    err.username = "Plase add your user name.!";
  } else if (username.replace(/ /g, "").length > 25) {
    err.username = "User name must be less then 25 charachters.!";
  }

  if (!email) {
    err.email = "Plase add your email.!";
  } else if (!validateEmail(email)) {
    err.email = "Please enter a valid email.!";
  }

  if (!password) {
    err.password = "Plase add your password.!";
  } else if (password.length < 6) {
    err.password = "Password must be at least 6 characters.!";
  }

  if (password !== cf_password) {
    err.cf_password = "Passwords not equals.!";
  }
  return {
    errMsg: err,
    errLength: Object.keys(err).length,
  };
};

const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};
