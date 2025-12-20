'use client'

import { Spinner } from '@/app/BJComponents'
import { serverAPI } from '@/app/utils/axios'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function MyGroups() {
	const [fetchData, setFetchData] = useState<any>(null)
	const [currentPage, setCurrentPage] = useState<number>(0)
	const router = useRouter()

	useEffect(() => {
		serverAPI
			.get('/teacher/getMyClassroomGroups', {
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
			<h2 className='text-[32px] pb-[30px]'>Мои группы</h2>
			<div className='flex flex-col h-full overflow-auto flex flex-col gap-[30px]'>
				<div className='p-[35px] w-full bg-[#232523] rounded-[10px]'>
					<h3 className='text-[25px] mb-[10px]'>Классное руководство</h3>
					{fetchData ? (
						fetchData.length != 0 ? (
							<div className='flex gap-[20px]'>
								{fetchData.map((el: any, index: number) => {
									return (
										<div
											onClick={() => setCurrentPage(index)}
											key={el.id}
											className={`flex p-[10px] w-max rounded-[5px] ${
												currentPage == index ? 'bg-[#1b1a17]' : ''
											} transition-[0.3s] cursor-pointer hover:bg-[#1b1a17]`}
										>
											<img
												src='/icons/avatar2.svg'
												alt='Avatar'
												className='w-[50px] mr-[10px]'
											/>
											<div>
												<h4 className='text-[20px] font-light'>{el.name}</h4>
												<p className='text-[15px] text-[#969696]'>
													Студентов: {el.students.length}
												</p>
											</div>
										</div>
									)
								})}
							</div>
						) : (
							''
						)
					) : (
						<Spinner size='m' />
					)}
				</div>
				<div className='w-full h-full overflow-auto bg-[#232523] rounded-[10px] flex'>
					{fetchData ? (
						fetchData.length != 0 ? (
							<>
								<div className='p-[35px] h-full min-w-[50%] border-r-[3px] border-[#1b1a17]'>
									<h3 className='text-[25px] mb-[10px]'>Предметы</h3>
									<div className='flex flex-col gap-[10px]'>
										{fetchData[currentPage].subjects.map((el: any) => {
											return (
												<div
													onClick={() => router.push(`/mygroups/${el.id}`)}
													key={el.id}
													className='flex justify-between items-center p-[15px] w-full rounded-[5px] border-2 border-white transition-[0.3s] cursor-pointer hover:bg-[#1b1a17]'
												>
													<h4 className='text-[20px] font-light'>
														{el.subject.name}
													</h4>
													<img
														src='/icons/Arrow.svg'
														className='ml-[10px]'
														alt='Стрелка'
													/>
												</div>
											)
										})}
									</div>
								</div>
								<div className='p-[35px] w-full h-max'>
									{fetchData[currentPage].students.map((el: any) => {
										return (
											<div className='flex flex-col gap-[5px]' key={el.id}>
												<div
													// onClick={() => router.push('/grade/123')}
													className='flex items-center p-[15px] rounded-[5px] transition-[0.3s] cursor-pointer hover:bg-[#1b1a17]'
												>
													<img
														src='/icons/avatar2.svg'
														alt='Avatar'
														className='w-[50px] mr-[10px]'
													/>
													<div>
														<h4 className='text-[20px] font-light'>
															{el.surname} {el.name}{' '}
															{el.patronymic ? el.patronymic : ''}
														</h4>
													</div>
												</div>
											</div>
										)
									})}
								</div>
							</>
						) : (
							''
						)
					) : (
						<div className='p-[35px] h-full min-w-[50%] border-r-[3px] border-[#1b1a17]'>
							<Spinner size='m' />
						</div>
					)}
				</div>
			</div>
		</>
	)
}
