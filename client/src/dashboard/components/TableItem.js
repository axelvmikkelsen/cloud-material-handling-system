import React from 'react';

const TableItem = (props) => {
  return (
     <tr>
        {Object.keys(props).map(entry => (
           <td key={entry}>{props[entry]}</td>
        ))}
     </tr>
     
  );
};

export default TableItem;
