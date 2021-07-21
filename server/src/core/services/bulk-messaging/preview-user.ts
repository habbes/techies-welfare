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
        joinedAt: new Date(2021, 0, 1)
   }
}

export function getPreviewAccountSummary() {
    return {
        arrears: 5000,
        totalContribution: 10000
    }
}

  