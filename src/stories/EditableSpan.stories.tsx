import React, {useState} from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import {action} from '@storybook/addon-actions';
import {EditableSpan} from '../components/EditableSpan';

const cb = action('changed')

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Todolist/EditableSpan',
    component: EditableSpan,
} as ComponentMeta<typeof EditableSpan>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof EditableSpan> = (args) => <EditableSpan {...args} />;

export const BaseExample = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
BaseExample.args = {
    value: 'test',
    onChange: cb
};
