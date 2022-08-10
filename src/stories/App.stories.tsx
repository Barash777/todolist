import React, {useState} from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import {action} from '@storybook/addon-actions';
import {DecoratorProvider} from './DecoratorProvider';
import App from '../App';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Todolist/App',
    component: App,
    decorators: [DecoratorProvider]
} as ComponentMeta<typeof App>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof App> = () => <App/>;

export const BaseExample = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
BaseExample.args = {
    // task: {id: '1', title: 'test', isDone: false},
    // todolistId: 'a'
};
