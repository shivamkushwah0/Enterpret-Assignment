export type IConnectors = '&&' | '||'
export type IConnectorsString = 'AND' | 'OR'
export type IFields = 'Theme' | 'Sub-theme' | 'Reason' | 'Language' | 'Source' | 'Rating' | 'Time Period' | 'Customer ID' | ''
export type IConditions = 'Equals' | 'Does not equal' | 'Like' | 'Not Like' | 'Is Empty' | 'Is' | 'Is Not' | ''
export type ICriteria = 'Offers' | 'Performance' | 'Platform' | 'Product Feedback'

export interface IRule {
    field?: IFields
    condition?: IConditions
    value?: string[]
    type: 'rule'
}

export interface IRuleGroup {
    children: (IRuleGroup | IRule)[]
    conjunction: IConnectorsString
    not: boolean
    type: 'rule_group'
}

export interface IBuilderOptions {
    label: string
    placeholder: string,
    options?: IFields[] | IConditions[] | ICriteria[]
    name: string
}

export interface ISelectedOptions {
    [name: string]: any
    field: IFields, 
    condition: IConditions, 
    criteria: string, 
    index: number,
}


export interface IConditionSymbols {
    [key: string]: string
}

export type ACTION_TYPES = { type: 'add_filter', payload: {RuleGroupIndex : number} } | { type: 'assign', payload: ISelectedOptions[][] } | { type: 'delete_filter', payload: { filterIndex: number, ruleGroupIndex : number } } | { type: 'edit_filter_option', payload: {details : {name: string, value: string, rowIndex: number}, ruleGroupIndex : number}} | {type : 'add_rule_group', payload : {}} | {type : 'delete_rule_group', payload : {ruleGroupIndex : number}} 
