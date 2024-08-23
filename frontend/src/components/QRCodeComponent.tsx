import React, { useRef, useState } from 'react'
import QRCode from 'qrcode.react'
import html2canvas from 'html2canvas'
import { Button } from '@/components/ui/button'
import { FaDownload, FaQrcode, FaExternalLinkAlt } from 'react-icons/fa'
import { MdRestaurantMenu } from 'react-icons/md'

interface QRCodeComponentProps {
	url: string
	menuName: string
}

const QRCodeComponent: React.FC<QRCodeComponentProps> = ({ url, menuName }) => {
	const qrRef = useRef<HTMLDivElement>(null)
	const [isStyled, setIsStyled] = useState(true)

	const downloadQRCode = async () => {
		if (qrRef.current) {
			const element = isStyled
				? qrRef.current
				: qrRef.current.querySelector('canvas')
			if (element) {
				const canvas = await html2canvas(element)
				const image = canvas
					.toDataURL('image/png')
					.replace('image/png', 'image/octet-stream')
				const link = document.createElement('a')
				link.download = `${menuName}_qrcode.png`
				link.href = image
				link.click()
			}
		}
	}

	const StyledQRCode = () => (
		<div className='relative p-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg shadow-lg'>
			<div className='absolute top-4 left-4 text-white text-2xl'>
				<MdRestaurantMenu />
			</div>
			<div className='bg-white p-4 rounded-lg'>
				<QRCode value={url} size={200} />
			</div>
			<div className='mt-4 text-center text-white font-bold'>{menuName}</div>
			<div className='mt-2 text-center text-white text-sm'>
				Scan to view our menu
			</div>
		</div>
	)

	const PlainQRCode = () => (
		<div>
			<QRCode value={url} size={256} />
		</div>
	)

	return (
		<div className='flex flex-col items-center'>
			<div ref={qrRef}>{isStyled ? <StyledQRCode /> : <PlainQRCode />}</div>
			<div className='mt-4 space-x-2'>
				<Button
					onClick={() => setIsStyled(!isStyled)}
					className='bg-blue-500 hover:bg-blue-600'
				>
					<FaQrcode className='mr-2' />
					{isStyled ? 'Plain QR' : 'Styled QR'}
				</Button>
				<Button
					onClick={downloadQRCode}
					className='bg-green-600 hover:bg-green-700'
				>
					<FaDownload className='mr-2' />
					Download QR Code
				</Button>
			</div>
			<div className='mt-4 text-center'>
				<a
					href={url}
					target='_blank'
					rel='noopener noreferrer'
					className='text-blue-500 hover:text-blue-700 flex items-center justify-center'
				>
					<FaExternalLinkAlt className='mr-2' />
					View Public Menu Page
				</a>
			</div>
		</div>
	)
}

export default QRCodeComponent
