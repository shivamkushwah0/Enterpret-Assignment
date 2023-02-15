import React from 'react'
import { BuilderOptions } from './BuilderOptions.styled'
import { ACTION_TYPES, ISelectedOptions } from '../../types'
import { builderOptions } from '../../utils/data'
import BuilderSelectComponent from '../builder-select/BuilderSelect'
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useSelectedOptions } from '../../context/SelectedOptions'

const handleDeleteFilter = (ruleGroupIndex : number, filterIndex : number, dispatch : any) => {
    //function to handle the delete filter
    dispatch({type : 'delete_filter', payload : {ruleGroupIndex : ruleGroupIndex, filterIndex : filterIndex}})
}

function ShowRuleGroup(props : any){
    //component to show one rule group
    // ruleGroup={props.ruleGroup} ruleGroupIdx={props.ruleGroupIdx}
    const { selectedOptions, dispatch } = useSelectedOptions()
    console.log(props, "these are the props")
   return (<>{
        props.ruleGroup.map((val : any, fieldIdx : number) => 
            {
            console.log(val)
            return <> 
                <BuilderOptions key={props.ruleGroupIdx} sx = {{padding : '10px'}}>
                {builderOptions.map( (options : any) => { 
                return <BuilderSelectComponent 
                    key={options.label}
                    rowIndex={fieldIdx} 
                    options={options}
                    ruleGroupIdx = {props.ruleGroupIdx} 
                />
                })
                }
                <Button onClick={() => handleDeleteFilter(props.ruleGroupIdx, fieldIdx, dispatch)}>{fieldIdx != 0 && <DeleteIcon sx={{ color: 'white' }} />}</Button> 
                </BuilderOptions>
            </>
            })}
            </>)
}


export default function BuilderOptionsComponent(props : any) {
    console.log(props, "343")
    return (
    <React.Fragment>
        {
            <ShowRuleGroup ruleGroup={props.ruleGroup} ruleGroupIdx={props.ruleGroupIdx}/>        
        }
    </React.Fragment>
  )
}
