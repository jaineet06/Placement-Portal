import Application from "#models/application.model.js"

export const applyJobService = async (userId, jobId, roles) => {
    try {

        const applications = []
        for (const roleId of roles) {
            const exists = await Application.findOne({
                user: userId, job: jobId, role: roleId
            })

            if (!exists) {
                const application = await Application.create({
                    user: userId,
                    job: jobId,
                    role: roleId,
                    acceptedTerms: true,
                })

                applications.push(application)
            }
        }

        return applications
    } catch (error) {
        console.error("Student apply job Error:", error)
        throw error
    }
}

export const fetchAllAppliedJobsService = async (userId) => {
    try {
        const applications = await Application.find({ user: userId })
            .populate("job", "companyName jobType location title")
            .populate("role", "roleName")
            .sort({ appliedAt: -1 })
            .lean();

        return applications.map((app) => ({
            jobId: app.job?._id?.toString(),
            roleId: app.role?._id?.toString(),
            companyName: app.job?.companyName,
            jobType: app.job?.jobType,
            title: app.job?.title,
            location: app.job?.location,
            appliedRoleName: app.role?.roleName,
            status: app.status,
            appliedAt: app.appliedAt,
        }));
    } catch (error) {
        console.error("Student applied job fetch Error:", error);
        throw error;
    }
};