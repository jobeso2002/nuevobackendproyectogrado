import { SetMetadata } from "@nestjs/common"
import { PermisoType } from "../../common/permiso.enum"

export const PERMISION_KEY = 'permiso'

export const Permiso = (...permiso: PermisoType[]) => SetMetadata(PERMISION_KEY, permiso) 