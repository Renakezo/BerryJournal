'use client'

import { Button, Spinner } from '@/app/BJComponents'
import { IGroup, IUser } from '@/app/types/types'
import { serverAPI } from '@/app/utils/axios'
import dynamic from 'next/dynamic'
import { Dispatch, useState } from 'react'
import { toast } from 'react-toastify'

const Select = dynamic(() => import('react-select'), { ssr: false })

interface CreateUserProps {
	setUpdate: Dispatch<boolean>
	update: boolean
	groups: IGroup[]
	setSidebar: Dispatch<any>
}

const CreateUser = ({
	setUpdate,
	update,
	groups,
	setSidebar,
}: CreateUserProps) => {
	const [userData, setUserData] = useState<IUser>({
		name: '',
		surname: '',
		patronymic: null,
		email: '',
		birthday: null,
		role_id: 4,
		group_id: null,
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

	const createUser = () => {
		if (userData.name == '' || userData.surname == '' || userData.email == '') {
			return toast('Заполните все поля!', {
				type: 'error',
			})
		}
		userData.patronymic == '' && setUserData({ ...userData, patronymic: null })
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
			return toast('Email должен быть валидным!', {
				type: 'error',
			})
		}
		serverAPI
			.post('/admin/addUser', userData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			})
			.then(e => {
				toast('Пользователь добавлен', {
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
				createUser()
			}}
			className='flex flex-col items-center justify-between h-full'
		>
			<div className='flex flex-col items-center'>
				<h3 className='text-[25px] mb-[30px] mx-[10px]'>
					Добавление пользователя
				</h3>
				<div className='w-full flex flex-col mb-[20px]'>
					<label htmlFor='' className='text-[20px] mb-[5px]'>
						ФИО
					</label>
					<input
						type='text'
						onChange={e => {
							let arrayData = e.currentTarget.value.split(' ')
							setUserData({
								...userData,
								surname: arrayData[0],
								name: arrayData[1],
								patronymic: arrayData[2],
							})
						}}
						className='bg-white rounded-[10px] px-[15px] py-[8px] text-[18px] text-[#1B1A17]'
					/>
				</div>
				<div className='w-full flex flex-col mb-[20px]'>
					<label htmlFor='' className='text-[20px] mb-[5px]'>
						Email
					</label>
					<input
						type='text'
						onChange={e => {
							setUserData({ ...userData, email: e.currentTarget.value })
						}}
						className='bg-white rounded-[10px] px-[15px] py-[8px] text-[18px] text-[#1B1A17]'
					/>
				</div>
				{/* <div className='w-full flex flex-col mb-[20px]'>
					<label htmlFor='' className='text-[20px] mb-[5px]'>
						Дата рождения
					</label>
					<input
						type='date'
						className='bg-white rounded-[10px] px-[15px] py-[8px] text-[18px] text-[#1B1A17]'
					/>
				</div> */}
				<div className='w-full flex flex-col mb-[20px]'>
					<label htmlFor='' className='text-[20px] mb-[5px]'>
						Роль
					</label>
					<Select
						isSearchable={false}
						placeholder='Роль...'
						defaultValue={{ value: '3', label: 'Студент' }}
						onChange={(e: any) => {
							setUserData({ ...userData, role_id: e.value })
						}}
						styles={customStyles}
						options={[
							{ value: '4', label: 'Студент' },
							{ value: '3', label: 'Преподаватель' },
							{ value: '2', label: 'Администратор' },
						]}
					/>
				</div>
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
									setUserData({ ...userData, group_id: e.value })
								}}
								noOptionsMessage={() => 'Нет подходящих групп'}
								options={[
									{ value: null, label: 'Нет' },
									...groups.map((el: any) => {
										return { value: el.id, label: el.name }
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

export default CreateUser
