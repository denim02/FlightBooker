enum UserRole { Admin, User, AirlineOperator }

export class User {
    userId: string;
    role: UserRole;

    constructor(userId: string, role: UserRole) {
        this.userId = userId;
        this.role = role;
    }
}

export { UserRole };