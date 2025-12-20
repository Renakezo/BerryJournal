import React from 'react'
import './Badge.scss'

export interface BadgeProps {
	children: React.ReactNode
}

export const Badge = ({ children }: BadgeProps) => {
	return (
		<div className={['bj-badge'].join(' ')}>
			{children}
			<div className='bj-badge-point'></div>
		</div>
	)
}
