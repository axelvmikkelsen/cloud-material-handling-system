import React from 'react';

const phantom = {
  display: 'block',
  padding: '20px',
  height: '60px',
  width: '100%',
};

const style = {
  backgroundColor: '#343a40',
  borderTop: '1px solid #E7E7E7',
  textAlign: 'right',
  position: 'fixed',
  left: '0',
  bottom: '0',
  height: '30px',
  width: '100%',
};

const text = {
  marginTop: '5px',
  marginRight: '15px',
  color: 'darkGrey',
  fontSize: 'small',
  display: 'block',
};

const date = new Date();

const Footer = () => {
  return (
    <div>
      <div style={phantom} />
      <div style={style}>
        <p style={text}>© {date.getUTCFullYear()} Dept. of Mechanical and Industrial Engineering, NTNU</p>
      </div>
    </div>
  );
};

export default Footer;
