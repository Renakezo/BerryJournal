'use client'

import { useRouter } from 'next/navigation'
import { Button } from '../BJComponents'
import Header from '../components/Header/Header'

export default function Tariffs() {
	const router = useRouter()
	return (
		<>
			<Header />

			<div className='w-screen h-screen flex flex-col justify-center items-center px-[160px]'>
				<h2 className='text-[36px] font-bold mb-[20px]'>Выберите ваш план</h2>
				<div className='flex gap-[15px]'>
					<div className='w-[300px] h-[500px] mt-[25px] flex flex-col justify-between bg-[#302F2C] rounded-[20px] p-[30px]'>
						<div>
							<p className='text-[22px] font-bold mb-[30px]'>Стандарт</p>
							<p className='text-[20px] text-center'>
								<span className='text-[30px] font-bold'>2000₽</span> /мес
							</p>
							<p className='text-[15px] text-center'>Ежегодный платёж</p>
							<ul className='mt-[30px] text-[13px] ml-[15px] list-disc'>
								<li>Учет успеваемости и посещаемости</li>
								<li>Статистика успеваемости</li>
							</ul>
						</div>
						<Button
							width='max'
							size='s'
							onClick={() => router.push('/contacts')}
						>
							Подключить
						</Button>
					</div>
					<div className='w-[350px] h-[500px] bg-[#302F2C] flex flex-col justify-between rounded-[20px] p-[30px]'>
						<div>
							<p className='text-[22px] font-bold mb-[30px]'>Стандарт+</p>
							<p className='text-[20px] text-center'>
								<span className='text-[30px] font-bold'>3200₽</span> /мес
							</p>
							<p className='text-[15px] text-center'>Ежегодный платёж</p>
							<ul className='mt-[30px] text-[13px] ml-[15px] list-disc'>
								<li>Улучшенная статистика</li>
								<li>Индивидуальная поддержка</li>
							</ul>
						</div>
						<Button
							width='max'
							size='s'
							onClick={() => router.push('/contacts')}
						>
							Подключить
						</Button>
					</div>
					<div className='w-[300px] h-[500px] mt-[25px] bg-[#302F2C] flex flex-col justify-between rounded-[20px] p-[30px]'>
						<div>
							<p className='text-[18px] font-bold mb-[30px]'>
								Модуль дистанционного обучения
							</p>
							<p className='text-[20px] text-center'>
								<span className='text-[30px] font-bold'>4500₽</span> /мес
							</p>
							<p className='text-[15px] text-center'>Ежегодный платёж</p>
							<ul className='mt-[30px] text-[13px] ml-[15px] list-disc'>
								<li>Модуль дистанционного обучения</li>
								<li>ИИ для автоматического создания лекций и тестов</li>
							</ul>
						</div>
						<Button
							width='max'
							size='s'
							onClick={() => router.push('/contacts')}
						>
							Подключить
						</Button>
					</div>
				</div>
			</div>
		</>
	)
}
