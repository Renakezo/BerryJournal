'use client'

import { Spinner } from '@/app/BJComponents'
import { serverAPI } from '@/app/utils/axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function MyGroupJournal() {
	const [fetchData, setFetchData] = useState<any>(null)
	const router = useRouter()
	const id = useParams().id

	const getJournal = () => {
		serverAPI
			.get(`/teacher/getJournal/${id}`, {
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
			})
			.then(e => {
				setFetchData(e.data.message)
			})
			.catch(e => {
				toast('Журнал не найден', {
					type: 'error',
				})
				router.push('/mygroups')
			})
	}

	useEffect(() => {
		getJournal()
	}, [])

	return (
		<>
			<div className='flex justify-between items-start pb-[30px]'>
				{fetchData ? (
					<>
						<div>
							<h2 className='text-[32px] pb-[5px]'>
								{fetchData.subject.subject.name}
							</h2>
							<h3 className='text-[25px]'>
								Группа: {fetchData.subject.group.name}
							</h3>
						</div>
						{/* <Button size='m'>Ведомость по предмету</Button> */}
					</>
				) : (
					<Spinner size='m' />
				)}
			</div>
			<div className='w-full h-full overflow-auto p-[35px] bg-[#232523] rounded-[10px] flex flex-col'>
				{fetchData ? (
					fetchData.students.length != 0 ? (
						<>
							<div className='w-full h-full overflow-auto'>
								<div className='table_grade text-[20px] flex'>
									<div className='col'>
										<div className='min-w-[350px] w-[350px] h-[100px] p-[25px] text-[25px] flex items-center border border-1 border-white sticky top-0 bg-[#232523]'>
											Список группы
										</div>
										<div className='students__list'>
											{fetchData.students.map((el: any, index: number) => {
												return (
													<div className='row flex' key={el.id}>
														<div className='w-[50px] h-[50] flex justify-center items-center border border-1 border-white'>
															{index + 1}
														</div>
														<div className='min-w-[300px] w-[300px] h-[50] px-[15px] text-[16px] flex items-center border border-1 border-white'>
															{el.surname} {el.name}{' '}
															{el.patronymic ? el.patronymic : ''}
														</div>
													</div>
												)
											})}
										</div>
									</div>
									{fetchData
										? fetchData.dates.length != 0
											? fetchData.dates.map((date: any, index: number) => {
													return (
														<React.Fragment key={index}>
															{/* Колонка с датами и оценками */}
															<div className='col'>
																<div className='min-w-[50px] w-full h-[50px] flex justify-center items-center border border-1 border-white truncate sticky top-0 bg-[#232523]'>
																	{date.month}
																</div>
																<div className='flex w-full'>
																	{date.days.map((day: any, index: number) => {
																		return (
																			<div
																				className='col flex flex-col w-full'
																				key={day.id}
																			>
																				<div className='w-full min-w-[50px] h-[50px] flex justify-center items-center border border-1 border-white sticky top-[50px] bg-[#232523]'>
																					{day.date.split('-')[2]}
																				</div>
																				{/* Ячейки с оценками*/}
																				{fetchData.students.map(
																					(student: any) => {
																						return (
																							<div
																								className='cells w-full relative'
																								key={student.id}
																							>
																								<div className='absolute right-[2px] top-[1px] text-[12px] font-bold text-[red]'>
																									{day.skips.find(
																										(x: any) =>
																											x.student_id == student.id
																									)
																										? 'Н'
																										: ''}
																								</div>
																								<div className='w-full h-[50px] flex justify-center items-center text-center border border-1 border-white'>
																									{day.marks.find(
																										(x: any) =>
																											x.student_id == student.id
																									)
																										? day.marks.find(
																												(x: any) =>
																													x.student_id ==
																													student.id
																										  ).mark
																										: ''}
																								</div>
																							</div>
																						)
																					}
																				)}
																			</div>
																		)
																	})}
																</div>
															</div>
														</React.Fragment>
													)
											  })
											: ''
										: ''}
									{/* Колонка со средним баллом */}
									<div className='col'>
										<div className='w-[70px] h-[100px] border border-1 border-white flex justify-center items-center sticky top-0 bg-[#232523] text-[18px]'>
											<p style={{ writingMode: 'sideways-lr' }}>Ср. балл</p>
										</div>
										{/* Ячейки */}
										{fetchData.students.map((student: any) => {
											return (
												<div className='cells' key={student.id}>
													<div className='w-[70px] h-[50px] flex justify-center items-center border border-1 border-white'>
														{fetchData.average_marks.find(
															(x: any) => x.student_id == student.id
														)
															? fetchData.average_marks
																	.find((x: any) => x.student_id == student.id)
																	.average_mark.toFixed(2)
															: 0}
													</div>
												</div>
											)
										})}
									</div>
									{/* Колонка с итоговой оценкой */}
									<div className='col'>
										<div className='w-[50px] h-[100px] border border-1 border-white flex justify-center items-center sticky top-0 bg-[#232523] text-[18px]'>
											<p style={{ writingMode: 'sideways-lr' }}>Итоговая</p>
										</div>
										{/* Ячейки */}
										{fetchData.students.map((student: any) => {
											return (
												<div className='cells' key={student.id}>
													<div className='w-[50px] h-[50px] flex justify-center items-center text-center border border-1 border-white'>
														{fetchData.final_marks.find(
															(x: any) => x.student_id == student.id
														)
															? fetchData.final_marks.find(
																	(x: any) => x.student_id == student.id
															  ).mark
															: ''}
													</div>
												</div>
											)
										})}
									</div>
								</div>
							</div>
							{/* <div className='mt-[30px]'>
								<Button>Сохранить изменения</Button>
							</div> */}
						</>
					) : (
						''
					)
				) : (
					<Spinner size='m' />
				)}
			</div>
		</>
	)
}
