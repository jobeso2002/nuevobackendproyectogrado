import { Role } from "../../roles/entities/role.entity";
import { PermisoType } from "../../common/permiso.enum";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Permiso {
    @PrimaryGeneratedColumn()
    id:number;
   
    @Column({
        type: 'enum',
        enum: PermisoType
    })
    name: PermisoType
    @ManyToMany(()=> Role, (role)=> (role.permiso))
    roles: Role[] 
}
 