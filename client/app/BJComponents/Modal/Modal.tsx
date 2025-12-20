import Image from 'next/image'
import React from 'react'
import './Modal.scss'

export interface ModalProps {
	open?: boolean
	title?: string
	titlePosition?: 'left' | 'center' | 'right'
	modalPosition?: 'up' | 'center' | 'down'
	children: React.ReactNode
	footer: React.ReactNode[]
	closeButtonClick?: () => void
}

export const Modal = ({
	open,
	children,
	title,
	titlePosition = 'left',
	modalPosition = 'center',
	footer,
	closeButtonClick,
}: ModalProps) => {
	return (
		<>
			{open && (
				<div className={['bj-modal', `bj-modal--${modalPosition}`].join(' ')}>
					<div className='bj-modal-content'>
						{closeButtonClick && (
							<div className='bj-modal-close cursor-pointer'>
								<Image
									src={'/icons/close.svg'}
									alt='Закрыть'
									width={18}
									height={18}
									onClick={closeButtonClick}
								/>
							</div>
						)}
						{title && (
							<h2
								className={[
									'bj-modal-content-title',
									`bj-modal-content-title--${titlePosition}`,
								].join(' ')}
							>
								{title}
							</h2>
						)}
						<div className='bj-modal-content-text'>{children}</div>
						<div className='bj-modal-content-footer'>
							{footer.map((el, index) => {
								return <React.Fragment key={index}>{el}</React.Fragment>
							})}
						</div>
					</div>
				</div>
			)}
		</>
	)
}
