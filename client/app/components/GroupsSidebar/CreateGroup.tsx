'use client'

import { Button, Spinner } from '@/app/BJComponents'
import { IGroup, ISpeciality, IUser } from '@/app/types/types'
import { serverAPI } from '@/app/utils/axios'
import dynamic from 'next/dynamic'
import { Dispatch, useState } from 'react'
import { toast } from 'react-toastify'

const Select = dynamic(() => import('react-select'), { ssr: false })

interface CreateGroupProps {
	setUpdate: Dispatch<boolean>
	update: boolean
	specialities: ISpeciality[]
	teachers: IUser[]
	setSidebar: Dispatch<any>
}

const CreateGroup = ({
	setUpdate,
	update,
	setSidebar,
	specialities,
	teachers,
}: CreateGroupProps) => {
	const [groupData, setGroupData] = useState<IGroup>({
		name: '',
		course: 1,
		speciality_id: null,
		classroomTeacher_id: null,
		admission_date: '',
	})

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

	const createGroup = () => {
		if (groupData.name == '' || groupData.course == '') {
			return toast('Заполните все поля!', {
				type: 'error',
			})
		}
		serverAPI
			.post('/admin/addGroup', groupData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			})
			.then(e => {
				toast('Группа добавлена', {
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
		<form
			onSubmit={e => {
				e.preventDefault()
				createGroup()
			}}
			className='flex flex-col items-center justify-between h-full'
		>
			<div className='flex flex-col items-center'>
				<h3 className='text-[25px] mb-[30px] mx-[10px]'>Добавление группы</h3>
				<div className='w-full flex flex-col mb-[20px]'>
					<label htmlFor='' className='text-[20px] mb-[5px]'>
						Наименование
					</label>
					<input
						type='text'
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
						defaultValue={1}
						onChange={e => {
							;+e.currentTarget.value <= 0 || +e.currentTarget.value > 5
								? setGroupData({ ...groupData, course: 1 })
								: setGroupData({ ...groupData, course: +e.currentTarget.value })
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
								defaultValue={{ value: null, label: 'Нет' }}
								onChange={(e: any) => {
									setGroupData({ ...groupData, classroomTeacher_id: e.value })
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
								defaultValue={{ value: null, label: 'Нет' }}
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
			<Button width='max' type='submit'>
				Сохранить
			</Button>
		</form>
	)
}

export default CreateGroup
