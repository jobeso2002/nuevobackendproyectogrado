// roles/role.entity.ts
import { Permiso } from '../../permiso/entities/permiso.entity';
import { RoleType } from '../../common/tiporole.enum';
import { Entity, PrimaryGeneratedColumn, Column, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type:'enum', enum:RoleType})
  name: RoleType;

  @ManyToMany(() => Permiso, (permiso)=> permiso.roles, 
  {
      cascade:true,
      eager: true // Si quieres cargar automáticamente los permisos al cargar un rol
  })
  @JoinTable({
    name: 'role_permiso', // Nombre explícito de la tabla intermedia
  joinColumn: { name: 'role_id', referencedColumnName: 'id' },
  inverseJoinColumn: { name: 'permiso_id', referencedColumnName: 'id' }
  })
  permiso: Permiso[];

  @OneToMany(()=> Usuario, usuario => usuario.role)
  usuarios: Usuario[];
}