import type { Metadata } from 'next'

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
		<div className='p-[40px] flex flex-col w-full max-h-screen overflow-auto'>
			{children}
		</div>
	)
}
