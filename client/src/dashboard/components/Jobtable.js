import React from 'react';
import { Card } from 'react-bootstrap';

import TableList from './TableList';

import timeUtil from '../../shared/util/timeUtil';

const JobTable = (props) => {
  const headers = ['Description', 'Work Status', 'Created'];

  const objects = [];

  for (let i = 0; i < props.jobs.length; i++) {
    const obj = props.jobs[i];
    const entry = {};
    try {
      entry.id = obj.description;
      entry.workstatus = obj.workstatus;
      entry.created = timeUtil.convertToDate(obj.timecreated);
      if (obj.timeassigned) {
        headers.push('Assigned');
        entry.assigned = timeUtil.convertToDate(obj.timeassigned);
      }
      if (obj.timecompleted) {
        headers.push('Completed');
        entry.completed = timeUtil.convertToDate(obj.timecompleted);
      }
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
