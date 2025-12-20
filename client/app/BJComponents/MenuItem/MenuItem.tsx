import { MouseEventHandler } from 'react'
import './MenuItem.scss'

export interface MenuItemProps {
	logo?: string
	title: string
	isActive?: boolean
	onClick?: MouseEventHandler
}

export const MenuItem = ({
	logo = 'logo',
	title,
	isActive = false,
	...props
}: MenuItemProps) => {
	return (
		<div
			className={['bj-menu-item', `${isActive && 'bj-menu-item-select'}`].join(
				' '
			)}
			{...props}
		>
			<img src={logo} alt={title} className='bj-menu-item-img' />
			<p className='bj-menu-item-title'>{title}</p>
		</div>
	)
}
