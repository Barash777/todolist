import {FilterValuesType} from '../App';

export const FilterReducer = (state: FilterValuesType, action: AllActionsType) => {
    switch (action.type) {
        case 'CHANGE-FILTER': {
            // state = action.payload.value;
            // return state;
            return action.payload.value
        }
        default: {
            return state
        }
    }
}

type AllActionsType = changeFilterACType;

type changeFilterACType = ReturnType<typeof changeFilterAC>
export const changeFilterAC = (value: FilterValuesType) => {
    return {
        type: 'CHANGE-FILTER',
        payload: {
            value
        }
    } as const
}


