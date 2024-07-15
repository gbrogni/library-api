import { UniqueEntityID } from './unique-entity-id';

export abstract class Entity<Props> {

  private _id: UniqueEntityID;
  protected props: Props;

  get id() {
    return this._id;
  }

  protected constructor(props: any, id?: UniqueEntityID) {
    this.props = props;
    this._id = id ?? new UniqueEntityID(id);
  }

  public equals(entity?: Entity<any>): boolean {
    if (!entity) {
      return false;
    }

    return entity === this || entity.id === this._id;
  }
}
