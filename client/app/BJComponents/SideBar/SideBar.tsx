import React from 'react'

import './SideBar.scss'

export interface SideBarProps {
	header: string
	logo?: string
	menuItems?: React.ReactNode[]
	footerItem?: React.ReactNode
}

export const SideBar: React.FC<SideBarProps> = ({
	header,
	logo,
	menuItems = [],
	footerItem,
}) => {
	return (
		<div className='bj-sidebar'>
			<div className='bj-sidebar--header'>
				{logo && (
					<img src={logo} alt='Logo' className='bj-sidebar--header-logo' />
				)}
				{header && <h2 className='bj-sidebar--header-title'>{header}</h2>}
			</div>

			<div className='bj-sidebar--body'>
				{menuItems.map((item, index) => (
					<div key={index} className='bj-sidebar--body-menu-item'>
						{item}
					</div>
				))}
			</div>

			{footerItem && <div className='bj-sidebar--footer'>{footerItem}</div>}
		</div>
	)
}
