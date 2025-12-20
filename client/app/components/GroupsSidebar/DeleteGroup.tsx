'use client'

import { Button } from '@/app/BJComponents'
import { ISpeciality, IUser } from '@/app/types/types'
import { serverAPI } from '@/app/utils/axios'
import { Dispatch } from 'react'
import { toast } from 'react-toastify'
import CreateGroup from './CreateGroup'

interface DeleteGroupProps {
	id: string
	setSidebar: Dispatch<any>
	setUpdate: Dispatch<boolean>
	update: boolean
	specialities: ISpeciality[]
	teachers: IUser[]
}

const DeleteGroup = ({
	id,
	setSidebar,
	setUpdate,
	update,
	specialities,
	teachers,
}: DeleteGroupProps) => {
	const deleteGroup = () => {
		serverAPI
			.delete(`/admin/deleteGroup/${id}`, {
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
			})
			.then(e => toast('Группа удалена!', { type: 'success' }))
		setSidebar(
			<CreateGroup
				setUpdate={setUpdate}
				update={update}
				specialities={specialities}
				teachers={teachers}
				setSidebar={setSidebar}
			/>
		)
		setUpdate(!update)
	}

	const customStyles = {
		control: (provided: any) => ({
			...provided,
			backgroundColor: 'white',
			borderRadius: '10px',
			padding: '2px',
			boxShadow: 'none',
			border: '1px solid #ccc',
			'&:hover': {
				border: '1px solid #aaa',
			},
		}),
		menu: (provided: any) => ({
			...provided,
			marginTop: '5px',
		}),
		option: (provided: any, state: any) => ({
			...provided,
			color: '#1B1A17',
			padding: '10px',
			backgroundColor: state.isFocused ? '#f0f0f0' : 'white',
		}),
		singleValue: (provided: any) => ({
			...provided,
			color: '#1B1A17',
			fontSize: '18px',
		}),
	}

	return (
		<div className='flex flex-col items-center h-full'>
			<h3 className='text-[25px] mb-[30px] mx-[10px]'>Удаление группы</h3>
			<div className='h-full '>
				<h3 className='text-[25px] mb-[30px] mx-[10px]'>
					Подтвердите удаление группы
				</h3>
				<Button
					width='max'
					variant='danger'
					onClick={deleteGroup}
					className='mb-[20px]'
				>
					Удалить
				</Button>
			</div>
		</div>
	)
}

export default DeleteGroup
