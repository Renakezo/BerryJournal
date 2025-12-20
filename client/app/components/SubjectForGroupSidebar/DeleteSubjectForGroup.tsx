'use client'

import { Button } from '@/app/BJComponents'
import { IDataForSubject } from '@/app/types/types'
import { serverAPI } from '@/app/utils/axios'
import { Dispatch } from 'react'
import { toast } from 'react-toastify'
import CreateSubjectForGroup from './CreateSubjecForGroup'

interface DeleteSubjectProps {
	id: string
	setSidebar: Dispatch<any>
	setUpdate: Dispatch<boolean>
	dataForSubject: IDataForSubject
	update: boolean
}

const DeleteSubjectForGroup = ({
	id,
	setSidebar,
	setUpdate,
	dataForSubject,
	update,
}: DeleteSubjectProps) => {
	const deleteSubject = () => {
		serverAPI
			.delete(`/admin/deleteSubjectForGroup/${id}`, {
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
			})
			.then(e => toast('Предмет удален!', { type: 'success' }))
		setSidebar(
			<CreateSubjectForGroup
				setUpdate={setUpdate}
				update={update}
				dataForSubject={dataForSubject}
				setSidebar={setSidebar}
			/>
		)
		setUpdate(!update)
	}

	return (
		<div className='flex flex-col items-center h-full'>
			<h3 className='text-[25px] mb-[30px] mx-[10px]'>Удаление предмета</h3>
			<div className='h-full '>
				<h3 className='text-[25px] mb-[30px] mx-[10px]'>
					Подтвердите удаление предмета у группы
				</h3>
				<Button
					width='max'
					variant='danger'
					onClick={deleteSubject}
					className='mb-[20px]'
				>
					Удалить
				</Button>
			</div>
		</div>
	)
}

export default DeleteSubjectForGroup
