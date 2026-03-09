export const IdElementTypeEnum = {
	FixedText: 'FixedText',
	Random20Bit: 'Random20Bit',
	Random32Bit: 'Random32Bit',
	Random6Digit: 'Random6Digit',
	Random9Digit: 'Random9Digit',
	Guid: 'Guid',
	DateTime: 'DateTime',
	Sequence: 'Sequence',
} as const

export type TIdElementType =
	(typeof IdElementTypeEnum)[keyof typeof IdElementTypeEnum]

export interface IBaseElement {
	id: string
	type: TIdElementType
}

export interface IFixedTextElement extends IBaseElement {
	type: typeof IdElementTypeEnum.FixedText
	value: string
}

export interface INumberElement extends IBaseElement {
	padding?: number
}

export interface IDateTimeElement extends IBaseElement {
	type: typeof IdElementTypeEnum.DateTime
	format: string
}

export type TCustomIdElement =
	| IFixedTextElement
	| (INumberElement & { type: typeof IdElementTypeEnum.Random6Digit })
	| (INumberElement & { type: typeof IdElementTypeEnum.Random9Digit })
	| (INumberElement & { type: typeof IdElementTypeEnum.Sequence })
	| (IBaseElement & { type: typeof IdElementTypeEnum.Random20Bit })
	| (IBaseElement & { type: typeof IdElementTypeEnum.Random32Bit })
	| (IBaseElement & { type: typeof IdElementTypeEnum.Guid })
	| IDateTimeElement
