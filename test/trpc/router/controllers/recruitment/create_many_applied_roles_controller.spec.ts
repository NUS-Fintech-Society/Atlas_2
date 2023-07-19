import { CreateManyAppliedRoleController } from '~/server/trpc/router/controllers/recruitment/create_many_applied_roles_controller'

describe("create_many_applied_roles_controller", () => {
    const controller = new CreateManyAppliedRoleController()

    test.todo("Without the correct permissions, an error should be thrown if the user attempts to save.")

    test.todo("The user should be able to upload the applicant into the database")

    test.todo("The user should not have applied for 2 of the same roles.")

    test.todo("If the user already exist, we should not upload him nor his roles into the database again.")
})