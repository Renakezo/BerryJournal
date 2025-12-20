import { serverAPI } from '@/app/utils/axios'

const JournalContextMenu = ({
	position,
	data,
	getJournal,
}: {
	position: { x: number; y: number }
	data: {
		date_id: string
		student_id: string
		isSkip: Boolean
	}
	getJournal: () => void
}) => {
	const skipFetch = () => {
		serverAPI
			.post(
				`${data.isSkip ? '/teacher/removeSkip' : '/teacher/addSkip'}`,
				{
					student_id: data.student_id,
					date_id: data.date_id,
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

	return (
		<div
			className={`bg-[#1B1A17] rounded-[10px] border-2 border-[#000] fixed p-[15px] hover:bg-[#262521] cursor-pointer`}
			onContextMenu={e => e.preventDefault()}
			style={{ top: `${position.y}px`, left: `${position.x}px` }}
			onClick={() => skipFetch()}
		>
			{data.isSkip ? 'Удалить неявку' : 'Добавить неявку'}
		</div>
	)
}

export default JournalContextMenu
