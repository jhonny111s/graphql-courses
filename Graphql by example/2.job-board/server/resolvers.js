import { Company, Job } from "./db.js";

function rejectIf(condition) {
    if (condition) {
        throw new Error("Unauthorized")
    }

}

export const resolvers = {
    Query: {
        job: async (_root, { id }) => {

            const result = await Job.findById(id);
            //console.log("JOB QUERY: ", result);
            return result
        },

        jobs: async () => {
            const result = await Job.findAll();
            //console.log("JOBS QUERY: ", result);
            return result
        },

        company: async (_root, { id }) => {
            const result = await Company.findById(id);
            //console.log("Company QUERY: ", result);
            return result
        }
    },

    Mutation: {
        createJob: async (_root, { input }, { user }) => {
            console.log(user);
            rejectIf(!user)

            const result = await Job.create({ ...input, companyId: user.companyId });
            //console.log("CREATE JOB", result);
            return result;
        },

        deleteJob: async (_root, { id }, { user }) => {
            rejectIf(!user)

            const job = await Job.findById(id);
            if (!job) {
                throw new Error("No existe usuario")
            }
            rejectIf(job.companyId !== user.companyId);

            const result = await Job.delete(id);
            //console.log("DELETE JOB", result);
            return result;
        },

        updateJob: async (_root, { input }, { user }) => {
            console.log(input);
            rejectIf(!user)

            const job = await Job.findById(input.id);
            rejectIf(job.companyId !== user.companyId)
            const result = await Job.update({ ...input, companyId: user.companyId });
            //console.log("UPDATE JOB", result);
            return result;
        }
    },

    Job: {
        // parent = job
        company: async (parent) => {
            const result = await Company.findById(parent.companyId);
            //console.log("COMPANY QUERY", result);
            return result
        }
    },

    // parent = company
    Company: {
        jobs: async (parent) => {
            const result = await Job.findAll((jobs) => jobs.companyId === parent.id);
            console.log("COMPANY JOBS QUERY", result);
            return result
        }
    }
}