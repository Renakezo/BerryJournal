'use client'

import { Spinner } from '@/app/BJComponents'
import { serverAPI } from '@/app/utils/axios'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function Grade() {
	const [fetchData, setFetchData] = useState<any>(null)
	const router = useRouter()
	const id = useParams().id

	useEffect(() => {
		serverAPI
			.get(`/student/getSubject/${id}`, {
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
			})
			.then(e => {
				setFetchData(e.data.message)
			})
			.catch(e => {
				toast('Предмет не найден', {
					type: 'error',
				})
				router.push('/grade')
			})
	}, [])

	return (
		<>
			<div className='flex justify-between pb-[30px]'>
				{fetchData ? (
					fetchData.subject != null ? (
						<>
							<h2 className='text-[32px]'>{fetchData.subject.subject.name}</h2>
							{/* <Button size='m'>Посмотреть ведомость</Button> */}
						</>
					) : (
						''
					)
				) : (
					<Spinner size='m' />
				)}
			</div>
			<div className='flex flex-col h-full flex flex-col overflow-auto justify-between gap-[30px]'>
				<div className='w-full h-full max-h-full overflow-auto bg-[#232523] rounded-[10px]'>
					{fetchData ? (
						fetchData.date.length != 0 ? (
							<table className='w-full'>
								<thead className=''>
									<tr className='text-left text-[22px] border-b-[3px] border-[#1b1a17]'>
										<th className='p-[25px] font-light'>Дата</th>
										<th className='p-[25px] font-light'>Оценка</th>
										<th className='p-[25px] font-light'>Пропуск</th>
										<th className='p-[25px] font-light w-4/6'>Тема</th>
									</tr>
								</thead>
								<tbody className=''>
									{fetchData.date.map((el: any) => {
										return (
											<tr
												className='hover:bg-gray-700 text-[20px] border-b-[2px] border-[#1b1a17]'
												key={el.id}
											>
												<td className='p-[25px] font-light'>
													{`${el.date.split('-')[2]}.${el.date.split('-')[1]}.${
														el.date.split('-')[0]
													}`}
												</td>
												<td className='p-[25px] text-center'>
													{el.marks.length != 0 ? (
														el.marks[0].mark == '5' ? (
															<span className='text-[#1C9D0E] border-1 border-[#1C9D0E] text-[20px] h-[40px] w-[40px] rounded flex justify-center items-center'>
																5
															</span>
														) : el.marks[0].mark == '4' ? (
															<span className='text-[#3bc72c] border-1 border-[#3bc72c] text-[20px] h-[40px] w-[40px] rounded flex justify-center items-center'>
																4
															</span>
														) : el.marks[0].mark == '3' ? (
															<span className='text-[#faa11b] border-1 border-[#faa11b] text-[20px] h-[40px] w-[40px] rounded flex justify-center items-center'>
																3
															</span>
														) : el.marks[0].mark == '2' ? (
															<span className='text-[#fa1b1b] border-1 border-[#fa1b1b] text-[20px] h-[40px] w-[40px] rounded flex justify-center items-center'>
																2
															</span>
														) : el.marks[0].mark == '1' ? (
															<span className='text-[#fa1b1b] border-1 border-[#fa1b1b] text-[20px] h-[40px] w-[40px] rounded flex justify-center items-center'>
																1
															</span>
														) : el.marks[0].mark == '0' ? (
															<span className='text-[#fa1b1b] border-1 border-[#fa1b1b] text-[20px] h-[40px] w-[40px] rounded flex justify-center items-center'>
																0
															</span>
														) : (
															<span className='text-[#9e9e9e] border-1 border-[#9e9e9e] text-[20px] h-[40px] w-[40px] rounded flex justify-center items-center'>
																{el.marks[0].mark}
															</span>
														)
													) : (
														<span className='text-[#9e9e9e] border-1 border-[#9e9e9e] text-[20px] h-[40px] w-[40px] rounded flex justify-center items-center'>
															-
														</span>
													)}
												</td>
												<td className='p-[25px] font-light'>
													{el.skips.length != 0 ? (
														<span className='text-[#fa1b1b] border-1 border-[#fa1b1b] text-[20px] h-[40px] w-[40px] rounded flex justify-center items-center'>
															н
														</span>
													) : (
														<span className='text-[#9e9e9e] border-1 border-[#9e9e9e] text-[20px] h-[40px] w-[40px] rounded flex justify-center items-center'>
															-
														</span>
													)}
												</td>
												<td className='p-[25px] font-light'>
													{el.theme != null ? el.theme : '-'}
												</td>
											</tr>
										)
									})}
								</tbody>
							</table>
						) : (
							''
						)
					) : (
						<div className='m-4'>
							<Spinner size='m' />
						</div>
					)}
				</div>

				<div className='flex gap-[30px] text-[22px] font-light'>
					{fetchData ? (
						<>
							<div className='w-1/6 h-[160px] p-[30px] text-center bg-[#232523] rounded-[10px]'>
								<h3>Итоговая оценка</h3>
								{fetchData.final_mark ? (
									fetchData.final_mark.mark == 5 ? (
										<p className='text-[40px] text-[#1C9D0E]'>
											{fetchData.final_mark.mark}
										</p>
									) : fetchData.final_mark.mark == 4 ? (
										<p className='text-[40px] text-[#3bc72c]'>
											{fetchData.final_mark.mark}
										</p>
									) : fetchData.final_mark.mark == 3 ? (
										<p className='text-[40px] text-[#faa11b]'>
											{fetchData.final_mark.mark}
										</p>
									) : fetchData.final_mark.mark == 2 ||
									  fetchData.final_mark.mark == 1 ||
									  fetchData.final_mark.mark == 0 ? (
										<p className='text-[40px] text-[#fa1b1b]'>
											{fetchData.final_mark.mark}
										</p>
									) : (
										<p className='text-[40px] text-[#9e9e9e]'>
											{fetchData.final_mark.mark}
										</p>
									)
								) : (
									<p className='text-[40px] text-[#9e9e9e]'>-</p>
								)}
							</div>
							<div className='w-1/6 h-[160px] p-[30px] text-center bg-[#232523] rounded-[10px]'>
								<h3>Средний балл</h3>

								{fetchData.average_mark ? (
									fetchData.average_mark == 5 ? (
										<p className='text-[40px] text-[#1C9D0E]'>
											{fetchData.average_mark.toFixed(2)}
										</p>
									) : fetchData.average_mark >= 4 ? (
										<p className='text-[40px] text-[#3bc72c]'>
											{fetchData.average_mark.toFixed(2)}
										</p>
									) : fetchData.average_mark >= 3 ? (
										<p className='text-[40px] text-[#faa11b]'>
											{fetchData.average_mark.toFixed(2)}
										</p>
									) : fetchData.average_mark >= 0 ? (
										<p className='text-[40px] text-[#fa1b1b]'>
											{fetchData.average_mark.toFixed(2)}
										</p>
									) : (
										''
									)
								) : (
									<p className='text-[40px] text-[#9e9e9e]'>-</p>
								)}
							</div>
							<div className='w-1/6 h-[160px] p-[30px] text-center bg-[#232523] rounded-[10px]'>
								<h3>Пропуски</h3>
								{fetchData.skips_count == 0 ? (
									<p className='text-[40px] text-[#1C9D0E]'>
										{fetchData.skips_count}
									</p>
								) : (
									<p className='text-[40px] text-[#fa1b1b]'>
										{fetchData.skips_count}
									</p>
								)}
							</div>
							<div className='w-3/6 h-[160px] p-[30px] text-center bg-[#232523] rounded-[10px]'>
								{/* <h3 className='text-lext'>Личный рейтинг</h3>
								<p className='text-[40px] text-[#1C9D0E]'>-</p> */}
							</div>
						</>
					) : (
						<>
							<div className='w-1/6 h-[160px] p-[30px] text-center bg-[#232523] rounded-[10px]'>
								<h3>Итоговая оценка</h3>
								<div className='flex justify-center items-center'>
									<Spinner size='m' />
								</div>
							</div>
							<div className='w-1/6 h-[160px] p-[30px] text-center bg-[#232523] rounded-[10px]'>
								<h3>Средний балл</h3>
								<div className='flex justify-center items-center'>
									<Spinner size='m' />
								</div>
							</div>
							<div className='w-1/6 h-[160px] p-[30px] text-center bg-[#232523] rounded-[10px]'>
								<h3>Пропуски</h3>
								<div className='flex justify-center items-center'>
									<Spinner size='m' />
								</div>
							</div>
							<div className='w-3/6 h-[160px] p-[30px] text-center bg-[#232523] rounded-[10px]'>
								{/* <h3 className='text-lext'>Личный рейтинг</h3>
								<p className='text-[40px] text-[#1C9D0E]'>-</p> */}
							</div>
						</>
					)}
				</div>
			</div>
		</>
	)
}
