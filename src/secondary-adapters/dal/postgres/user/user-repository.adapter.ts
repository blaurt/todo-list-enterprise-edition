import { inject, injectable } from "inversify";

import { User } from "../../../../core/components/user/entities/user.entity";
import { UserRepository } from "../../../../core/components/user/ports/user.repository";
import { BaseTypeOrmRepository } from "../shared/base-typeorm.repository";
import { UserEntityMapper } from "./user.entity-mapper";
import { UserEntity } from "./user.orm-entity";

@injectable()
export class UserRepositoryPgAdapter extends BaseTypeOrmRepository<User, UserEntity> implements UserRepository {
    public constructor(@inject(UserEntityMapper) mapper: UserEntityMapper) {
        super(UserEntity, mapper);
    }

    public async getBannedUsers(): Promise<User[]> {
        // const ormEntities = await this.getList({where:{status: USER_STATUS.BANNED}})
        return [];
    }

    public async findByUsername(username: string): Promise<User | null> {
        const ormEntity = await this.baseRepo.findOne({ where: { login: username, }, });
        if (ormEntity) {
            return UserEntity.toDomainEntity(ormEntity);
        }

        return null;
    }
}
