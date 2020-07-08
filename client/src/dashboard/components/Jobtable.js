import React from 'react';
import { Card } from 'react-bootstrap';

import TableList from './TableList';

const convertToDate = (timestamp) => {
  let date = new Date(timestamp);
  let day = date.getDay();
  let month = date.getMonth();
  let year = date.getFullYear();
  let hours = date.getHours();
  let minutes = "0" + date.getMinutes();
  let seconds = "0" + date.getSeconds();

  return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + '   ' + day + '/' + month + '-' + year ;
}

const JobTable = (props) => {
  const headers = ['Description', 'Work Status', 'Created'];

  const objects = [];

  for (let i = 0; i < props.jobs.length; i++) {
    const obj = props.jobs[i];
    const entry = {};
    try {
      entry.id = obj.description;
      entry.workstatus = obj.workstatus;
      entry.created = convertToDate(obj.timecreated);
    } catch (err) {
      console.log('Something went wrong accessing the array');
    }

    objects.push(entry);
  }

  const content = { objects: objects, headers: headers };

  return (
    <Card className="text-left">
      <Card.Body>
        {props.title && (
          <React.Fragment>
            <Card.Title>{props.title}</Card.Title>
            <Card.Text>{props.description}</Card.Text>
          </React.Fragment>
        )}

        <Card.Body>
          <TableList content={content} />
        </Card.Body>
      </Card.Body>
    </Card>
  );
};

export default JobTable;
