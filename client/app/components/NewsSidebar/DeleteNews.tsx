'use client'

import { Button } from '@/app/BJComponents'
import { serverAPI } from '@/app/utils/axios'
import { Dispatch } from 'react'
import { toast } from 'react-toastify'
import CreateNews from './CreateNews'

interface DeleteNewsProps {
	id: string
	setSidebar: Dispatch<any>
	setUpdate: Dispatch<boolean>
	update: boolean
}

const DeleteNews = ({ id, setSidebar, setUpdate, update }: DeleteNewsProps) => {
	const deleteNews = () => {
		serverAPI
			.delete(`/admin/deleteNews/${id}`, {
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
			})
			.then(e => toast('Новость удалена!', { type: 'success' }))
		setSidebar(
			<CreateNews
				setUpdate={setUpdate}
				update={update}
				setSidebar={setSidebar}
			/>
		)
		setUpdate(!update)
	}

	return (
		<div className='flex flex-col items-center h-full'>
			<h3 className='text-[25px] mb-[30px] mx-[10px]'>Удаление новости</h3>
			<div className='h-full '>
				<h3 className='text-[25px] mb-[30px] mx-[10px]'>
					Подтвердите удаление новости
				</h3>
				<Button
					width='max'
					variant='danger'
					onClick={deleteNews}
					className='mb-[20px]'
				>
					Удалить
				</Button>
			</div>
		</div>
	)
}

export default DeleteNews
