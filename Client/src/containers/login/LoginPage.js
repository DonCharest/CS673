import React from "react";
import { Container } from "reactstrap";
import PropTypes from "prop-types";
import * as classes from "../../app.css";

Container.propTypes = {
  fluid: PropTypes.bool
};

const centerText = {
  textAlign: "center"
};

const LoginPage = props => {
  return (
    <div>
      <Container>
        <h1 style={centerText}>Agile Project Management Development Tools</h1>
        <hr />
        <div className={classes.logo}>
          &#9812;<span className={classes.logoText}>TracKing</span>
        </div>
      </Container>
    </div>
  );
};

export default LoginPage;
