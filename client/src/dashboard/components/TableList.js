import React from 'react';
import { Table } from 'react-bootstrap';

import TableItem from './TableItem';

const TableList = (props) => {
  if (props.content.objects.length === 0) {
    return (
      <div>
        <h2>No content available</h2>
      </div>
    );
  }

  return (
    <div>
      <Table responsive="sm">
        <thead>
          <tr>
             {props.content.headers.map((title) => (
                <th key={title}>{title}</th>
             ))}
          </tr>
        </thead>
        <tbody>
          {props.content.objects.map((row) => (
              <TableItem key={row.id} {...row} />
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TableList;
