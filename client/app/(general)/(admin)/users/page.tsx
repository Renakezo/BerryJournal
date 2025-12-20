'use client'

import { Button, Skeleton, Spinner } from '@/app/BJComponents'
import CreateUser from '@/app/components/UsersSidebar/CreateUser'
import DeleteUser from '@/app/components/UsersSidebar/DeleteUser'
import UpdateUser from '@/app/components/UsersSidebar/UpdateUser'
import { useDebounce } from '@/app/hooks/useDebaunce'
import { serverAPI } from '@/app/utils/axios'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function Users() {
	const [usersData, setUsersData] = useState<any>()
	const [groupsData, setGroupsData] = useState<any>()
	const [update, setUpdate] = useState<boolean>(false)
	const [searchData, setSearchData] = useState<{
		search: string
		role: null | string
		isreg: null | string
	}>({
		search: '',
		role: null,
		isreg: null,
	})
	const debouncedSearch = useDebounce(searchData.search, 500)
	const [sidebar, setSidebar] = useState<any>(<Spinner />)

	const getUserData = () => {
		const usersParams = new URLSearchParams()
		searchData.isreg != null && usersParams.set('isreg', searchData.isreg)
		searchData.role != null && usersParams.set('role', searchData.role)
		searchData.search != '' && usersParams.set('search', searchData.search)
		serverAPI
			.get('/admin/getAllUsers?' + usersParams.toString(), {
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
			})
			.then(e => {
				setUsersData(e.data.message)
			})
	}

	useEffect(() => {
		serverAPI
			.get('/admin/getAllGroupsName', {
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
			})
			.then(e => {
				setGroupsData(e.data.message)
				setSidebar(
					<CreateUser
						setUpdate={setUpdate}
						update={update}
						groups={e.data.message}
						setSidebar={setSidebar}
					/>
				)
			})
		getUserData()
	}, [update])

	useEffect(() => {
		getUserData()
	}, [searchData.isreg, searchData.role, debouncedSearch])

	return (
		<>
			<div className='flex justify-between pb-[30px]'>
				<h2 className='text-[32px]'>Пользователи</h2>
				<Button
					size='m'
					onClick={() =>
						setSidebar(
							<CreateUser
								setUpdate={setUpdate}
								update={update}
								groups={groupsData}
								setSidebar={setSidebar}
							/>
						)
					}
				>
					Добавить пользователя
				</Button>
			</div>
			<div className='w-full h-full max-h-full flex flex-col bg-[#232523] overflow-auto rounded-[10px]'>
				<div className='w-full px-[35px] py-[25px] border-b-[3px] border-[#1b1a17] flex gap-[30px] text-[18px]'>
					<input
						type='text'
						placeholder='Поиск'
						onChange={e => {
							setSearchData({ ...searchData, search: e.currentTarget.value })
						}}
						className='bg-white rounded-[10px] px-[15px] py-[8px] text-[#1B1A17]'
					/>
					<label>
						<select
							className='bg-white rounded-[10px] px-[15px] py-[8px] text-[#1B1A17]'
							onChange={e => {
								setSearchData({
									...searchData,
									role:
										e.currentTarget.value == 'null'
											? null
											: e.currentTarget.value,
								})
							}}
						>
							<option value='null'>Роль</option>
							<option value='4'>Студент</option>
							<option value='3'>Преподаватель</option>
							<option value='2'>Администратор</option>
						</select>
					</label>
					<label>
						<select
							className='bg-white rounded-[10px] px-[15px] py-[8px] text-[#1B1A17]'
							onChange={e => {
								setSearchData({
									...searchData,
									isreg:
										e.currentTarget.value == 'null'
											? null
											: e.currentTarget.value,
								})
							}}
						>
							<option value='null'>Статус регистрации</option>
							<option value='1'>Зарегестрирован</option>
							<option value='0'>Незарегистрирован</option>
						</select>
					</label>
				</div>
				<div className='w-full h-full flex overflow-auto'>
					<div className='min-h-full w-5/8 border-r-[3px] border-[#1b1a17] overflow-auto'>
						<div className='flex flex-col gap-[15px] p-[35px] min-h-full'>
							{usersData ? (
								usersData.map((el: any) => {
									return (
										<div
											key={el.id}
											className='w-full p-[20px] flex bg-[#1b1a17] rounded-[10px] gap-[10px]'
										>
											<Image
												src={'/icons/avatar.svg'}
												alt=''
												width={40}
												height={40}
												className='h-[100px] w-[100px]'
											/>
											<div className='flex flex-col justify-between w-full'>
												<div className='text-[20px] flex'>
													{`${el.surname} ${el.name} ${
														el.patronymic != null ? el.patronymic : ''
													}`}
													{!el.isRegister && (
														<Image
															src={'/icons/warning.svg'}
															alt='Незарегистрирован'
															title='Незарегистрирован'
															width={24}
															height={21}
															className='ml-[5px]'
														/>
													)}
												</div>
												<p className='text-[18px]'>{el.role.name}</p>
												<p className='text-[18px]'>
													{el.group_id && 'Группа: ' + el.group.name}
												</p>
											</div>
											<div className='flex justify-end items-end gap-[15px]'>
												<Button
													size='s'
													onClick={() =>
														setSidebar(
															<UpdateUser
																id={el.id}
																setSidebar={setSidebar}
																setUpdate={setUpdate}
																update={update}
																groups={groupsData}
															/>
														)
													}
												>
													Редактировать
												</Button>
												<Button
													size='s'
													variant='danger'
													onClick={() =>
														setSidebar(
															<DeleteUser
																id={el.id}
																setSidebar={setSidebar}
																setUpdate={setUpdate}
																update={update}
																groups={groupsData}
															/>
														)
													}
												>
													Удалить
												</Button>
											</div>
										</div>
									)
								})
							) : (
								<>
									<Skeleton className='w-full h-[140px] p-[20px] flex bg-[#1b1a17] rounded-[10px] gap-[10px]' />
									<Skeleton className='w-full h-[140px] p-[20px] flex bg-[#1b1a17] rounded-[10px] gap-[10px]' />
								</>
							)}
						</div>
					</div>
					<div className='h-full w-3/8 flex flex-col items-center overflow-auto p-[35px]'>
						{sidebar}
					</div>
				</div>
			</div>
		</>
	)
}
