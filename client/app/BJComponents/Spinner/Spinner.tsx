import './Spinner.scss'

export interface SpinnerProps {
	size?: 's' | 'm' | 'l' | 'xl'
}

export const Spinner = ({ size = 'l' }: SpinnerProps) => {
	return (
		<div className={['bj-spinner', `bj-spinner--${size}`].join(' ')}>
			<div className='bj-spinner-spinner-dot'></div>
			<div className='bj-spinner-spinner-dot'></div>
			<div className='bj-spinner-spinner-dot'></div>
		</div>
	)
}
