export const InventoryFieldTypeEnum = {
	SINGLE_LINE: 'SINGLE_LINE',
	MULTI_LINE: 'MULTI_LINE',
	NUMBER: 'NUMBER',
	LINK: 'LINK',
	BOOLEAN: 'BOOLEAN',
} as const

export type InventoryFieldTypeEnum =
	(typeof InventoryFieldTypeEnum)[keyof typeof InventoryFieldTypeEnum]

export interface IInventoryField {
	id: string
	inventoryId: string
	type: InventoryFieldTypeEnum
	title: string
	description: string
	showInTable: boolean
	order: number
	createdAt: string
}

export interface ICreateInventoryFieldDto {
	inventoryId: string
	type: InventoryFieldTypeEnum
	title: string
	description: string
	showInTable: boolean
	order: number
}

export interface IUpdateInventoryFieldDto {
	type: InventoryFieldTypeEnum
	title: string
	description: string
	showInTable: boolean
	order: number
}
