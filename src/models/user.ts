import Role from './role';
export default class User{
  userId: number; // primary key
  username: string; // not null, unique
  password: string; // not null
  firstName: string; // not null
  lastName: string; // not null
  email: string; // not null
  role: Role // not null

  constructor(obj) {
    if (!obj) {
      return;
    }
    this.userId = obj.userid || obj.userId || 0;
    this.username = obj.username;
    this.password = obj.password;
    this.firstName = obj.firstname || obj.firstName;
    this.lastName = obj.lastname || obj.lastName;
    this.email = obj.email;
    this.role = obj.role || "(0,user)";
  }
}
