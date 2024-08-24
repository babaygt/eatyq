import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'

const currencies = [
	{ value: '$', label: '$ (USD)', searchTerms: ['usd', 'dollar', 'us'] },
	{ value: '€', label: '€ (EUR)', searchTerms: ['eur', 'euro'] },
	{ value: '£', label: '£ (GBP)', searchTerms: ['gbp', 'pound', 'uk'] },
	{ value: '₺', label: '₺ (TRY)', searchTerms: ['try', 'lira', 'turkish'] },
	{ value: '¥', label: '¥ (JPY)', searchTerms: ['jpy', 'yen', 'japanese'] },
	{ value: '₩', label: '₩ (KRW)', searchTerms: ['krw', 'won', 'korean'] },
]

interface CurrencyComboboxProps {
	value: string
	onChange: (value: string) => void
}

export function CurrencyCombobox({ value, onChange }: CurrencyComboboxProps) {
	const [open, setOpen] = React.useState(false)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					role='combobox'
					aria-expanded={open}
					className='w-full justify-between'
				>
					{value
						? currencies.find((currency) => currency.value === value)?.label
						: 'Select currency...'}
					<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-[200px] p-0'>
				<Command
					filter={(value, search) => {
						if (!search) return 1
						const item = currencies.find((c) => c.value === value)
						if (!item) return 0
						const searchLower = search.toLowerCase()
						return item.value.toLowerCase().includes(searchLower) ||
							item.label.toLowerCase().includes(searchLower) ||
							item.searchTerms.some((term) => term.includes(searchLower))
							? 1
							: 0
					}}
				>
					<CommandInput placeholder='Search currency...' />
					<CommandList>
						<CommandEmpty>No currency found.</CommandEmpty>
						<CommandGroup>
							{currencies.map((currency) => (
								<CommandItem
									key={currency.value}
									value={currency.value}
									onSelect={(currentValue) => {
										onChange(currentValue === value ? '' : currentValue)
										setOpen(false)
									}}
								>
									<Check
										className={cn(
											'mr-2 h-4 w-4',
											value === currency.value ? 'opacity-100' : 'opacity-0'
										)}
									/>
									{currency.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
