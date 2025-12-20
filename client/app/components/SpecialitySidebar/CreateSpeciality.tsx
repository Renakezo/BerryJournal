'use client'

import { Button, Spinner } from '@/app/BJComponents'
import { ISpeciality } from '@/app/types/types'
import { serverAPI } from '@/app/utils/axios'
import dynamic from 'next/dynamic'
import { Dispatch, useState } from 'react'
import { toast } from 'react-toastify'

const Select = dynamic(() => import('react-select'), { ssr: false })

interface CreateSpecialityProps {
	setUpdate: Dispatch<boolean>
	update: boolean
	setSidebar: Dispatch<any>
}

const CreateSpeciality = ({
	setUpdate,
	update,
	setSidebar,
}: CreateSpecialityProps) => {
	const [specialityData, setSpecialityData] = useState<ISpeciality>({
		name: '',
	})

	const customStyles = {
		control: (provided: any) => ({
			...provided,
			backgroundColor: 'white',
			borderRadius: '10px',
			padding: '2px',
			boxShadow: 'none',
			border: '1px solid #ccc',
			'&:hover': {
				border: '1px solid #aaa',
			},
		}),
		menu: (provided: any) => ({
			...provided,
			marginTop: '5px',
		}),
		option: (provided: any, state: any) => ({
			...provided,
			color: '#1B1A17',
			padding: '10px',
			backgroundColor: state.isFocused ? '#f0f0f0' : 'white',
		}),
		singleValue: (provided: any) => ({
			...provided,
			color: '#1B1A17',
			fontSize: '18px',
		}),
	}

	const createSpeciality = () => {
		if (specialityData.name == '') {
			return toast('Заполните все поля!', {
				type: 'error',
			})
		}
		serverAPI
			.post('/admin/addSpeciality', specialityData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			})
			.then(e => {
				toast('Специальность добавлена', {
					type: 'success',
				})
				setSidebar(<Spinner />)
				setUpdate(!update)
			})
			.catch(e => {
				toast(e.response.data.error, {
					type: 'error',
				})
			})
	}

	return (
		<form
			onSubmit={e => {
				e.preventDefault()
				createSpeciality()
			}}
			className='flex flex-col items-center justify-between h-full'
		>
			<div className='flex flex-col items-center'>
				<h3 className='text-[25px] mb-[30px] mx-[10px]'>
					Добавление специальности
				</h3>
				<div className='w-full flex flex-col mb-[20px]'>
					<label htmlFor='' className='text-[20px] mb-[5px]'>
						Наименование
					</label>
					<input
						type='text'
						onChange={e => {
							setSpecialityData({
								...specialityData,
								name: e.currentTarget.value,
							})
						}}
						className='bg-white rounded-[10px] px-[15px] py-[8px] text-[18px] text-[#1B1A17]'
					/>
				</div>
			</div>
			<Button width='max' type='submit'>
				Сохранить
			</Button>
		</form>
	)
}

export default CreateSpeciality
