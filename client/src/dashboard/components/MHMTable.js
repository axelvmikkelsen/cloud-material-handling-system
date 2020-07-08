import React from 'react';
import { Card } from 'react-bootstrap';

import TableList from './TableList';

const MHMTable = (props) => {

   const headers = ['Tag ID', 'Workstatus', 'Status', 'Zone', 'Last seen']

   const objects = []

   for (let i = 0; i < props.content.objects.length; i++) {
      const obj = props.content.objects[i];
      const entry = {};
      try {
        entry.id = obj.name;
        entry.workstatus = obj.workstatus
        entry.status = obj.status
        entry.zone = obj.zone;
        entry.lastseen = obj.lastseen;
      } catch (err) {
        console.log('Something went wrong accessing the array');
      }
  
      objects.push(entry);
    }
  
    const content = { objects: objects, headers: headers}

  return (
    <Card className="text-left">
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>
           {props.description}
        </Card.Text>
        <Card.Body>
          <TableList content={content} />
        </Card.Body>
      </Card.Body>
    </Card>
  );
};

export default MHMTable;