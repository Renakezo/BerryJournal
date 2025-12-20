import './FooterItem.scss'

export interface FooterItemProps {
	avatar: string
	name: string
	role: string
	logoutIcon?: string
	onClick?: () => void
}

export const FooterItem = ({
	avatar,
	name,
	role,
	logoutIcon = '/icons/logout.svg',
	onClick,
}: FooterItemProps) => {
	return (
		<div className='bj-menu-footer'>
			<div className='bj-menu-footer--user'>
				<img src={avatar} alt={name} className='bj-menu-footer--user-image' />
				<div className='bj-menu-footer--user--right'>
					<p className='bj-menu-footer--user--right-name'>{name}</p>
					<p className='bj-menu-footer--user--right-role'>{role}</p>
				</div>
			</div>
			<div className='bj-menu-footer--logout' onClick={onClick}>
				<img
					src={logoutIcon}
					alt='logout'
					className='bj-menu-footer--logout-img'
				/>
			</div>
		</div>
	)
}
