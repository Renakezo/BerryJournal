'use client'

import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Button, Modal } from './BJComponents'
import Header from './components/Header/Header'
import { initializeCSRF, serverAPI } from './utils/axios'

export default function Home() {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [data, setData] = useState({ email: '', password: '' })
	const searchParams = useSearchParams()

	useEffect(() => {
		localStorage.getItem('token') && router.push('/main')
		searchParams.get('login') && setIsModalOpen(true)
		initializeCSRF()
	}, [])

	const router = useRouter()

	const login = () => {
		if (data.email == '' || data.password == '') {
			return toast('Поля не должны быть пустыми', {
				type: 'error',
			})
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
			return toast('Email должен быть валидным!', {
				type: 'error',
			})
		}
		const toastID = toast.loading('Проверка данных...')
		serverAPI
			.post('/login', data)
			.then(e => {
				localStorage.setItem('token', e.data.token)
				toast.update(toastID, {
					render: 'Успешно',
					type: 'success',
					isLoading: false,
					autoClose: 3000,
					closeButton: true,
				})
				router.push('/main')
			})
			.catch(e => {
				toast.update(toastID, {
					render: e.response.data.error,
					type: 'error',
					isLoading: false,
					autoClose: 3000,
					closeButton: true,
				})
			})
	}
	return (
		<>
			<Header />

			<div className='w-screen h-screen flex justify-between items-center px-[160px]'>
				<div className='font-bold'>
					<h2 className='text-[36px]'>Цифровая образовательная платформа</h2>
					<h1 className='text-[46px] mb-[20px]'>BerryJournal</h1>

					<div className=''>
						<Button
							size='xl'
							onClick={() => setIsModalOpen(true)}
							className='mr-[20px]'
						>
							Войти
						</Button>
						<Button
							size='xl'
							variant='outlined'
							onClick={() => router.push('/contacts')}
						>
							Подключить ОО
						</Button>
					</div>
				</div>
				<Image
					src={'/mainStudents.png'}
					alt='Главная студента'
					width={1920}
					height={1080}
					className='w-[65%]'
				/>
			</div>

			<Modal
				open={isModalOpen}
				title='Войдите по почте'
				titlePosition='center'
				closeButtonClick={() => setIsModalOpen(false)}
				footer={[
					<Button width='max' size='xl' onClick={login}>
						Вход
					</Button>,
				]}
			>
				<form
					className='flex flex-col'
					onSubmit={e => {
						e.preventDefault()
						login()
					}}
				>
					<label htmlFor='email' className='text-[20px] mb-[5px]'>
						Email
					</label>
					<input
						type='email'
						name='email'
						id='email'
						autoComplete='email'
						onChange={e => setData({ ...data, email: e.currentTarget.value })}
						className='w-[360px] h-[45px] text-[18px] px-[15px] rounded-[10px] bg-white text-black'
					/>

					<label
						htmlFor='password'
						className='text-[20px] mb-[5px] mt-[15px] text-[18px]'
					>
						Пароль
					</label>
					<input
						type='password'
						name='password'
						id='password'
						autoComplete='password current-password'
						onChange={e =>
							setData({ ...data, password: e.currentTarget.value })
						}
						className='w-[360px] h-[45px] text-[18px] px-[15px] rounded-[10px] bg-white text-black'
					/>
					<input type='submit' value='Войти' className='hidden' />
				</form>
			</Modal>
		</>
	)
}
