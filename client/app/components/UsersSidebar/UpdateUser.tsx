'use client'

import { Button, Spinner } from '@/app/BJComponents'
import { IGroup, IUser } from '@/app/types/types'
import { serverAPI } from '@/app/utils/axios'
import dynamic from 'next/dynamic'
import { Dispatch, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import CreateUser from './CreateUser'

const Select = dynamic(() => import('react-select'), { ssr: false })

interface UpdateUserProps {
	id: string
	setSidebar?: Dispatch<any>
	setUpdate: Dispatch<boolean>
	update: boolean
	groups: IGroup[]
}

const UpdateUser = ({
	id,
	setSidebar,
	setUpdate,
	update,
	groups,
}: UpdateUserProps) => {
	const [userData, setUserData] = useState<IUser | null>()

	const getUserData = () => {
		serverAPI
			.get(`/admin/getUserById/${id}`, {
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
			})
			.then((e: any) => {
				setUserData(e.data.message)
			})
	}

	const updateData = () => {
		setUpdate(!update)
		setSidebar &&
			setSidebar(
				<CreateUser
					setUpdate={setUpdate}
					update={update}
					groups={groups}
					setSidebar={setSidebar}
				/>
			)
	}

	useEffect(() => {
		setUserData(null)
		getUserData()
	}, [id])

	const updateUser = () => {
		if (userData!.name == '' || userData!.surname == '') {
			return toast('Заполните все поля!', {
				type: 'error',
			})
		}
		userData!.patronymic == '' &&
			setUserData({ ...userData!, patronymic: null })

		serverAPI
			.put('/admin/updateUser', userData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			})
			.then(e => {
				toast('Пользователь обновлен', {
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

	const sendConfirmation = () => {
		serverAPI
			.get(`/admin/sendConfirmation/${id}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			})
			.then(e => {
				toast(e.data.message, {
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
				updateUser()
			}}
		>
			{userData ? (
				<>
					<div className='flex flex-col items-center'>
						<h3 className='text-[25px] mb-[30px] mx-[10px]'>
							Редактирование пользователя
						</h3>
						<div className='w-full flex flex-col mb-[20px]'>
							<label htmlFor='' className='text-[20px] mb-[5px]'>
								ФИО
							</label>
							<input
								type='text'
								className='bg-white rounded-[10px] px-[15px] py-[8px] text-[18px] text-[#1B1A17]'
								onChange={e => {
									let arrayData = e.currentTarget.value.split(' ')
									setUserData({
										...userData,
										surname: arrayData[0],
										name: arrayData[1],
										patronymic: arrayData[2],
									})
								}}
								defaultValue={`${userData.surname} ${userData.name} ${
									userData.patronymic != null ? userData.patronymic : ''
								}`}
							/>
						</div>
						<div className='w-full flex flex-col mb-[20px]'>
							<label htmlFor='' className='text-[20px] mb-[5px]'>
								Роль
							</label>
							<Select
								isSearchable={false}
								placeholder='Роль...'
								styles={customStyles}
								options={[
									{ value: '4', label: 'Студент' },
									{ value: '3', label: 'Преподаватель' },
									{ value: '2', label: 'Администратор' },
								]}
								defaultValue={{
									value: userData.role!.id,
									label: userData.role!.name,
								}}
								isDisabled
							/>
						</div>
						{userData.role_id == 4 && (
							<div className='w-full flex flex-col mb-[20px]'>
								<label htmlFor='' className='text-[20px] mb-[5px]'>
									Группа
								</label>

								<Select
									styles={customStyles}
									placeholder='Группа...'
									noOptionsMessage={() => 'Нет подходящих групп'}
									defaultValue={
										userData.group == null
											? { value: null, label: 'Нет' }
											: { value: userData.group.id, label: userData.group.name }
									}
									onChange={(e: any) => {
										setUserData({ ...userData, group_id: e.value })
									}}
									options={[
										{ value: null, label: 'Нет' },
										...groups.map((el: any) => {
											return { value: el.id, label: el.name }
										}),
									]}
								/>
							</div>
						)}
					</div>
					<div className='w-full'>
						{userData.isRegister == false && (
							<Button
								onClick={sendConfirmation}
								width='max'
								variant='danger'
								className='mb-[20px]'
							>
								Отправить приглашение
							</Button>
						)}
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

export default UpdateUser
