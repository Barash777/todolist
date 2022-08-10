import React, {useState} from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import {AddItemForm} from '../components/AddItemForm';
import {action} from '@storybook/addon-actions';

const addItemFormCallback = action('button clicked')

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Todolist/AddItemForm',
    component: AddItemForm,
    argTypes: {
        addItem: {
            description: 'add item with set title'
        }
    }
} as ComponentMeta<typeof AddItemForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AddItemForm> = (args) => <AddItemForm {...args} />;

export const BaseExample = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
BaseExample.args = {
    addItem: addItemFormCallback
};

export const AddItemFormWithError = () => {
    const setError = (title: string) => {
        addItemFormCallback()
    }

    // setError()

    return <AddItemForm addItem={() => setError('')}/>
}