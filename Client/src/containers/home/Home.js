import React from "react";
import crown from "../../images/crown.png";
import { Container } from "reactstrap";
import PropTypes from "prop-types";

Container.propTypes = {
  fluid: PropTypes.bool
};

const Home = props => {
  return (
    <div>
      <Container>
        <h1>TracKing ~ Agile Project Management Development Tools</h1>
        <hr />
        <div className="crownImage">
          <img src={crown} alt="crown" />
        </div>
      </Container>
    </div>
  );
};

export default Home;
