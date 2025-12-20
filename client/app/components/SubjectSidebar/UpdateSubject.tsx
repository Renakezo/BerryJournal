'use client'

import { Button, Spinner } from '@/app/BJComponents'
import { IUser } from '@/app/types/types'
import { serverAPI } from '@/app/utils/axios'
import dynamic from 'next/dynamic'
import { Dispatch, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import CreateSubject from './CreateSubject'

const Select = dynamic(() => import('react-select'), { ssr: false })

interface UpdateSubjectProps {
	id: string
	setSidebar?: Dispatch<any>
	setUpdate: Dispatch<boolean>
	update: boolean
}

const UpdateSubject = ({
	id,
	setSidebar,
	setUpdate,
	update,
}: UpdateSubjectProps) => {
	const [subjectData, setSubjectData] = useState<IUser | null>()

	const getSubjectData = () => {
		serverAPI
			.get(`/admin/getSubjectById/${id}`, {
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
			})
			.then((e: any) => {
				setSubjectData(e.data.message)
			})
	}

	const updateData = () => {
		setUpdate(!update)
		setSidebar &&
			setSidebar(
				<CreateSubject
					setUpdate={setUpdate}
					update={update}
					setSidebar={setSidebar}
				/>
			)
	}

	useEffect(() => {
		setSubjectData(null)
		getSubjectData()
	}, [id])

	const updateSubject = () => {
		if (subjectData!.name == '') {
			return toast('Заполните все поля!', {
				type: 'error',
			})
		}
		serverAPI
			.put('/admin/updateSubject', subjectData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			})
			.then(e => {
				toast('Наименование предмета обновлено', {
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
		<form
			className='flex flex-col items-center justify-between h-full'
			onSubmit={e => {
				e.preventDefault()
				updateSubject()
			}}
		>
			{subjectData ? (
				<>
					<div className='flex flex-col items-center'>
						<h3 className='text-[25px] mb-[30px] mx-[10px]'>
							Редактирование предмета
						</h3>
						<div className='w-full flex flex-col mb-[20px]'>
							<label htmlFor='' className='text-[20px] mb-[5px]'>
								Наименование
							</label>
							<input
								type='text'
								className='bg-white rounded-[10px] px-[15px] py-[8px] text-[18px] text-[#1B1A17]'
								onChange={e => {
									setSubjectData({
										...subjectData,
										name: e.currentTarget.value,
									})
								}}
								defaultValue={subjectData.name}
							/>
						</div>
					</div>
					<div className='w-full'>
						<Button width='max' type='submit'>
							Сохранить
						</Button>
					</div>
				</>
			) : (
				<Spinner />
			)}
		</form>
	)
}

export default UpdateSubject
