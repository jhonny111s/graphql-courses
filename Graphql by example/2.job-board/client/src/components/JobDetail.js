import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
//import { jobs } from '../fake-data';
import { getJob } from '../graphql/queries';

function JobDetail() {
  const [job, setJob] = useState(null);
  const { jobId } = useParams();

  //const job = jobs.find((job) => job.id === jobId);

  useEffect(() => {
    getJob(jobId).then(setJob);
  }, [jobId]);

  if (!job) {
    return <p> Loading...</p>
  }

  return (

    <div>
      <pre>{JSON.stringify(job)}</pre>
      <h1 className="title">
        {job.title}
      </h1>
      <h2 className="subtitle">
        <Link to={`/companies/${job.company.id}`}>
          {job.company.name}
        </Link>
      </h2>
      <div className="box">
        {job.description}
      </div>
    </div>
  );
}

export default JobDetail;
