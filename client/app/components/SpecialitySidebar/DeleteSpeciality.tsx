'use client'

import { Button } from '@/app/BJComponents'
import { serverAPI } from '@/app/utils/axios'
import { Dispatch } from 'react'
import { toast } from 'react-toastify'
import CreateSpeciality from './CreateSpeciality'

interface DeleteSpecialityProps {
	id: string
	setSidebar: Dispatch<any>
	setUpdate: Dispatch<boolean>
	update: boolean
}

const DeleteSpeciality = ({
	id,
	setSidebar,
	setUpdate,
	update,
}: DeleteSpecialityProps) => {
	const deleteSpeciality = () => {
		serverAPI
			.delete(`/admin/deleteSpeciality/${id}`, {
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
			})
			.then(e => toast('Специальность удалена!', { type: 'success' }))
		setSidebar(
			<CreateSpeciality
				setUpdate={setUpdate}
				update={update}
				setSidebar={setSidebar}
			/>
		)
		setUpdate(!update)
	}

	return (
		<div className='flex flex-col items-center h-full'>
			<h3 className='text-[25px] mb-[30px] mx-[10px]'>
				Удаление специальности
			</h3>
			<div className='h-full '>
				<h3 className='text-[25px] mb-[30px] mx-[10px]'>
					Подтвердите удаление специальности
				</h3>
				<Button
					width='max'
					variant='danger'
					onClick={deleteSpeciality}
					className='mb-[20px]'
				>
					Удалить
				</Button>
			</div>
		</div>
	)
}

export default DeleteSpeciality
