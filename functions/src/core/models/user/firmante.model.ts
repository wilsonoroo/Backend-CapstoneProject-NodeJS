import {UserCompact} from './user_compact.model';

export class Firmante extends UserCompact {
  isFirmado!: boolean;
  constructor(id: string) {
    super(id);
  }
}
