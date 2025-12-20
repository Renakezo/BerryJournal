import Image from 'next/image'
import Link from 'next/link'

const Header = () => {
	return (
		<header className='w-screen h-[60px] px-[40px] py-[5px] flex items-center fixed top-0 left-0 font-light'>
			<Link href={'/'} className='flex mr-[50px]'>
				<Image
					src={'/logo.svg'}
					alt='Логотип'
					className='mr-[10px]'
					width={38}
					height={30}
				/>
				<p className='text-[20px]'>BerryJournal</p>
			</Link>

			<nav className='text-[20px]'>
				<Link href={'/tariffs'} className='mr-[25px]'>
					Тарифы
				</Link>
				<Link href={'/contacts'}>Контакты</Link>
			</nav>
		</header>
	)
}

export default Header
