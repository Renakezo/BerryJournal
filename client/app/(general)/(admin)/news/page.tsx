'use client'

import { Button, Skeleton, Spinner } from '@/app/BJComponents'
import CreateNews from '@/app/components/NewsSidebar/CreateNews'
import DeleteNews from '@/app/components/NewsSidebar/DeleteNews'
import UpdateNews from '@/app/components/NewsSidebar/UpdateNews'
import { useDebounce } from '@/app/hooks/useDebaunce'
import { INews } from '@/app/types/types'
import { serverAPI } from '@/app/utils/axios'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function News() {
	const [newsData, setNewsData] = useState<any>()
	const [sidebar, setSidebar] = useState<any>(<Spinner />)
	const [update, setUpdate] = useState<boolean>(false)
	const [searchData, setSearchData] = useState<{
		search: string
	}>({
		search: '',
	})
	const debouncedSearch = useDebounce(searchData.search, 500)

	const getNewsData = () => {
		const usersParams = new URLSearchParams()
		searchData.search != '' && usersParams.set('search', searchData.search)
		serverAPI
			.get('/getNews?' + usersParams.toString(), {
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
			})
			.then(e => {
				setNewsData(e.data.message)
				setSidebar(
					<CreateNews
						setUpdate={setUpdate}
						update={update}
						setSidebar={setSidebar}
					/>
				)
			})
	}

	useEffect(() => {
		getNewsData()
	}, [update])

	useEffect(() => {
		getNewsData()
	}, [debouncedSearch])

	return (
		<>
			<div className='flex justify-between pb-[30px]'>
				<h2 className='text-[32px]'>Новости</h2>
				<Button
					size='m'
					onClick={() => {
						setSidebar(
							<CreateNews
								setUpdate={setUpdate}
								update={update}
								setSidebar={setSidebar}
							/>
						)
					}}
				>
					Добавить новость
				</Button>
			</div>
			<div className='w-full h-full max-h-full flex flex-col bg-[#232523] overflow-auto rounded-[10px]'>
				<div className='w-full px-[35px] py-[25px] border-b-[3px] border-[#1b1a17] flex gap-[30px] text-[18px]'>
					<input
						type='text'
						placeholder='Поиск'
						onChange={e => {
							setSearchData({ ...searchData, search: e.currentTarget.value })
						}}
						className='bg-white rounded-[10px] px-[15px] py-[8px] text-[#1B1A17]'
					/>
				</div>
				<div className='w-full h-full flex overflow-auto'>
					<div className='min-h-full w-5/8 border-r-[3px] border-[#1b1a17] overflow-auto'>
						<div className='flex flex-col gap-[15px] p-[35px] min-h-full'>
							{newsData ? (
								newsData.map((el: INews) => {
									return (
										<div
											className='w-full p-[20px] flex bg-[#1b1a17] rounded-[10px] gap-[10px]'
											key={el.id}
										>
											<Image
												src={'/icons/avatar.svg'}
												alt=''
												width={40}
												height={40}
												className='h-[100px] w-[100px]'
											/>
											<div className='flex flex-col w-full'>
												<div className='text-[20px]'>{el.tittle}</div>
												<div className='text-[20px]'>
													Дата создания:
													{` ${
														new Date(el.created_at!).getDate() < 10
															? '0' + new Date(el.created_at!).getDate()
															: new Date(el.created_at!).getDate()
													}.${
														new Date(el.created_at!).getMonth() < 10
															? '0' + new Date(el.created_at!).getMonth()
															: new Date(el.created_at!).getMonth()
													}.${new Date(el.created_at!).getFullYear()}`}
												</div>
											</div>
											<div className='flex justify-end items-end gap-[15px]'>
												<Button
													size='s'
													onClick={() =>
														setSidebar(
															<UpdateNews
																id={el.id!}
																setSidebar={setSidebar}
																setUpdate={setUpdate}
																update={update}
															/>
														)
													}
												>
													Редактировать
												</Button>
												<Button
													size='s'
													variant='danger'
													onClick={() =>
														setSidebar(
															<DeleteNews
																id={el.id!}
																setSidebar={setSidebar}
																setUpdate={setUpdate}
																update={update}
															/>
														)
													}
												>
													Удалить
												</Button>
											</div>
										</div>
									)
								})
							) : (
								<>
									<Skeleton className='w-full h-[140px] p-[20px] flex bg-[#1b1a17] rounded-[10px] gap-[10px]' />
									<Skeleton className='w-full h-[140px] p-[20px] flex bg-[#1b1a17] rounded-[10px] gap-[10px]' />
								</>
							)}
						</div>
					</div>
					<div className='h-full w-3/8 flex flex-col items-center overflow-auto p-[35px]'>
						{sidebar}
					</div>
				</div>
			</div>
		</>
	)
}
