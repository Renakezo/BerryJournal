import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import { ToastContainer } from 'react-toastify'
import { Spinner } from './BJComponents'
import './globals.scss'

const inter = Inter({
	subsets: ['cyrillic', 'latin'],
})

export const metadata: Metadata = {
	title: 'BerryJournal',
	description: 'BerryJournal - цифровая образовательная платформа',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='ru'>
			<body className={`${inter.className} antialiased`}>
				<Suspense
					fallback={
						<div>
							<Spinner size='xl' />
						</div>
					}
				>
					{children}
				</Suspense>
				<ToastContainer
					position='bottom-right'
					autoClose={5000}
					pauseOnFocusLoss
					pauseOnHover
					theme='dark'
				/>
			</body>
		</html>
	)
}
