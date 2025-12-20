'use client'

import { useRouter } from 'next/navigation'

export default function Grade() {
	const router = useRouter()
	return (
		<>
			<h2 className='text-[32px] pb-[30px]'>Мои группы</h2>
			<div className='flex flex-col h-full overflow-auto flex flex-col gap-[30px]'>
				<div className='w-full max-h-full overflow-auto bg-[#232523] rounded-[10px] flex'>
					<div className='p-[35px] min-w-max h-max border-r-[3px] border-[#1b1a17]'>
						<h3 className='text-[25px] mb-[10px]'>Группы</h3>
						<div className='flex flex-col gap-[5px]'>
							<div
								onClick={() => router.push('/grade/123')}
								className='flex p-[15px] rounded-[5px] bg-[#1b1a17] transition-[0.3s] cursor-pointer hover:bg-[#1b1a17]'
							>
								<img
									src='/icons/avatar2.svg'
									alt='Avatar'
									className='w-[50px] mr-[10px]'
								/>
								<div>
									<h4 className='text-[20px] font-light'>ИСиП-401</h4>
									<p className='text-[15px] text-[#969696]'>25 человек</p>
								</div>
							</div>

							<div
								onClick={() => router.push('/grade/123')}
								className='flex p-[15px] rounded-[5px] transition-[0.3s] cursor-pointer hover:bg-[#1b1a17]'
							>
								<img
									src='/icons/avatar2.svg'
									alt='Avatar'
									className='w-[50px] mr-[10px]'
								/>
								<div>
									<h4 className='text-[20px] font-light'>ИСиП-401</h4>
									<p className='text-[15px] text-[#969696]'>25 человек</p>
								</div>
							</div>
						</div>
					</div>
					<div className='p-[35px] w-full'>
						<h3 className='text-[25px] mb-[10px]'>Группы</h3>
						<div className='flex flex-col gap-[5px]'>
							<div
								onClick={() => router.push('/grade/123')}
								className='flex justify-between items-center p-[15px] w-full rounded-[5px] border-2 border-white transition-[0.3s] cursor-pointer hover:bg-[#1b1a17]'
							>
								<h4 className='text-[20px] font-light'>
									МДК 09.01 Разработка интерфейсов пользователя
								</h4>
								<img src='/icons/Arrow.svg' alt='Стрелка' />
							</div>
						</div>
					</div>
				</div>

				<div className='p-[35px] w-full bg-[#232523] rounded-[10px]'>
					<h3 className='text-[25px] mb-[10px]'>Классное руководство</h3>
					<div className='flex gap-[20px]'>
						<div
							onClick={() => router.push('/grade/123')}
							className='flex p-[10px] w-max rounded-[5px] transition-[0.3s] cursor-pointer hover:bg-[#1b1a17]'
						>
							<img
								src='/icons/avatar2.svg'
								alt='Avatar'
								className='w-[50px] mr-[10px]'
							/>
							<div>
								<h4 className='text-[20px] font-light'>ИСиП-401</h4>
								<p className='text-[15px] text-[#969696]'>25 человек</p>
							</div>
						</div>
						<div
							onClick={() => router.push('/grade/123')}
							className='flex p-[10px] w-max rounded-[5px] transition-[0.3s] cursor-pointer hover:bg-[#1b1a17]'
						>
							<img
								src='/icons/avatar2.svg'
								alt='Avatar'
								className='w-[50px] mr-[10px]'
							/>
							<div>
								<h4 className='text-[20px] font-light'>ИСиП-401</h4>
								<p className='text-[15px] text-[#969696]'>25 человек</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
