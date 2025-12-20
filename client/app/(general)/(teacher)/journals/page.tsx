'use client'

import { Spinner } from '@/app/BJComponents'
import { serverAPI } from '@/app/utils/axios'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Journals() {
	const [fetchData, setFetchData] = useState<any>(null)
	const [currentPage, setCurrentPage] = useState<number>(0)
	const router = useRouter()

	useEffect(() => {
		serverAPI
			.get('/teacher/getMyGroups', {
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
			<h2 className='text-[32px] pb-[30px]'>Журналы</h2>
			<div className='w-full max-h-full overflow-auto bg-[#232523] rounded-[10px] flex'>
				<div className='p-[35px] min-w-max h-full border-r-[3px] border-[#1b1a17]'>
					<h3 className='text-[25px] mb-[10px]'>Группы</h3>
					<div className='flex flex-col gap-[5px]'>
						{fetchData ? fetchData.length != 0 ? (
							fetchData.map((el: any, index: number) => {
								return (
									<div
										key={el.id}
										onClick={() => setCurrentPage(index)}
										className={`flex p-[15px] rounded-[5px] ${
											index == currentPage ? 'bg-[#1b1a17]' : ''
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
												Студентов: {el.students_count}
											</p>
										</div>
									</div>
								)
							})
						) : '' : (
							<Spinner size='m' />
						)}
					</div>
				</div>
				<div className='p-[35px] w-full'>
					<h3 className='text-[25px] mb-[10px]'>Предметы</h3>
					<div className='flex flex-col gap-[5px]'>
						{fetchData ? fetchData.length != 0 ? (
							fetchData[currentPage].subjects.map((el: any) => {
								return (
									<div
										key={el.id}
										onClick={() => router.push(`/journals/${el.id}`)}
										className='flex justify-between items-center p-[15px] w-full rounded-[5px] border-2 border-white transition-[0.3s] cursor-pointer hover:bg-[#1b1a17]'
									>
										<h4 className='text-[20px] font-light'>
											{el.subject.name}
										</h4>
										<img src='/icons/Arrow.svg' alt='Стрелка' />
									</div>
								)
							})
						) : '' : (
							<Spinner size='m' />
						)}
					</div>
				</div>
			</div>
		</>
	)
}
