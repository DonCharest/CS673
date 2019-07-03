import React from "react";
import { Container } from "reactstrap";
import PropTypes from "prop-types";
// import crown from "../../images/crown.png";
// import * as im from "../../images/crown.png";
import * as classes from "../../app.css";

Container.propTypes = {
  fluid: PropTypes.bool
};

const logininInfo = {
  color: "blue"
};

const LoginPage = props => {
  return (
    <div>
      <Container>
        <h1>Agile Project Management Development Tools</h1>
        <hr />
        <p>Please Login to use the App</p>
        <p>
          <i style={logininInfo}>&nbsp;&nbsp;&nbsp;email: admin@tracking.com</i>
        </p>
        <p>
          <i style={logininInfo}>&nbsp;&nbsp;&nbsp;password: admin</i>
        </p>
        <div className="crownImage">
          {/* <img src={crown} alt="crown" /> */}
        </div>
      </Container>
    </div>
  );
};

export default LoginPage;
