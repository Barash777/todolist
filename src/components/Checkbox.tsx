import React, {ChangeEvent} from 'react';

export type CheckboxPropsType = {
    onChange: (checked: boolean) => void
    checked: boolean
}

const Checkbox = React.memo((props: CheckboxPropsType) => {
    console.log('Checkbox')

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked;
        props.onChange(newIsDoneValue)
    }

    return (
        <input type="checkbox" onChange={onChangeHandler} checked={props.checked}/>
    );
});

export default Checkbox;