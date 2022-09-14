
import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
//import { request } from 'graphql-request'
import { getAccessToken } from '../auth';
const GRAPHQL_URL = 'http://localhost:9000/graphql';

const client = new ApolloClient({
    uri: GRAPHQL_URL,
    cache: new InMemoryCache(),
    /*     defaultOptions: {
            query: {
                fetchPolicy: 'network-only'
            }
        } */
})

const JOB_DETAIL_FRAGMENT = gql`
        fragment JobDetail on Job {
                id
                title
                company {
                    id
                    name
                }
                description
            }
     `;

/* const JOB_QUERY = gql`
        query JobQuery($id: ID!) {
            job(id: $id) {
                id
                title
                company {
                    id
                    name
                }
                description
            }
        }
     `; */

const JOB_QUERY = gql`
    query JobQuery($id: ID!) {
        job(id: $id) {
        ...JobDetail
        }
    }
    ${JOB_DETAIL_FRAGMENT}
`;

// ---> QUERY
export async function getJobs() {
    const query = gql`
        query {
            jobs {
                id
                title
                company {
                    name
                }
            }
        }
     `;

    //const { jobs } = await request(GRAPHQL_URL, query);
    const { data: { jobs } } = await client.query({ query, fetchPolicy: 'no-cache' })
    return jobs
}

export async function getJob(id) {
    const query = JOB_QUERY;

    //const { job } = await request(GRAPHQL_URL, query, { id });
    const variables = { id }
    const { data: { job } } = await client.query({ query, variables });
    return job
}

export async function getCompany(id) {
    const query = gql`
        query CompanyQuery($id: ID!) {
            company(id: $id) {
                id
                name
                description
                jobs {
                    id
                    title
                }
            }
        }
     `;

    //const { company } = await request(GRAPHQL_URL, query, { id });
    const { data: { company } } = await client.query({ query, variables: { id } });
    return company
}


// ---> Mutation

export async function createJob(input) {
    const mutation = gql`
        mutation CreateJobMutation($input: CreateJobInput!) {
            job: createJob(input: $input) {
                ...JobDetail
            }
        }
        ${JOB_DETAIL_FRAGMENT} 
     `;

    const headers = { 'Authorization': `Bearer ${getAccessToken()}` }
    const context = { headers }
    //const { job } = await request(GRAPHQL_URL, query, { input }, headers);

    const { data: { job } } = await client.mutate({
        mutation, variables: { input }, context,
        // cache getJob
        update: (cache, { data: { job } }) => {
            cache.writeQuery({
                query: JOB_QUERY,
                variables: { id: job.id }, // same getJob
                data: { job }
            });
        }
    });

    return job
}

export async function deleteJob(id) {
    const query = gql`
        mutation DeleteJobMutation($id: ID!) {
            job: deleteJob(id: $id) {
                id
                title
            }
        }
     `;

    //const { job } = await request(GRAPHQL_URL, query, { id });
    const { data: { job } } = await client.mutate({ mutation: query, variables: { id } });
    return job
}