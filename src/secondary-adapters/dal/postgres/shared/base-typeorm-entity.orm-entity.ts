import { BeforeInsert, BeforeRemove, BeforeUpdate, Column, Index, PrimaryGeneratedColumn } from "typeorm";

import { BaseEntity } from "../../../../core/shared/entities/base-entity.entity";

export abstract class BaseTypeOrmEntity {
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Index()
    @Column({ type: "uuid" })
    readonly entity_id: BaseEntity["entityId"];

    // @Column({ name: "created_at" })
    // _created_at: string;

    // @Column({ name: "updated_at" })
    // _updated_at: string;

    // @Column({ name: "deleted_at" })
    // _deleted_at: string | null;

    // get created_at() {
    //     return this._created_at;
    // }

    // get updated_at() {
    //     return this._updated_at;
    // }

    // get deleted_at() {
    //     return this._deleted_at;
    // }

    @Column()
    created_at: string;

    @Column()
    updated_at: string;

    @Column({ nullable: true })
    deleted_at: string;

    @BeforeInsert()
    beforeCreate() {
        this.created_at = new Date().toISOString();
        this.updated_at = new Date().toISOString();
    }

    @BeforeUpdate()
    beforeUpdate() {
        this.updated_at = new Date().toISOString();
    }

    // todo check if it actually works
    @BeforeRemove()
    beforeRemove() {
        this.deleted_at = new Date().toISOString();
    }
}