'use client'

import { serverAPI } from '@/app/utils/axios'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Spinner } from '../../BJComponents'

export default function Main() {
	const [newsData, setNewsData] = useState<any>(null)
	const router = useRouter()

	useEffect(() => {
		serverAPI
			.get('/getNews', {
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
			})
			.then(e => {
				setNewsData(e.data.message)
			})
	}, [])

	return (
		<div className='p-[40px] flex flex-col w-full max-h-screen overflow-auto'>
			<div>
				<h2 className='text-[32px] pb-[30px]'>Новости</h2>
				<div className='w-full flex flex-col overflow-auto max-h-auto rounded-[10px] gap-5'>
					{newsData ? (
						newsData.length != 0 ? (
							newsData.map((el: any) => {
								return (
									<div
										key={el.id}
										onClick={() => router.push(`/news/${el.id}`)}
										className='w-full flex p-[20px] rounded-[5px] transition-[0.3s] bg-[#232523] cursor-pointer hover:bg-[#141412]'
									>
										<img
											src='/icons/avatar.svg'
											alt='Avatar'
											className='w-[100px]'
										/>
										<div className='flex flex-col justify-between'>
											<h4 className='text-[20px] ml-[10px]'>{el.tittle}</h4>
											<p className='text-[18px] ml-[10px]'>
												{` ${
													new Date(el.created_at!).getDate() < 10
														? '0' + new Date(el.created_at!).getDate()
														: new Date(el.created_at!).getDate()
												}.${
													new Date(el.created_at!).getMonth() < 10
														? '0' + new Date(el.created_at!).getMonth()
														: new Date(el.created_at!).getMonth()
												}.${new Date(el.created_at!).getFullYear()}`}
											</p>
										</div>
									</div>
								)
							})
						) : (
							'Данных нет'
						)
					) : (
						<Spinner size='m' />
					)}
				</div>
			</div>
		</div>
	)
}
