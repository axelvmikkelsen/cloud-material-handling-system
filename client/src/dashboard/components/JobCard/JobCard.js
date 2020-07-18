import React, { useState, useEffect } from 'react';

import { Card, Tab, Tabs } from 'react-bootstrap';

import JobTable from '../Jobtable';

import LoadingSpinner from '../../../shared/components/UIElements/LoadingSpinner';

import { useHttpClient } from '../../../shared/hooks/http-hook';

const JobCard = (props) => {
  const [jobKey, setJobKey] = useState('scheduled');

  const [loadedJobs, setLoadedJobs] = useState();

  const { isLoading, sendRequest } = useHttpClient();

  let url = '/jobs/table/' + jobKey;

  useEffect(() => {
    const requestJob = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + url
        );
        setLoadedJobs(responseData.jobs);
      } catch (err) {
        console.log('Cold not fetch');
      }
    };
    requestJob();
  }, [sendRequest, jobKey, url]);

  return (
    <Card
      style={{ marginLeft: '20px', marginRight: '20px', marginBottom: '25px' }}
    >
      <Card.Header>
        <Card.Title>Jobs</Card.Title>
        <Tabs
          id="controlled-tab-example"
          activeKey={jobKey}
          onSelect={(tab) => setJobKey(tab)}
        >
          <Tab eventKey="scheduled" title="Scheduled"></Tab>
          <Tab eventKey="unscheduled" title="Unscheduled"></Tab>
          <Tab eventKey="completed" title="Completed"></Tab>
        </Tabs>
      </Card.Header>
      <Card.Body>
        <React.Fragment>
          {loadedJobs && !isLoading && (
            <JobTable jobs={loadedJobs} type={jobKey} />
          )}
          {isLoading && (
            <div className="center">
              <LoadingSpinner />
            </div>
          )}
        </React.Fragment>
      </Card.Body>
    </Card>
  );
};

export default JobCard;
