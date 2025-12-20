import React from 'react'
import './Breadcrumbs.scss'

export interface BreadcrumbsProps {
	children: React.ReactNode[]
	separator?: string
	router?: React.ReactNode[]
	style?: {}
}

const Breadcrumbs = ({
	children: crumbs,
	style,
	separator,
}: BreadcrumbsProps) => {
	return (
		<div className='bj-breadcrumbs' style={style}>
			{crumbs.map((crumb, index) => (
				<React.Fragment key={index}>
					{crumb}
					{index < crumbs.length - 1 && (
						<span className='bj-breadcrumbs-separator'>
							{separator ? separator : '/'}
						</span>
					)}
				</React.Fragment>
			))}
		</div>
	)
}

export default Breadcrumbs
