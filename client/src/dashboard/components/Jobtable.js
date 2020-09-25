import React from 'react';
import { Card } from 'react-bootstrap';

import TableList from './TableList';

import timeUtil from '../../shared/util/timeUtil';

const JobTable = (props) => {
  const headers = ['From', 'To', 'SO', 'MHM', 'Work Status', 'Created'];

  const objects = [];

  for (let i = 0; i < props.jobs.length; i++) {
    const obj = props.jobs[i];
    const entry = {};
    if (i === 1) {
      if (obj.timeassigned){
        headers.push('Assigned');
      }
      if (obj.timecompleted) {
        headers.push('Completed');
      }
    }

    if (i === 1) {
      console.log(obj)
    }
    try {
      entry.from = obj.fromarea;
      entry.to = obj.toarea;
      entry.so = obj.so;
      entry.mhm = obj.mhm;
      entry.workstatus = obj.workstatus;
      entry.created = timeUtil.convertToDate(obj.timecreated);
      if (obj.timeassigned) {
        entry.assigned = timeUtil.convertToDate(obj.timeassigned);
      }
      if (obj.timecompleted) {
        entry.completed = timeUtil.convertToDate(obj.timecompleted);
      }
    } catch (err) {
      console.log('Something went wrong accessing the array');
    }

    objects.push(entry);
  }

  const content = { objects: objects, headers: headers };

  return (
    <Card className="text-left shadow-sm p-3 mb-5 bg-white rounded">
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
