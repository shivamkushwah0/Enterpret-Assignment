import { start } from "repl";
import { ACTION_TYPES, ISelectedOptions } from "../types";
import { defaultField, defaultOptions, defaultRule } from "../utils/data";

export function selectedOptionsReducer(
  state: ISelectedOptions[][],
  action: ACTION_TYPES
): ISelectedOptions[][] {
  console.log(action, state)
  //this is actually changing the default rule again and again, idk how
  switch (action.type) {
    case "assign": //done
      return action.payload;
    case "add_filter": // done
      //this needs the index of the rule group as well to add the filter
      var temp_state =[...state]
      console.log(action.payload.RuleGroupIndex)
      temp_state[action.payload.RuleGroupIndex].push({...defaultField, index : temp_state[action.payload.RuleGroupIndex].length })
      console.log(defaultField, 'this is the default field')
      return temp_state;

    case "edit_filter_option":
      var temp_state = [...state]
      console.log(action, 'edit filter option')
      temp_state = temp_state.map((ruleGroup, ruleGroupIndex) => {
        if(ruleGroupIndex !== action.payload.ruleGroupIndex ) return ruleGroup
        const rule_group = ruleGroup.map((rules, ruleIndex) => {
          if(rules.index === action.payload.details.rowIndex ){
            const temp_rule = {...rules}
            temp_rule[action.payload.details.name] = action.payload.details.value
            return temp_rule
          }
          else 
          return rules
        })
        return rule_group;
      })
      console.log(temp_state, 'edit filter option')
      return temp_state;

    case "delete_filter": // done
      //this needs the index of the rule group as well to delete the filter
      //payload --> ruleGroupIndex, filterIndex --> we need both for this mf
      var temp_state = [...state]
      temp_state[action.payload.ruleGroupIndex] = [...state[action.payload.ruleGroupIndex]]
      temp_state[action.payload.ruleGroupIndex] = temp_state[action.payload.ruleGroupIndex].filter((item, idx) => idx != action.payload.filterIndex) 
      return temp_state;

    case "add_rule_group": //done
      //make the concept for adding the rule group
      console.log(defaultRule, 'the default rule')
      const a = [defaultField]
      var temp_state = [...state, a]
      return temp_state

    case "delete_rule_group": //done
      //make the rule for delete the rule group
      //payload --> index => the index of the rule group to delete
      var temp_state = [...state]
      temp_state = temp_state.filter((item, idx) => idx !== action.payload.ruleGroupIndex)
      console.log(action.payload.ruleGroupIndex, temp_state)
      return temp_state;
    default:
      return state;
  }
}
