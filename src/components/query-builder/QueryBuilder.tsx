import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { AddFilterButton, CopyButton, ModalHeader, QueryBuilderModal } from './QueryBuilder.styled';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { IConnectorsString, IRuleGroup } from '../../types';
import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect, useReducer } from 'react'
import toast from 'react-hot-toast';
import { connectors, defaultOptions } from '../../utils/data';
import { QueryFormatterUtil } from '../../utils/formatter';
import ToggleSwitch from '../toggle-switch/ToggleSwitch';
import React from 'react'
import { TextFieldComponent } from '../text-field/TextFieldComponent';
import ChildModal from '../child-modal/ChildModal';
import ModalTabs from '../modal-tabs/ModalTabs';
import BuilderOptionsComponent from '../builder-options/BuilderOptions';
import { useSelectedOptions } from '../../context/SelectedOptions';
import { CloseModal } from '../common/common.styled';
import { checkEmptyOptions } from '../../utils/helpers';
import DeleteIcon from '@mui/icons-material/Delete';

export default function QueryBuilder({ open, setOpen }: any) {
    const { selectedOptions, dispatch } = useSelectedOptions()
    const [outputString, setOutputString] = useState<string>('')
    const [outputObject, setOutputObject] = useState<IRuleGroup>()
    const [conjuction, setConjuction] = useState<IConnectorsString[]>([])
    const [deletedRuleGroupIdx, setDeletedRuleGroupIdx] = useState<number>();
    const contentref = React.useRef<HTMLPreElement>(null)
    
    const { palette: { primary, secondary, grey } } = useTheme()

    useEffect(() => {
        const a = selectedOptions.length-1;
        let lastSelectedOptions = selectedOptions[a][selectedOptions[a].length-1]
        if(conjuction.length < a + 1){
            //this will handle the case of addition of new rule group
            //then add the final conjunction there
            while(conjuction.length < a+1) conjuction.push('AND');
        }
        if(conjuction.length > a+1){
            //there is some ruleGroup that is deleted in this case
            const a = [...conjuction]
            const temp = a.filter((con, idx) => {
                return (idx !== deletedRuleGroupIdx )
            })
            console.log(temp, 'new conjunctions', deletedRuleGroupIdx)
            setConjuction(temp)
            // setConjuction(temp)
        }
        if(!selectedOptions.length)
            dispatch({ type: 'assign', payload: defaultOptions })

        if(lastSelectedOptions.condition || lastSelectedOptions.criteria || lastSelectedOptions.field) {
            const formatter = new QueryFormatterUtil(selectedOptions, conjuction)
            const { outputQueryObject, outputQueryString } = formatter.generateOutputQueryResults()
            setOutputString(outputQueryString)
            setOutputObject(outputQueryObject)
        }

        console.log(outputString, outputObject)  // Query results are logged and also shown in the nested child modal when use clicks on "Finish" button
    }, [selectedOptions, conjuction])

    function handleAddFilter (ruleGroupIndex : number) {
        const lastFilterOptions = selectedOptions[ruleGroupIndex][selectedOptions[ruleGroupIndex].length-1]
        // dispatch({ type: 'add_filter', payload : {RuleGroupIndex : ruleGroupIndex }})
        // return ;
        if(lastFilterOptions.condition && lastFilterOptions.field && lastFilterOptions.criteria) {
            dispatch({ type: 'add_filter', payload : {RuleGroupIndex : ruleGroupIndex }})
        } else {
            toast.error('Complete the previous/current filter first')
        }
    }

    function handleQueryBuilderClose ()  {
        setOpen(false);
        dispatch({ type: 'assign', payload: defaultOptions })
        setOutputString('')
        setOutputObject(undefined)
    }

    function handleCopyToClipboard() {
        const text = contentref.current ? contentref.current.accessKey : ''

        navigator.clipboard.writeText(text)
            .then(() => toast.success("Copied To Clipboard"))
            .catch(() => toast.error("Couldn't copy anything"))
    }

    const AddRuleGroupButton = () => {
        //returning the function to add the rule group
        const { selectedOptions, dispatch } = useSelectedOptions()
        const handleAddingRuleGroup = () => {
            //this will not be having any payload for sure
            dispatch({type:"add_rule_group", payload : {}});
        }
        return <Button sx={{ padding: { md: "15px", xs: '10px', margin: "8px 0 0 8px", 
        textTransform: 'none'}}} onClick={handleAddingRuleGroup}><Typography sx={{padding : '15px', backgroundColor : '#5C61F0', borderRadius : '5px'}} variant='subtitle1'>+ Add New Group Filter</Typography> </Button>
    }   
    
    const DeleteRuleGroupButton = (ruleGroupIdx : number) => {
        //function to delete the given rule group
        //ruleGroupIdx --> rule group index to delete
        const {selectedOptions, dispatch} = useSelectedOptions();
        setDeletedRuleGroupIdx(ruleGroupIdx)
        const handleDeleteGroup = () => {
            console.log("the rule group index is, ", ruleGroupIdx)
            dispatch({type : 'delete_rule_group', payload : {ruleGroupIndex : ruleGroupIdx}});
        }
        if(ruleGroupIdx !== 0)
            return <div><Button sx={{ padding: { md: "10px", xs: '5px',
            textTransform: 'none'}}} onClick={handleDeleteGroup}><Typography sx={{padding : '10px', backgroundColor : '#5C61F0', borderRadius : '5px'}} variant='subtitle1'>Delete Rule Group</Typography></Button></div>
        return <div></div>
    }

    

    const RenderRuleGroup = () => {
        const {selectedOptions, dispatch} = useSelectedOptions();
        return <>
        {
            selectedOptions.map((ruleGroup : any, idx : number) => {
                return (
                    <>
                    <Box sx={{ padding: { md: "20px", xs: '10px' } }}>
                <Box sx={{ backgroundColor: grey['500'], padding: { md: "40px", xs: '10px' }, borderRadius : '7px' }}>
                    <ToggleSwitch style={{ margin: "8px" }} alignment={conjuction[idx]} setAlignment={(target:any)=> {
                        console.log(target)
                        const temp = [...conjuction]
                        temp[idx] = target
                        setConjuction(temp)
                    }} values={connectors} />
                    <BuilderOptionsComponent ruleGroup={ruleGroup} ruleGroupIdx={idx} />
                    <AddFilterButton sx={{ margin: "8px 0 0 8px", textTransform: 'none' }}> 
                        <AddIcon fontSize='small' /> 
                        <Typography variant='subtitle1' onClick={() => {handleAddFilter(idx)}}>Add Filter</Typography>
                    </AddFilterButton>
                    {DeleteRuleGroupButton(idx)}
                </Box>
                </Box>
                </>
                )
            })
        }
        </>
        
    }

    return (
        <QueryBuilderModal
            open={open}
            onClose={handleQueryBuilderClose}
        >  
            <React.Fragment>
                <Grid container>
                    <ModalHeader item xs={12} p="20px">
                        <Typography variant='body1'>{outputString ? 'Build your Query' : 'Create tag and query'}</Typography> 
                        <Typography sx={{fontSize : 'large'}} variant='subtitle2' color={secondary.light}>{
                            outputString ? <TextFieldComponent height="30px" content={`Query: ${outputString}`} readmore={true} /> :"The query you build will be saved in your active view"
                        }</Typography> 
                    </ModalHeader>
                    <Grid item xs={12} sx={{ backgroundColor: primary.dark, marginTop: { md: 0, xs: '100px' } }}>
                            <RenderRuleGroup /> 
                            <AddRuleGroupButton /> 
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', p: { md: '30px', xs: '10px' } }}>
                        <Button sx={{ backgroundColor: grey['400'], color: 'white' }} onClick={handleQueryBuilderClose}>Reset</Button>
                        <ChildModal btncolor={secondary.main} btndisabled={!checkEmptyOptions(selectedOptions[selectedOptions.length - 1])} buttonText="Access your query output">
                            <ModalHeader xs={12} p="20px">
                                <Typography variant='body1'>Access you Query Output</Typography>
                            </ModalHeader>
                            <ModalTabs 
                                content={{
                                    'Query JSON': JSON.stringify(outputObject, null, 2),
                                    'Query String': outputString
                                }} 
                                contentref={contentref}
                            />
                            <CopyButton size='small' sx={{ cursor: 'pointer' }} onClick={handleCopyToClipboard}>Copy</CopyButton>
                        </ChildModal>
                    </Grid>
                    <CloseModal sx={{ cursor: 'pointer' }} titleAccess='Close Query Builder' onClick={handleQueryBuilderClose} />
                </Grid>
            </React.Fragment>
        </QueryBuilderModal>
    ) 
}