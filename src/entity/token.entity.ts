import {Column, DeleteDateColumn, Entity} from 'typeorm';
import Model from './model.entity';

@Entity()
export class Token extends Model {
	@Column({name: 'user_id'})
	userId: number;

	@Column()
	token: string;

	@DeleteDateColumn({name: 'expired_at'})
	expiredAt: Date;
}
