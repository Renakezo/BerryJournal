import './Skeleton.scss'

export interface SkeletonProps {
	style?: {}
	className?: string
}

export const Skeleton = ({ style, className }: SkeletonProps) => {
	return <div className={`bj-skeleton ${className}`} style={style}></div>
}
