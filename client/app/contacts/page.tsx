'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Header from '../components/Header/Header'

export default function Contacts() {
	const router = useRouter()
	return (
		<>
			<Header />

			<div className='w-screen h-screen flex justify-center items-center px-[160px]'>
				<div className=''>
					<Image
						src={'/logo.svg'}
						alt='Главная студента'
						width={38}
						height={30}
						className='w-[40%] mx-auto'
					/>
					<h2 className='text-[36px] font-bold'>Контакты</h2>
					<p className='text-[22px] mе-[20px]'>
						Почта:{' '}
						<a href='mailto:support@berryjournal.ru'>support@berryjournal.ru</a>
					</p>
					<p className='text-[22px]'>
						Телефон: <a href='tel:+7(953)006-87-01'>+7 (953) 006-87-01</a>
					</p>
				</div>
			</div>
		</>
	)
}
