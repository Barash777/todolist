import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

// import {action} from '@storybook/addon-actions';
import Task from '../../components/Todolists/Task/Task';
import {DecoratorProvider} from './DecoratorProvider';
import {useSelector} from 'react-redux';
import {AppStateType} from '../../app/store';
import {DomainTaskType} from '../../components/Todolists/tasks-reducer';

// const cb = action('button clicked')

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Todolist/Task',
    component: Task,
    decorators: [DecoratorProvider]
} as ComponentMeta<typeof Task>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Task> = (args) => <Task {...args} />;

/*export const BaseExample = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
BaseExample.args = {
    task: useSelector<AppStateType, TaskType>(state => state.tasks['todolistId1'][0]),
    todolistId: 'todolistId1'
};*/

export const BaseExample = () => {
    const task = useSelector<AppStateType, DomainTaskType>(state => state.tasks['todolistId1'][0]);
    const todolistId = 'todolistId1'

    return <Task task={task} todolistId={todolistId}/>
}
