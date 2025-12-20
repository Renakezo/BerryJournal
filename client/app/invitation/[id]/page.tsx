'use client'

import { serverAPI } from '@/app/utils/axios'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Button, Spinner } from '../../BJComponents'
import Header from '../../components/Header/Header'

export default function Invitation() {
	const { id } = useParams()
	const router = useRouter()
	const [userData, setUserData] = useState<any>()
	const [data, setData] = useState({ password: '', secPassword: '' })
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	const getData = async () => {
		serverAPI
			.get(`/confirmationUser/${id}`)
			.then(e => {
				setUserData(e.data)
				setLoading(false)
			})
			.catch(e => {
				setError(e.response.data.message)
				setLoading(false)
			})
	}

	const sendData = async () => {
		if (data.password == '' || data.secPassword == '') {
			return toast('Заполните поля', {
				type: 'error',
			})
		}
		if (data.password != data.secPassword) {
			return toast('Пароли не совпадают', {
				type: 'error',
			})
		}
		serverAPI
			.post(`/confirmationUser/${id}`, { password: data.password })
			.then(e => {
				router.push('/?login=1')
			})
			.catch(e => {
				toast(e.response.data)
			})
	}

	useEffect(() => {
		getData()
	}, [])

	return (
		<>
			<Header />
			<div className='w-screen h-screen flex flex-col justify-center items-center'>
				{loading ? (
					<Spinner />
				) : error != '' ? (
					<h1 className='text-[25px]'>{error}</h1>
				) : (
					<>
						<h2 className='text-[25px] mb-[10px]'>
							{userData.message.organization.name}
						</h2>
						<h2 className='text-[25px] mb-[40px]'>
							Для продолжения пройдите регистрацию
						</h2>
						<form
							className='flex flex-col'
							onSubmit={e => {
								e.preventDefault()
								sendData()
							}}
						>
							<label htmlFor='' className='text-[20px] mb-[5px]'>
								Придумайте пароль
							</label>
							<input
								type='text'
								className='w-[360px] h-[45px] text-[18px] px-[15px] rounded-[10px] bg-white text-black'
								onChange={e =>
									setData({ ...data, password: e.currentTarget.value })
								}
							/>
							<label
								htmlFor=''
								className='text-[20px] mb-[5px] mt-[15px] text-[18px]'
							>
								Повторите пароль
							</label>
							<input
								type='password'
								className='w-[360px] h-[45px] text-[18px] px-[15px] rounded-[10px] bg-white text-black'
								onChange={e =>
									setData({ ...data, secPassword: e.currentTarget.value })
								}
							/>
							<Button
								width='max'
								size='xl'
								className='mt-[30px]'
								onClick={sendData}
							>
								Регистрация
							</Button>
						</form>
					</>
				)}
			</div>
		</>
	)
}
