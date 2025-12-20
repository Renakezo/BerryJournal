'use client'

import { Spinner } from '@/app/BJComponents'
import { INews } from '@/app/types/types'
import { serverAPI } from '@/app/utils/axios'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

export default function News() {
	const { id } = useParams()
	const router = useRouter()
	const [newsData, setNewsData] = useState<INews>()

	const getData = async () => {
		serverAPI
			.get(`/getNews/${id}`, {
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
			})
			.then(e => {
				setNewsData(e.data.message)
			})
			.catch(e => {
				router.push('/main')
			})
	}

	useEffect(() => {
		getData()
	}, [])

	return (
		<>
			<div className='p-[40px] flex flex-col w-full max-h-screen overflow-auto'>
				{newsData ? (
					<div>
						<h2 className='text-[32px] pb-[30px]'>{newsData.tittle}</h2>
						<div className='w-full h-full flex flex-col bg-[#232523] overflow-auto max-h-auto rounded-[10px] p-[20px]'>
							<div className='prose prose-lg max-w-none prose-invert'>
								<ReactMarkdown>{newsData.content}</ReactMarkdown>
							</div>
						</div>
					</div>
				) : (
					<Spinner size='m' />
				)}
			</div>
		</>
	)
}
