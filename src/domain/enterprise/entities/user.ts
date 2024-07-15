import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { UserRole } from '../enums/user-role';

export interface UserProps {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export class User extends Entity<UserProps> {

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  get role(): UserRole {
    return this.props.role;
  }

  set name(value: string) {
    this.props.name = value;
  }

  set email(value: string) {
    this.props.email = value;
  }

  set password(value: string) {
    this.props.password = value;
  }

  public static create(props: UserProps, id?: UniqueEntityID): User {
    return new User(props, id);
  }

  public static createWithRoleString(props: Omit<UserProps, 'role'> & { role?: string; }, id?: UniqueEntityID): User {
    if (typeof props.role !== 'string') {
      throw new Error(`Role must be a string, received ${typeof props.role}`);
    }
    const roleEnumValue = UserRole[props.role.toUpperCase() as keyof typeof UserRole];
    if (!roleEnumValue) {
      throw new Error(`Invalid role: ${props.role}`);
    }
    return new User({ ...props, role: roleEnumValue }, id);
  }

}