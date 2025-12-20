export interface IUser {
	id?: string
	name: string
	surname: string
	patronymic?: string | null
	phone?: string | null
	address?: string | null
	birthday?: string | null
	email: string
	password?: string
	role_id: number
	group_id?: string | null
	organization_id?: string
	isRegister?: boolean
	isArchive?: boolean
	organization?: IOrganization
	group?: IGroup
	role?: IRole
}

export interface IOrganization {
	id: string
	name: string
	tarrif_id?: string | null
}

export interface IRole {
	id: number
	name: string
}

export interface IGroup {
	id?: string
	name: string
	course: number | string
	max_course?: number | string
	admission_date: Date | string
	classroomTeacher_id?: string | null
	speciality_id: string | null
	organization_id?: string
	isArchive?: boolean
	organization?: IOrganization
	speciality?: ISpeciality
	classroom_teacher?: IUser | null
	students?: IUser[] | null
}

export interface ISpeciality {
	id?: string
	name: string
	organization_id?: string
	organization?: IOrganization
}

export interface ISubject {
	id?: string
	name: string
}

export interface ISubjectGroup {
	id?: string
	subject: ISubject
	group: IGroup
	teacher: IUser
}

export interface IDataForSubject {
	subjects: ISubject[]
	groups: IGroup[]
	teachers: IUser[]
}

export interface INews {
	id?: string
	tittle: string
	content: string
	organization_id?: string
	created_at?: string
}
