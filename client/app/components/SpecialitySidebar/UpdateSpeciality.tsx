'use client'

import { Button, Spinner } from '@/app/BJComponents'
import { IUser } from '@/app/types/types'
import { serverAPI } from '@/app/utils/axios'
import dynamic from 'next/dynamic'
import { Dispatch, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import CreateSpeciality from './CreateSpeciality'

const Select = dynamic(() => import('react-select'), { ssr: false })

interface UpdateSpecialityProps {
	id: string
	setSidebar?: Dispatch<any>
	setUpdate: Dispatch<boolean>
	update: boolean
}

const UpdateSpeciality = ({
	id,
	setSidebar,
	setUpdate,
	update,
}: UpdateSpecialityProps) => {
	const [specialityData, setSpecialityData] = useState<IUser | null>()

	const getSpecialityData = () => {
		serverAPI
			.get(`/admin/getSpecialityById/${id}`, {
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
			})
			.then((e: any) => {
				setSpecialityData(e.data.message)
			})
	}

	const updateData = () => {
		setUpdate(!update)
		setSidebar &&
			setSidebar(
				<CreateSpeciality
					setUpdate={setUpdate}
					update={update}
					setSidebar={setSidebar}
				/>
			)
	}

	useEffect(() => {
		setSpecialityData(null)
		getSpecialityData()
	}, [id])

	const updateUser = () => {
		if (specialityData!.name == '') {
			return toast('Заполните все поля!', {
				type: 'error',
			})
		}
		specialityData!.patronymic == '' &&
			setSpecialityData({ ...specialityData!, patronymic: null })

		serverAPI
			.put('/admin/updateSpeciality', specialityData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			})
			.then(e => {
				toast('Наименование специальности обновлено', {
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
				updateUser()
			}}
		>
			{specialityData ? (
				<>
					<div className='flex flex-col items-center'>
						<h3 className='text-[25px] mb-[30px] mx-[10px]'>
							Редактирование специальности
						</h3>
						<div className='w-full flex flex-col mb-[20px]'>
							<label htmlFor='' className='text-[20px] mb-[5px]'>
								Наименование
							</label>
							<input
								type='text'
								className='bg-white rounded-[10px] px-[15px] py-[8px] text-[18px] text-[#1B1A17]'
								onChange={e => {
									setSpecialityData({
										...specialityData,
										name: e.currentTarget.value,
									})
								}}
								defaultValue={specialityData.name}
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

export default UpdateSpeciality
