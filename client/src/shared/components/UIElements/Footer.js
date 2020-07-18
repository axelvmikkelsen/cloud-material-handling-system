import React from 'react';

const phantom = {
    display: 'block',
    padding: '20px',
    height: '60px',
    width: '100%',
   }

const style = {
   backgroundColor: '#F8F8F8',
   borderTop: '1px solid #E7E7E7',
   textAlign: 'center',
   padding: '20px',
   position: 'relative',
   left: '0',
   bottom: '0',
   height: '60px',
   width: '100%',
}

const Footer = () => {
   return (
       <div style={{ paddingTop: '20px'}}>
           <div style={phantom} />
           <div style={style}>
               <p style={{ color: 'darkGrey', fontSize: 'small'}}>© 2020 Dept. of Mechanical Engineering, NTNU</p>
           </div>
       </div>
   )
}

export default Footer;