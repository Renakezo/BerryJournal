'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function Grade() {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const courses = [
		{
			id: 1,
			course: 1,
			date: 2021,
		},
		{
			id: 2,
			course: 2,
			date: 2022,
		},
	]

	return (
		<>
			<h2 className='text-[32px] pb-[30px]'>Зачетная книжка</h2>
			<div className='flex flex-col h-full flex flex-col overflow-auto justify-between gap-[30px]'>
				<div className='flex gap-[15px] text-[22px] h-[120px] bg-[#232523] rounded-[10px] p-[20px] font-light'>
					{courses.map(el => {
						return (
							<div
								key={el.id}
								onClick={() =>
									router.replace(`${pathname}?course=${el.course}`)
								}
								className={`p-[15px] cursor-pointer hover:bg-[#1B1A17] rounded-[5px] ${
									searchParams.get('course') == el.course.toString() ||
									(el.id == 1 &&
										searchParams
											.get('course')
											?.includes(el.course.toString())) ||
									(el.id == 1 && searchParams.get('course') == null)
										? 'bg-[#1B1A17]'
										: ''
								}`}
							>
								<p className='text-[20px]'>{el.course} курс</p>
								<p className='text-[15px] text-[#969696]'>
									{el.date}-{el.date + 1}
								</p>
							</div>
						)
					})}
				</div>
				<div className='w-full h-full overflow-auto bg-[#232523] rounded-[10px]'>
					<table className='w-full'>
						<thead className=''>
							<tr className='text-left text-[22px] border-b-[3px] border-[#1b1a17]'>
								<th className='p-[25px] font-light'>Дисциплина</th>
								<th className='p-[25px] font-light text-center'>
									Форма контроля
								</th>
								<th className='p-[25px] font-light text-center'>Часы</th>
								<th className='p-[25px] font-light text-center'>Дата</th>
								<th className='p-[25px] font-light text-center'>Результат</th>
								<th className='p-[25px] font-light'>Преподаватель</th>
							</tr>
						</thead>
						<tbody className=''>
							<tr className='hover:bg-gray-700 text-[20px] border-b-[2px] border-[#1b1a17]'>
								<td className='p-[25px] font-light'>
									Оптимизация веб-приложений
								</td>
								<td className='p-[25px] font-light text-center'>
									Зачет диференцированный
								</td>
								<td className='p-[25px] font-light text-center'>45</td>
								<td className='p-[25px] font-light text-center'>03.12.2021</td>
								<td className='p-[25px] flex flex-col justify-center items-center'>
									<span className='text-[#1C9D0E] border-1 border-[#1C9D0E] text-[20px] h-[40px] w-[40px] rounded flex justify-center items-center'>
										5
									</span>
								</td>
								<td className='p-[25px] font-light'>Мирошниченко И.Е.</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</>
	)
}
