import React from 'react'
import './Breadcrumbs.scss'

export interface BreadcrumbsItemProps {
	children: React.ReactNode
	href?: string
	onClick?: () => void
	style?: {}
	disabled?: boolean
}

const BreadcrumbsItem = ({
	children,
	style,
	href,
	disabled,
	...props
}: BreadcrumbsItemProps) => {
	return (
		<>
			{href ? (
				<a
					className={[
						'bj-breadcrumbs-crumb',
						disabled ? 'bj-breadcrumbs-crumb--disabled' : '',
					].join(' ')}
					href={href}
					{...props}
				>
					{children}
				</a>
			) : (
				<span
					className={[
						'bj-breadcrumbs-crumb',
						disabled ? 'bj-breadcrumbs-crumb--disabled' : '',
					].join(' ')}
					{...props}
				>
					{children}
				</span>
			)}
		</>
	)
}
{
}
export default BreadcrumbsItem
