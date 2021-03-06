import { IUser } from "../../models";

export function getPreviewUser(): IUser {
   return {
       _id: 'dummy_user',
        phone: '254700000000',
        name: 'John Doe',
        team: "Team",
        email: "john@mailer.com",
        createdAt: new Date(),
        updatedAt: new Date(),
        memberSince: new Date(2021, 0, 1),
        createdBy: {
            type: "user",
            _id: "adminId"
        },
        updatedBy: {
            type: "user",
            _id: "dummy_user"
        },
        status: "active",
        idNumber: "id",
        roles: ['member']
   }
}

export function getPreviewAccountSummary() {
    return {
        arrears: 5000,
        totalContribution: 10000
    }
}

  