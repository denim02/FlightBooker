import { UserRole } from "../auth/User";
import { IndexedObject } from "./IndexedObject";

export interface UserData extends IndexedObject {
    email: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    role: UserRole
}