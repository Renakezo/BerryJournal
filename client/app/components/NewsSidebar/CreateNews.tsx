'use client'

import { Button, Spinner } from '@/app/BJComponents'
import { INews } from '@/app/types/types'
import { serverAPI } from '@/app/utils/axios'
import MDEditor from '@uiw/react-md-editor'
import dynamic from 'next/dynamic'
import { Dispatch, useState } from 'react'
import { toast } from 'react-toastify'

const Select = dynamic(() => import('react-select'), { ssr: false })

interface CreateNewsProps {
	setUpdate: Dispatch<boolean>
	update: boolean
	setSidebar: Dispatch<any>
}

const CreateNews = ({ setUpdate, update, setSidebar }: CreateNewsProps) => {
	const [newsData, setNewsData] = useState<INews>({
		tittle: '',
		content: '',
	})

	const addNews = () => {
		if (newsData.tittle == '' || newsData.content == '') {
			return toast('Заполните все поля!', {
				type: 'error',
			})
		}
		serverAPI
			.post('/admin/addNews', newsData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			})
			.then(e => {
				toast('Новость добавлена', {
					type: 'success',
				})
				setSidebar(<Spinner />)
				setUpdate(!update)
			})
			.catch(e => {
				toast(e.response.data.error, {
					type: 'error',
				})
			})
	}

	return (
		<div className='flex flex-col items-center justify-between h-full'>
			<div className='flex flex-col items-center'>
				<h3 className='text-[25px] mb-[30px] mx-[10px]'>Добавление Новости</h3>
				<form
					onSubmit={e => {
						e.preventDefault()
						addNews()
					}}
					className='space-y-6'
				>
					<div className='w-full flex flex-col mb-[20px]'>
						<label htmlFor='' className='text-[20px] mb-[5px]'>
							Заголовок новости
						</label>
						<input
							type='text'
							maxLength={120}
							className='bg-white rounded-[10px] px-[15px] py-[8px] text-[18px] text-[#1B1A17]'
							onChange={e => {
								setNewsData({
									...newsData,
									tittle: e.currentTarget.value,
								})
							}}
						/>
					</div>

					<div
						className='border border-gray-300 rounded-lg overflow-hidden'
						data-color-mode='light'
					>
						<MDEditor
							value={newsData.content}
							onChange={e =>
								setNewsData({
									...newsData,
									content: e!,
								})
							}
							height={500}
							preview='edit'
							visibleDragbar={false}
							className='min-h-[500px]'
						/>
					</div>

					<div className='flex justify-end space-x-4'>
						<Button type='submit' width='max'>
							Сохранить новость
						</Button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default CreateNews
