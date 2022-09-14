import JobList from './JobList';
//import { jobs } from '../fake-data';
import { useEffect, useState } from 'react';
import { getJobs } from '../graphql/queries';


function JobBoard() {

  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    getJobs().then(setJobs).catch(setError)
  }, []);

  if (error) {
    return <p> Sorry, something went wrong. <pre>{error.message}</pre></p>
  }

  return (
    <div>
      <h1 className="title">
        Job Board
      </h1>
      <JobList jobs={jobs} />
    </div>
  );
}

export default JobBoard;
