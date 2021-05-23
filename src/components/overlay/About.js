import React from 'react';

class About extends React.Component {

  render() {
    return (
      <div className="about">
        <p>Brändi Dog Online was originally developed as a classwork at the University of Zurich.</p>

        <h1>Contributors</h1>
        <p>
            Sandro Volonte<br/>
            Andrina Vincenz<br/>
            Siddhant Sahu<br/>
            Edouard Schmitz<br/>
            Pascal Emmenegger
        </p>
        <p>
            This is an open source project, feel free to <a target="_blank" href="https://github.com/sopra-fs21-group-06">contribute</a>.
        </p>
      </div>
    );
  }
}

export default About;