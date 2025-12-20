'use client'

import { Button, Spinner } from '@/app/BJComponents'
import { INews } from '@/app/types/types'
import { serverAPI } from '@/app/utils/axios'
import MDEditor from '@uiw/react-md-editor'
import dynamic from 'next/dynamic'
import { Dispatch, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const Select = dynamic(() => import('react-select'), { ssr: false })

interface UpdateNewsProps {
	id: string
	setSidebar?: Dispatch<any>
	setUpdate: Dispatch<boolean>
	update: boolean
}

const UpdateNews = ({ id, setSidebar, setUpdate, update }: UpdateNewsProps) => {
	const [newsData, setNewsData] = useState<INews>({
		tittle: '',
		content: '',
	})

	const getNewsData = () => {
		serverAPI
			.get(`/getNews/${id}`, {
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
			})
			.then((e: any) => {
				setNewsData(e.data.message)
			})
	}

	useEffect(() => {
		setNewsData({
			tittle: '',
			content: '',
		})
		getNewsData()
	}, [id])

	const updateNews = () => {
		if (newsData!.tittle == '' || newsData!.content == '') {
			return toast('Заполните все поля!', {
				type: 'error',
			})
		}
		serverAPI
			.put('/admin/updateNews', newsData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			})
			.then(e => {
				toast('Новость обновлена', {
					type: 'success',
				})
				setUpdate(!update)
			})
			.catch(e => {
				toast(e.response.data, {
					type: 'error',
				})
			})
	}

	return (
		<div className='flex flex-col items-center justify-between h-full'>
			{newsData ? (
				<div>
					<div className='flex flex-col items-center'>
						<h3 className='text-[25px] mb-[30px] mx-[10px]'>
							Редактирование новости
						</h3>
						<form
							onSubmit={e => {
								e.preventDefault()
								updateNews()
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
									defaultValue={newsData.tittle}
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
			) : (
				<Spinner />
			)}
		</div>
	)
}

export default UpdateNews
