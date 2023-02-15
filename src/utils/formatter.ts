import { IConditions, IConnectorsString, ICriteria, IFields, IRule, IRuleGroup, ISelectedOptions } from "../types";
import _ from 'lodash'
import { conditionSymbols, Connectors } from "./data";
import { updateJsxSelfClosingElement } from "typescript";

export class QueryFormatterUtil {
    constructor(public selectedOptions: ISelectedOptions[][], public connector: IConnectorsString[]) {}

    useConnectors (field : IFields, condition : IConditions, value : ICriteria ) {
        //this will be used to make the connector for a given single rule
        if(condition === "Equals") return `field.${field}==`+`\"${value}\"`;
        else if (condition === 'Does not equal') return `field.${field}!=`+`\"${value}\"`
        else if(condition == 'Is') return `field.${field}.Is(`+`\"${value}\"`+')'
        else if(condition == 'Is Not') return `field.${field}.IsNot(`+`\"${value}\"`+')'
        else if (condition == 'Is Empty') return `field.${field}.IsEmpty()`
        else if(condition == 'Like') return `field.${field}.IsLike(`+`\"${value}\"`+')'
        return `field.${field}.NotLike(`+`\"${value}\"`+')'
    }

    getSingleRule(rule : any) {
        //function to give the query string for a single rule
        return this.useConnectors(rule['field'], rule['condition'], rule['value'] )
    }

    getQueryString(output : IRuleGroup | IRule) {
        //this will use the recursion form
        
        var queryString = ''
        if(output.type === 'rule_group'){
            output.children.map((child : any, idx : number) => {
                queryString +='('+this.getQueryString(child)+')'
                if(idx != output.children.length-1)
                    queryString += Connectors[output.conjunction];
            })
        }
        else return this.getSingleRule(output)
        return queryString
    }

    getRuleGroup(): any {
        const temp  = this.selectedOptions.map((ruleGroup, idx) => {
            const temp_group = ruleGroup.map(rule => {
                return {
                    field : rule['field'] ,
                    condition : rule['condition'] ,
                    value : rule['criteria'],
                    type : 'rule'
                }
            })
            return {
                children : temp_group,
                conjunction : this.connector[idx],
                not : true,
                type : 'rule_group'
            }
        })
        console.log(temp, "final query in JSON")
        return {
            children : temp, 
            conjunction : 'OR',
            not : true,
            type : 'rule_group'
        }
    }

    generateOutputQueryResults() {
        const outputQueryObject = this.getRuleGroup()
        const outputQueryString = this.getQueryString(outputQueryObject)
        console.log(outputQueryObject,outputQueryString) 
        return {
            outputQueryObject,
            outputQueryString
        }
    }
}