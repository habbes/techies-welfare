
export type Permission = 
    'Messages.Preview'
    | 'Messages.Broadcast'
    | 'Users.Read.Self'
    | 'Users.Read.All'
    | 'Users.Create'
    | 'Users.Logout.Self'
    | 'Users.LogoutAll.Self'
    | 'Transactions.Read.All'
    | 'Transactions.Read.Self'
    | 'Transactions.Initiate.Self'
    | 'Transactions.Create';