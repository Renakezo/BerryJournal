'use client'

import { Button, Spinner } from '@/app/BJComponents'
import { IDataForSubject, IGroup, ISubject, IUser } from '@/app/types/types'
import { serverAPI } from '@/app/utils/axios'
import dynamic from 'next/dynamic'
import { Dispatch, useState } from 'react'
import { toast } from 'react-toastify'

const Select = dynamic(() => import('react-select'), { ssr: false })

interface CreateSubjectForGroupProps {
	setUpdate: Dispatch<boolean>
	update: boolean
	dataForSubject: IDataForSubject
	setSidebar: Dispatch<any>
}

const CreateSubjectForGroup = ({
	setUpdate,
	update,
	setSidebar,
	dataForSubject,
}: CreateSubjectForGroupProps) => {
	const [subjectData, setSubjectData] = useState<{
		group_id: string | null
		teacher_id: string | null
		subject_id: string | null
	}>({
		group_id: null,
		subject_id: null,
		teacher_id: null,
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

	const createSubjectForGroup = () => {
		if (
			subjectData?.group_id == null ||
			subjectData?.subject_id == null ||
			subjectData?.teacher_id == null
		) {
			return toast('Заполните все поля!', {
				type: 'error',
			})
		}
		serverAPI
			.post('/admin/addSubjectForGroup', subjectData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			})
			.then(e => {
				toast('Предмет для группы добавлен', {
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
				createSubjectForGroup()
			}}
			className='flex flex-col items-center justify-between h-full'
		>
			<div className='flex flex-col items-center'>
				<h3 className='text-[25px] mb-[30px] mx-[10px]'>
					Добавление предмета для группы
				</h3>
				<div className='w-full flex flex-col mb-[20px]'>
					{
						<>
							<label htmlFor='' className='text-[20px] mb-[5px]'>
								Группа
							</label>
							<Select
								styles={customStyles}
								placeholder='Группа...'
								defaultValue={{ value: null, label: 'Нет' }}
								onChange={(e: any) => {
									setSubjectData({ ...subjectData, group_id: e.value })
								}}
								noOptionsMessage={() => 'Нет подходящих групп'}
								options={[
									{ value: null, label: 'Нет' },
									...dataForSubject.groups.map((el: IGroup) => {
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
				<div className='w-full flex flex-col mb-[20px]'>
					{
						<>
							<label htmlFor='' className='text-[20px] mb-[5px]'>
								Предмет
							</label>
							<Select
								styles={customStyles}
								placeholder='Предмет...'
								defaultValue={{ value: null, label: 'Нет' }}
								onChange={(e: any) => {
									setSubjectData({ ...subjectData, subject_id: e.value })
								}}
								noOptionsMessage={() => 'Нет подходящих предметов'}
								options={[
									{ value: null, label: 'Нет' },
									...dataForSubject.subjects.map((el: ISubject) => {
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
				<div className='w-full flex flex-col mb-[20px]'>
					{
						<>
							<label htmlFor='' className='text-[20px] mb-[5px]'>
								Преподаватель
							</label>
							<Select
								styles={customStyles}
								placeholder='Преподаватель...'
								defaultValue={{ value: null, label: 'Нет' }}
								onChange={(e: any) => {
									setSubjectData({ ...subjectData, teacher_id: e.value })
								}}
								noOptionsMessage={() => 'Нет подходящих преподавателей'}
								options={[
									{ value: null, label: 'Нет' },
									...dataForSubject.teachers.map((el: IUser) => {
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
			</div>
			<Button width='max' type='submit'>
				Сохранить
			</Button>
		</form>
	)
}

export default CreateSubjectForGroup
