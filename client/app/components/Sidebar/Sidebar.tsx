'use client'

import {
	Button,
	FooterItem,
	MenuItem,
	Modal,
	SideBar,
	Skeleton,
} from '@/app/BJComponents'
import { initializeCSRF, serverAPI } from '@/app/utils/axios'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const Sidebar = () => {
	const [userData, setUserData] = useState<any>()
	const [isOpenSupportModal, setIsOpenSupportModal] = useState<boolean>(false)
	const [supportData, setSupportData] = useState<any>({
		description: '',
		contacts: '',
		user_id: '',
	})
	const router = useRouter()
	const path = usePathname()

	const getUserData = async () => {
		serverAPI
			.get('/getUser', {
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
			})
			.then(e => {
				setSupportData({ ...supportData, user_id: e.data.message.id })
				setUserData(e.data.message)
			})
			.catch(e => {
				if (e.response.status == 401) {
					localStorage.removeItem('token')
					router.push('/')
				}
			})
	}

	const supportFetch = async () => {
		if (supportData.description == '' || supportData.contacts == '') {
			return toast('Не все поля заполнены', {
				type: 'error',
			})
		}
		serverAPI
			.post('/support/addApplication', supportData, {
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
			})
			.then(e => {
				toast('Заявка отправлена', {
					type: 'success',
				})
			})
	}

	const logout = async () => {
		serverAPI.get('/logout', {
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('token'),
			},
		})
		localStorage.removeItem('token')
		router.push('/')
	}

	useEffect(() => {
		initializeCSRF()
		getUserData()
	}, [])

	const studentMenuItems = [
		<MenuItem
			title='Главная'
			logo='/icons/main.svg'
			onClick={() => router.push('/main')}
			isActive={path === '/main'}
		/>,
		<MenuItem
			title='Успеваемость'
			logo='/icons/grade.svg'
			onClick={() => router.push('/grade')}
			isActive={path.split('/')[1] == 'grade'}
		/>,
		// <MenuItem
		// 	title='Зачетная книжка'
		// 	logo='/icons/main.svg'
		// 	onClick={() => router.push('/gradebook')}
		// 	isActive={path.split('/')[1] == 'gradebook'}
		// />,
	]

	const teacherMenuItems = [
		<MenuItem
			title='Главная'
			logo='/icons/main.svg'
			onClick={() => router.push('/main')}
			isActive={path === '/main'}
		/>,
		<MenuItem
			title='Мои группы'
			logo='/icons/groups.svg'
			onClick={() => router.push('/mygroups')}
			isActive={path.split('/')[1] == 'mygroups'}
		/>,
		<MenuItem
			title='Журналы'
			logo='/icons/journal.svg'
			onClick={() => router.push('/journals')}
			isActive={path.split('/')[1] == 'journals'}
		/>,
	]

	const adminMenuItems = [
		<MenuItem
			title='Главная'
			logo='/icons/main.svg'
			onClick={() => router.push('/main')}
			isActive={path === '/main'}
		/>,
		<MenuItem
			title='Новости'
			logo='/icons/news.svg'
			onClick={() => router.push('/news')}
			isActive={path.split('/')[1] == 'news'}
		/>,
		<MenuItem
			title='Пользователи'
			logo='/icons/user.svg'
			onClick={() => router.push('/users')}
			isActive={path.split('/')[1] == 'users'}
		/>,
		<MenuItem
			title='Специальности'
			logo='/icons/document.svg'
			onClick={() => router.push('/speciality')}
			isActive={path.split('/')[1] == 'speciality'}
		/>,
		<MenuItem
			title='Группы'
			logo='/icons/groups.svg'
			onClick={() => router.push('/groups')}
			isActive={path.split('/')[1] == 'groups'}
		/>,
		<MenuItem
			title='Предметы'
			logo='/icons/grade.svg'
			onClick={() => router.push('/subjects')}
			isActive={path.split('/')[1] == 'subjects'}
		/>,
		<MenuItem
			title='Предметы у групп'
			logo='/icons/subjectgroup.svg'
			onClick={() => router.push('/subjectsForGroups')}
			isActive={path.split('/')[1] == 'subjectsForGroups'}
		/>,
	]
	const role = [
		{
			name: 'Гл. администратор',
			menu: adminMenuItems,
		},
		{
			name: 'Администратор',
			menu: adminMenuItems,
		},
		{
			name: 'Преподаватель',
			menu: teacherMenuItems,
		},
		{
			name: 'Студент',
			menu: studentMenuItems,
		},
	]

	return (
		<>
			<SideBar
				header='BerryJournal'
				logo='/logo.svg'
				menuItems={
					userData
						? role[userData.role_id - 1].menu
						: [
								<Skeleton className='w-full h-[34px] px-[10px] py-[5px] mb-[5px]' />,
								<Skeleton className='w-full h-[34px] px-[10px] py-[5px] mb-[5px]' />,
								<Skeleton className='w-full h-[34px] px-[10px] py-[5px] mb-[5px]' />,
								<Skeleton className='w-full h-[34px] px-[10px] py-[5px] mb-[5px]' />,
						  ]
				}
				footerItem={
					userData ? (
						<>
							{/*<div
								className='w-full flex	items-center border-t-1 border-white p-[15px] hover:bg-[#1b1a17] transition-colors cursor-pointer'
								onClick={() => setIsOpenSupportModal(true)}
							>
								<Image
									src={'/icons/support.svg'}
									alt='Поддержка'
									width={24}
									height={28}
									className='mr-2'
								/>
								Тех. поддержка
							</div>*/}
							<FooterItem
								avatar='/icons/avatar.png'
								name={`${userData.surname} ${userData.name[0]}. ${
									userData.patronymic ? `${userData.patronymic[0]}.` : ''
								}`}
								role={role[userData.role_id - 1].name}
								onClick={logout}
							/>
						</>
					) : (
						<div className='w-full border-t-1 border-white p-[15px]'>
							<Skeleton className='w-full h-[42px] ' />
						</div>
					)
				}
			/>
			<Modal
				open={isOpenSupportModal}
				title='Сообщение в тех. поддержку'
				footer={[
					<Button onClick={() => supportFetch()}>Отправить</Button>,
					<Button
						variant='outlined'
						onClick={() => {
							setIsOpenSupportModal(false)
							setSupportData({ ...supportData, description: '', contacts: '' })
						}}
					>
						Отмена
					</Button>,
				]}
			>
				<form
					className='flex flex-col'
					onSubmit={e => {
						e.preventDefault()
						supportFetch()
					}}
				>
					<label htmlFor='' className='text-[20px] mb-[5px]'>
						Контакты
					</label>
					<input
						onChange={e =>
							setSupportData({
								...supportData,
								contacts: e.currentTarget.value,
							})
						}
						className='w-full h-[45px] text-[18px] px-[15px] rounded-[10px] bg-white text-black'
					/>

					<label
						htmlFor=''
						className='text-[20px] mb-[5px] mt-[15px] text-[18px]'
					>
						Описание проблемы
					</label>
					<textarea
						onChange={e =>
							setSupportData({
								...supportData,
								description: e.currentTarget.value,
							})
						}
						rows={4}
						className='w-full text-[18px] py-2 px-[15px] rounded-[10px] bg-white text-black'
					></textarea>
					<input type='submit' value='Отправить' className='hidden' />
				</form>
			</Modal>
		</>
	)
}

export default Sidebar
