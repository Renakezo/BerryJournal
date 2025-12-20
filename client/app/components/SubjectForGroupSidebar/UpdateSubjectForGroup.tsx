'use client'

import { Button, Spinner } from '@/app/BJComponents'
import { IDataForSubject, IUser } from '@/app/types/types'
import { serverAPI } from '@/app/utils/axios'
import dynamic from 'next/dynamic'
import { Dispatch, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import CreateSubjectForGroup from './CreateSubjecForGroup'

const Select = dynamic(() => import('react-select'), { ssr: false })

interface UpdateSubjectProps {
	id: string
	setSidebar?: Dispatch<any>
	setUpdate: Dispatch<boolean>
	dataForSubject: IDataForSubject
	update: boolean
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

const UpdateSubjectForGroup = ({
	id,
	setSidebar,
	setUpdate,
	update,
	dataForSubject,
}: UpdateSubjectProps) => {
	const [subjectData, setSubjectData] = useState<{
		group_id: string | null
		teacher_id: string | null
		subject_id: string | null
	} | null>()

	const getSubjectData = () => {
		serverAPI
			.get(`/admin/getSubjectForGroupById/${id}`, {
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
				<CreateSubjectForGroup
					setUpdate={setUpdate}
					update={update}
					dataForSubject={dataForSubject}
					setSidebar={setSidebar}
				/>
			)
	}

	useEffect(() => {
		setSubjectData(null)
		getSubjectData()
	}, [id])

	const updateSubject = () => {
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
			.put('/admin/updateSubjectForGroup', subjectData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			})
			.then(e => {
				toast('Преподаватель для предмета обновлен', {
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
							{
								<>
									<label htmlFor='' className='text-[20px] mb-[5px]'>
										Преподаватель
									</label>
									<Select
										styles={customStyles}
										placeholder='Преподаватель...'
										defaultValue={{
											value: subjectData.teacher_id,
											label: `${
												dataForSubject.teachers.find(
													x => x.id == subjectData.teacher_id
												)?.surname
											} ${
												dataForSubject.teachers.find(
													x => x.id == subjectData.teacher_id
												)?.name
											} ${
												dataForSubject.teachers.find(
													x => x.id == subjectData.teacher_id
												)?.patronymic
													? dataForSubject.teachers.find(
															x => x.id == subjectData.teacher_id
													  )?.patronymic
													: ''
											}`,
										}}
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

export default UpdateSubjectForGroup
