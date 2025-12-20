'use client'

import { Button, Skeleton, Spinner } from '@/app/BJComponents'
import CreateSubjectForGroup from '@/app/components/SubjectForGroupSidebar/CreateSubjecForGroup'
import DeleteSubjectForGroup from '@/app/components/SubjectForGroupSidebar/DeleteSubjectForGroup'
import UpdateSubjectForGroup from '@/app/components/SubjectForGroupSidebar/UpdateSubjectForGroup'
import { useDebounce } from '@/app/hooks/useDebaunce'
import { IDataForSubject, ISubjectGroup } from '@/app/types/types'
import { serverAPI } from '@/app/utils/axios'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function SubjectsForGroups() {
	const [subjectData, setSubjectData] = useState<any>()
	const [dataForSubject, setDataForSubject] = useState<IDataForSubject>()
	const [update, setUpdate] = useState<boolean>(false)
	const [searchData, setSearchData] = useState<{
		search: string
	}>({
		search: '',
	})
	const debouncedSearch = useDebounce(searchData.search, 500)
	const [sidebar, setSidebar] = useState<any>(<Spinner />)

	const getSubjectData = () => {
		const usersParams = new URLSearchParams()
		searchData.search != '' && usersParams.set('search', searchData.search)
		serverAPI
			.get('/admin/getAllSubjectsForGroups?' + usersParams.toString(), {
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
			})
			.then(e => {
				setSubjectData(e.data.message)

				serverAPI
					.get('/admin/getAllDataForSubjects', {
						headers: {
							Authorization: 'Bearer ' + localStorage.getItem('token'),
						},
					})
					.then(el => {
						setDataForSubject(el.data.message)
						setSidebar(
							<CreateSubjectForGroup
								setUpdate={setUpdate}
								update={update}
								dataForSubject={el.data.message}
								setSidebar={setSidebar}
							/>
						)
					})
			})
	}

	useEffect(() => {
		getSubjectData()
	}, [update])

	useEffect(() => {
		getSubjectData()
	}, [debouncedSearch])

	return (
		<>
			<div className='flex justify-between pb-[30px]'>
				<h2 className='text-[32px]'>Предметы у групп</h2>
				<Button
					size='m'
					onClick={() =>
						setSidebar(
							<CreateSubjectForGroup
								setUpdate={setUpdate}
								update={update}
								dataForSubject={dataForSubject!}
								setSidebar={setSidebar}
							/>
						)
					}
				>
					Добавить предмет для группы
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
							{subjectData ? (
								subjectData.map((el: ISubjectGroup) => {
									return (
										<div
											key={el.id}
											className='w-full p-[20px] flex bg-[#1b1a17] rounded-[10px] gap-[10px]'
										>
											<Image
												src={'/icons/avatar.svg'}
												alt=''
												width={40}
												height={40}
												className='h-[100px] w-[100px]'
											/>
											<div className='flex flex-col justify-between w-full'>
												<div className='text-[20px] flex'>
													Предмет: {el.subject.name}
												</div>
												<div className='text-[20px] flex'>
													Группа: {el.group.name}
												</div>
												<div className='text-[20px] flex'>
													Преподаватель: {el.teacher.surname} {el.teacher.name}{' '}
													{el.teacher.patronymic ? el.teacher.patronymic : ''}
												</div>
											</div>
											<div className='flex justify-end items-end gap-[15px]'>
												<Button
													size='s'
													onClick={() =>
														setSidebar(
															<UpdateSubjectForGroup
																id={el.id!}
																setSidebar={setSidebar}
																setUpdate={setUpdate}
																dataForSubject={dataForSubject!}
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
															<DeleteSubjectForGroup
																id={el.id!}
																setSidebar={setSidebar}
																setUpdate={setUpdate}
																dataForSubject={dataForSubject!}
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
