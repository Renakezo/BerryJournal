'use client'

import { Button, Modal, Spinner } from '@/app/BJComponents'
import JournalContextMenu from '@/app/components/JournalContextMenu/JournalContextMenu'
import useContextMenu from '@/app/hooks/useContextMenu'
import { serverAPI } from '@/app/utils/axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function Journal() {
	const [fetchData, setFetchData] = useState<any>(null)
	const [isModalCreateOpen, setIsModalCreateOpen] = useState(false)
	const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false)
	const [dateData, setDateData] = useState<any>({
		date_id: null,
		group_subject_id: null,
		date: null,
		theme: null,
	})
	const { clicked, setClicked, points, setPoints, data, setData } =
		useContextMenu()
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
				setDateData({
					...dateData,
					group_subject_id: e.data.message.subject.id,
				})
			})
			.catch(e => {
				toast('Журнал не найден', {
					type: 'error',
				})
				router.push('/journals')
			})
	}

	const addDate = () => {
		if (dateData.group_subject_id == null || dateData.date == null) {
			return toast('Заполните дату', {
				type: 'error',
			})
		}
		serverAPI
			.post(`/teacher/addDate`, dateData, {
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
			})
			.then(e => {
				setIsModalCreateOpen(false)
				toast(e.data.message, {
					type: 'success',
				})
				getJournal()
			})
	}

	const updateDate = (id: string) => {
		serverAPI
			.put(`/teacher/updateDate/${id}`, dateData, {
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
			})
			.then(e => {
				setIsModalUpdateOpen(false)
				setDateData({
					...dateData,
					date: null,
					theme: null,
					date_id: null,
				})
				toast(e.data.message, {
					type: 'success',
				})
				getJournal()
			})
	}

	const deleteDate = (id: string) => {
		serverAPI
			.delete(`/teacher/deleteDate/${id}`, {
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
			})
			.then(e => {
				setIsModalUpdateOpen(false)
				setDateData({
					...dateData,
					date: null,
					theme: null,
					date_id: null,
				})
				toast(e.data.message, {
					type: 'success',
				})
				getJournal()
			})
	}

	const updateMark = (mark: string, date_id: string, student_id: string) => {
		serverAPI
			.post(
				`/teacher/updateMark`,
				{
					mark: mark,
					date_id: date_id,
					student_id: student_id,
				},
				{
					headers: {
						Authorization: 'Bearer ' + localStorage.getItem('token'),
					},
				}
			)
			.then(e => {
				getJournal()
			})
	}

	const updateFinalMark = (
		mark: string,
		group_subject_id: string,
		student_id: string
	) => {
		serverAPI
			.post(
				`/teacher/updateFinalMark`,
				{
					mark: mark,
					group_subject_id: group_subject_id,
					student_id: student_id,
				},
				{
					headers: {
						Authorization: 'Bearer ' + localStorage.getItem('token'),
					},
				}
			)
			.then(e => {
				getJournal()
			})
	}

	const exportReport = () => {
		serverAPI
			.get(`/teacher/getSubjectReport/${id}`, {
				responseType: 'blob',
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
					Accept:
						'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				},
			})
			.then(e => {
				const url = window.URL.createObjectURL(new Blob([e.data]))
				const link = document.createElement('a')
				link.href = url

				// Извлечение имени файла из заголовков
				const contentDisposition = e.headers['content-disposition']
				const fileName = contentDisposition
					? contentDisposition.split('filename=')[1].replace(/"/g, '')
					: `${fetchData.subject.subject.name}_${fetchData.subject.group.name}.xlsx`
				link.setAttribute('download', fileName)
				document.body.appendChild(link)
				link.click()
				link.remove()
			})
			.catch(e => {
				toast('Ошибка при скачивании отчета', {
					type: 'error',
				})
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
						{/* <Button size='m' onClick={exportReport}>Ведомость по предмету</Button> */}
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
																<div className='flex w-max'>
																	{date.days.map((day: any, index: number) => {
																		return (
																			<div
																				className='col flex flex-col w-full'
																				key={day.id}
																			>
																				<div
																					className='w-full h-[50px] flex justify-center items-center border border-1 border-white sticky top-[50px] bg-[#232523] cursor-pointer transition-colors hover:bg-[#1B1A17]'
																					onClick={() => {
																						setDateData({
																							...dateData,
																							date_id: day.id,
																							theme: day.theme,
																							date: day.date,
																						})
																						setIsModalUpdateOpen(true)
																					}}
																				>
																					{day.date.split('-')[2]}
																				</div>
																				{/* Ячейки с оценками*/}
																				{fetchData.students.map(
																					(student: any) => {
																						return (
																							<div
																								className='cells w-full relative'
																								key={student.id}
																								onContextMenu={e => {
																									e.preventDefault()
																									setClicked(true)
																									setPoints({
																										x: e.pageX,
																										y: e.pageY,
																									})
																									setData({
																										student_id: student.id,
																										date_id: day.id,
																										isSkip: day.skips.find(
																											(x: any) =>
																												x.student_id ==
																												student.id
																										)
																											? true
																											: false,
																									})
																								}}
																							>
																								<div className='absolute right-[2px] top-[1px] text-[12px] font-bold text-[red]'>
																									{day.skips.find(
																										(x: any) =>
																											x.student_id == student.id
																									)
																										? 'Н'
																										: ''}
																								</div>
																								<input
																									className={`${
																										date.days.length == 1
																											? 'w-[96px]'
																											: 'w-[50px]'
																									} h-[50px] flex justify-center items-center text-center border border-1 border-white`}
																									onChange={e => {
																										if (
																											e.currentTarget.value ==
																												'5' ||
																											e.currentTarget.value ==
																												'4' ||
																											e.currentTarget.value ==
																												'3' ||
																											e.currentTarget.value ==
																												'2' ||
																											e.currentTarget.value ==
																												'1' ||
																											e.currentTarget.value ==
																												'0' ||
																											e.currentTarget.value ==
																												'нз' ||
																											e.currentTarget.value ==
																												'зч' ||
																											e.currentTarget.value ==
																												''
																										) {
																											updateMark(
																												e.currentTarget.value,
																												day.id,
																												student.id
																											)
																										} else {
																											if (
																												e.currentTarget.value ==
																													'н' ||
																												e.currentTarget.value ==
																													'з'
																											) {
																											} else {
																												e.currentTarget.value =
																													''
																											}
																										}
																									}}
																									defaultValue={
																										day.marks.find(
																											(x: any) =>
																												x.student_id ==
																												student.id
																										)
																											? day.marks.find(
																													(x: any) =>
																														x.student_id ==
																														student.id
																											  ).mark
																											: ''
																									}
																								/>
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
									{/* Колонка с добавлением даты */}
									<div className='col'>
										<div
											className='w-[50px] h-full flex justify-center items-center border border-1 border-white cursor-pointer transition-colors hover:bg-[#1B1A17]'
											onClick={() => {
												setIsModalCreateOpen(true)
											}}
										>
											+
										</div>
									</div>
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
													<input
														className='w-[50px] h-[50px] flex justify-center items-center text-center border border-1 border-white'
														defaultValue={
															fetchData.final_marks.find(
																(x: any) => x.student_id == student.id
															)
																? fetchData.final_marks.find(
																		(x: any) => x.student_id == student.id
																  ).mark
																: ''
														}
														onChange={e => {
															if (
																e.currentTarget.value == '5' ||
																e.currentTarget.value == '4' ||
																e.currentTarget.value == '3' ||
																e.currentTarget.value == '2' ||
																e.currentTarget.value == '1' ||
																e.currentTarget.value == '0' ||
																e.currentTarget.value == 'нз' ||
																e.currentTarget.value == 'зч' ||
																e.currentTarget.value == ''
															) {
																updateFinalMark(
																	e.currentTarget.value,
																	fetchData.subject.id,
																	student.id
																)
															} else {
																if (
																	e.currentTarget.value == 'н' ||
																	e.currentTarget.value == 'з'
																) {
																} else {
																	e.currentTarget.value = ''
																}
															}
														}}
													/>
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
				{clicked && (
					<JournalContextMenu
						data={data}
						position={points}
						getJournal={getJournal}
					/>
				)}

				<Modal
					footer={[
						<Button size='m' onClick={() => addDate()}>
							Добавить
						</Button>,
						<Button
							size='m'
							variant='outlined'
							onClick={() => setIsModalCreateOpen(false)}
						>
							Отмена
						</Button>,
					]}
					open={isModalCreateOpen}
					title='Добавление даты'
					titlePosition='left'
					closeButtonClick={() => setIsModalCreateOpen(false)}
				>
					<form
						className='flex flex-col'
						onSubmit={e => {
							e.preventDefault()
							addDate()
						}}
					>
						<label htmlFor='' className='text-[20px] mb-[5px]'>
							Дата
						</label>
						<input
							type='date'
							min='2025-09-01'
							max='2026-09-01'
							onChange={e =>
								setDateData({ ...dateData, date: e.currentTarget.value })
							}
							className='w-[360px] h-[45px] text-[18px] px-[15px] rounded-[10px] bg-white text-black'
						/>

						<label
							htmlFor=''
							className='text-[20px] mb-[5px] mt-[15px] text-[18px]'
						>
							Тема
						</label>
						<input
							type='text'
							onChange={e =>
								setDateData({ ...dateData, theme: e.currentTarget.value })
							}
							className='w-[360px] h-[45px] text-[18px] px-[15px] rounded-[10px] bg-white text-black'
						/>
						<input type='submit' value='Добавить' className='hidden' />
					</form>
				</Modal>

				<Modal
					footer={[
						<Button size='m' onClick={() => updateDate(dateData.date_id)}>
							Изменить
						</Button>,
						<Button
							size='m'
							variant='danger'
							onClick={() => deleteDate(dateData.date_id)}
						>
							Удалить
						</Button>,
						<Button
							size='m'
							variant='outlined'
							onClick={() => {
								setIsModalUpdateOpen(false)
								setDateData({
									...dateData,
									date: null,
									theme: null,
									date_id: null,
								})
							}}
						>
							Отмена
						</Button>,
					]}
					open={isModalUpdateOpen}
					title='Добавление даты'
					titlePosition='left'
					closeButtonClick={() => {
						setIsModalUpdateOpen(false)
						setDateData({ ...dateData, date: null, theme: null, date_id: null })
					}}
				>
					<form
						className='flex flex-col'
						onSubmit={e => {
							e.preventDefault()
							updateDate(dateData.date_id)
						}}
					>
						<label htmlFor='' className='text-[20px] mb-[5px]'>
							Дата
						</label>
						<input
							type='date'
							min='2025-09-01'
                                                        max='2026-09-01'
							onChange={e =>
								setDateData({ ...dateData, date: e.currentTarget.value })
							}
							defaultValue={dateData.date}
							className='w-[360px] h-[45px] text-[18px] px-[15px] rounded-[10px] bg-white text-black'
						/>

						<label
							htmlFor=''
							className='text-[20px] mb-[5px] mt-[15px] text-[18px]'
						>
							Тема
						</label>
						<input
							type='text'
							onChange={e =>
								setDateData({ ...dateData, theme: e.currentTarget.value })
							}
							defaultValue={dateData.theme}
							className='w-[360px] h-[45px] text-[18px] px-[15px] rounded-[10px] bg-white text-black'
						/>
						<input type='submit' value='Добавить' className='hidden' />
					</form>
				</Modal>
			</div>
		</>
	)
}
