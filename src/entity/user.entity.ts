import {Column, Entity} from 'typeorm';
import Model from './model.entity';

@Entity()
export class User extends Model {
	@Column()
	name: string;

	@Column()
	surname: string;

	@Column({unique: true})
	email: string;

	@Column()
	password: string;
}
