import { ReactElement } from 'react'
import './Button.scss'

export interface ButtonProps {
	variant?:
		| 'normal'
		| 'outlined'
		| 'info'
		| 'success'
		| 'warning'
		| 'danger'
		| 'utility'
		| 'outlined-info'
		| 'outlined-success'
		| 'outlined-warning'
		| 'outlined-danger'
		| 'outlined-utility'
	size?: 's' | 'm' | 'l' | 'xl'
	children: string | ReactElement<any, any>
	disabled?: boolean
	width?: 'auto' | 'max'
	styles?: {}
	onClick?: () => void
	className?: string
	type?: 'button' | 'submit'
}

export const Button = ({
	variant = 'normal',
	size = 'm',
	children,
	width = 'auto',
	styles,
	onClick,
	className,
	type = 'button',
	...props
}: ButtonProps) => {
	return (
		<button
			type={type}
			className={[
				'bj-button',
				`bj-button--${size}`,
				`bj-button--${variant}`,
				`bj-button--${width}`,
				className,
			].join(' ')}
			style={{ ...styles }}
			onClick={onClick}
			{...props}
		>
			{children}
		</button>
	)
}
