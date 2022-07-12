import React, {ChangeEvent} from 'react';

export type CheckboxPropsType = {
    onChange: (checked: boolean) => void
    checked: boolean
}

const Checkbox = (props: CheckboxPropsType) => {

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked;
        props.onChange(newIsDoneValue)
    }

    return (
        <input type="checkbox" onChange={onChangeHandler} checked={props.checked}/>
    );
};

export default Checkbox;