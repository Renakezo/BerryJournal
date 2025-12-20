'use client'

import { Spinner } from '@/app/BJComponents'
import { serverAPI } from '@/app/utils/axios'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Grade() {
	const [fetchData, setFetchData] = useState<any>(null)
	const router = useRouter()

	useEffect(() => {
		serverAPI
			.get('/student/getAllSubjects', {
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
			})
			.then(e => {
				setFetchData(e.data.message)
			})
	}, [])
	return (
		<>
			<h2 className='text-[32px] pb-[30px]'>Успеваемость</h2>
			<div className='p-[35px] w-full bg-[#232523] overflow-auto max-h-auto rounded-[10px]'>
				<h3 className='text-[25px] mb-[10px]'>Предметы</h3>
				<div className='flex flex-col gap-[5px]'>
					{fetchData ? (
						fetchData.length != 0 ? (
							fetchData.map((el: any) => {
								return (
									<div
										key={el.id}
										onClick={() => router.push(`/grade/${el.id}`)}
										className='flex p-[10px] rounded-[5px] transition-[0.3s] cursor-pointer hover:bg-[#1b1a17]'
									>
										<img
											src='/icons/avatar2.svg'
											alt='Avatar'
											className='w-[50px] mr-[10px]'
										/>
										<div>
											<h4 className='text-[20px] font-light'>
												{el.subject.name}
											</h4>
											{/* <p className='text-[15px] text-[#969696]'>
												Последняя оценка - 5
											</p> */}
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
		</>
	)
}
