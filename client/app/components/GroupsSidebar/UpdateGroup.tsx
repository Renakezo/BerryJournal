'use client'

import { Button, Spinner } from '@/app/BJComponents'
import { IGroup, ISpeciality, IUser } from '@/app/types/types'
import { serverAPI } from '@/app/utils/axios'
import dynamic from 'next/dynamic'
import { Dispatch, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import CreateGroup from './CreateGroup'

const Select = dynamic(() => import('react-select'), { ssr: false })

interface UpdateGroupProps {
	id: string
	setSidebar: Dispatch<any>
	setUpdate: Dispatch<boolean>
	update: boolean
	specialities: ISpeciality[]
	teachers: IUser[]
}

const UpdateGroup = ({
	id,
	setSidebar,
	setUpdate,
	update,
	specialities,
	teachers,
}: UpdateGroupProps) => {
	const [groupData, setGroupData] = useState<IGroup | null>()

	useEffect(() => {
		setGroupData(null)
		getGroupData()
	}, [id])

	const getGroupData = () => {
		serverAPI
			.get(`/admin/getGroupById/${id}`, {
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
			})
			.then((e: any) => {
				setGroupData(e.data.message)
			})
	}

	const updateGroup = () => {
		if (groupData!.name == '' || groupData!.course == '') {
			return toast('Заполните все поля!', {
				type: 'error',
			})
		}
		serverAPI
			.put('/admin/updateGroup', groupData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			})
			.then(e => {
				toast('Группа обновлена', {
					type: 'success',
				})
				setUpdate(!update)
				setSidebar(
					<CreateGroup
						setUpdate={setUpdate}
						update={update}
						specialities={specialities}
						teachers={teachers}
						setSidebar={setSidebar}
					/>
				)
			})
			.catch(e => {
				toast(e.response.data, {
					type: 'error',
				})
			})
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
		<form
			className='flex flex-col items-center justify-between h-full'
			onSubmit={e => {
				e.preventDefault()
				updateGroup()
			}}
		>
			{groupData ? (
				<>
					<div className='flex flex-col items-center'>
						<h3 className='text-[25px] mb-[30px] mx-[10px]'>
							Редактирование группы
						</h3>
						<div className='w-full flex flex-col mb-[20px]'>
							<label htmlFor='' className='text-[20px] mb-[5px]'>
								Наименование
							</label>
							<input
								type='text'
								defaultValue={groupData.name}
								onChange={e => {
									setGroupData({
										...groupData,
										name: e.currentTarget.value,
									})
								}}
								className='bg-white rounded-[10px] px-[15px] py-[8px] text-[18px] text-[#1B1A17]'
							/>
						</div>
						<div className='w-full flex flex-col mb-[20px]'>
							<label htmlFor='' className='text-[20px] mb-[5px]'>
								Курс
							</label>
							<input
								type='number'
								defaultValue={groupData.course}
								onChange={e => {
									;+e.currentTarget.value <= 0 || +e.currentTarget.value > 5
										? setGroupData({ ...groupData, course: 1 })
										: setGroupData({
												...groupData,
												course: +e.currentTarget.value,
										  })
								}}
								onBlur={e => {
									;+e.currentTarget.value <= 0 || +e.currentTarget.value > 5
										? (e.currentTarget.value = '1')
										: ''
								}}
								className='bg-white rounded-[10px] px-[15px] py-[8px] text-[18px] text-[#1B1A17]'
							/>
						</div>
						<div className='w-full flex flex-col mb-[20px]'>
							{
								<>
									<label htmlFor='' className='text-[20px] mb-[5px]'>
										Классный руководитель
									</label>
									<Select
										styles={customStyles}
										placeholder='Классный руководитель...'
										defaultValue={
											groupData.classroomTeacher_id == null
												? { value: null, label: 'Нет' }
												: {
														value: groupData.classroomTeacher_id,
														label: `${groupData.classroom_teacher!.surname} ${
															groupData.classroom_teacher!.name
														} ${
															groupData.classroom_teacher!.patronymic
																? groupData.classroom_teacher!.patronymic
																: ''
														}`,
												  }
										}
										onChange={(e: any) => {
											setGroupData({
												...groupData,
												classroomTeacher_id: e.value,
												classroom_teacher: e.label[0],
											})
										}}
										noOptionsMessage={() => 'Нет подходящих преподавателей'}
										options={[
											{ value: null, label: 'Нет' },
											...teachers.map((el: IUser) => {
												return {
													value: el.id,
													label: `${el.surname} ${el.name} ${
														el.patronymic ? el.patronymic : ''
													}`,
												}
											}),
										]}
									/>
								</>
							}
						</div>
						<div className='w-full flex flex-col mb-[20px]'>
							{
								<>
									<label htmlFor='' className='text-[20px] mb-[5px]'>
										Специальность
									</label>
									<Select
										styles={customStyles}
										placeholder='Специальность...'
										defaultValue={{
											value: groupData.speciality_id,
											label: groupData.speciality?.name,
										}}
										onChange={(e: any) => {
											setGroupData({ ...groupData, speciality_id: e.value })
										}}
										noOptionsMessage={() => 'Нет подходящих специальностей'}
										options={[
											{ value: null, label: 'Нет' },
											...specialities.map((el: ISpeciality) => {
												return {
													value: el.id,
													label: `${el.name}`,
												}
											}),
										]}
									/>
								</>
							}
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

export default UpdateGroup
