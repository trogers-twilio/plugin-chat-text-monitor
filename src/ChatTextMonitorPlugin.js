import { FlexPlugin } from 'flex-plugin';
import React from 'react';
import LastChatWordTyped from './components/LastChatWordTyped';

const PLUGIN_NAME = 'ChatTextMonitorPlugin';

export default class ChatTextMonitorPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {
    // This replaces the CRM panel (Panel2) with a custom React component
    // https://www.twilio.com/docs/flex/components-add-replace-modify
    flex.AgentDesktopView.Panel2.Content.replace(
      <LastChatWordTyped key="lastChatWordTyped" />
    );

    // The afterSetInputText event is fired after an agent types a character
    // in the chat message box
    flex.Actions.addListener('afterSetInputText', payload => {
      // You can review the Chrome console logs to see the full payload
      // passed into the afterSetInputText callback
      const lastIndex = payload && payload.selectionStart - 1;
      const chatBody = payload && payload.body;
      const lastCharacterTyped = chatBody && chatBody[lastIndex];
      
      // This section checks to see if the agent typed a space, and if so,
      // it captures the last full word typed based on the previous space entered
      if (lastCharacterTyped === ' ') {
        const previousChatBody = payload && payload.channel && payload.channel.inputText;
        let previousSpaceIndex = previousChatBody && previousChatBody.lastIndexOf(' ');
        if (previousSpaceIndex === -1) {
          previousSpaceIndex = 0;
        } else {
          previousSpaceIndex++;
        }
        const lastWordTyped = previousChatBody.slice(previousSpaceIndex);

        // This action can be invoked to use the Flex Redux store to maintain
        // state that can be shared by components
        // https://www.twilio.com/docs/flex/actions-framework#list-of-actions
        flex.Actions.invokeAction('SetComponentState', {
          name: 'LastChatWordTyped',
          state: {
            lastWordTyped
          }
        });
      }
    });

    // The afterWrapupTask event is fired after the End Chat button is clicked
    flex.Actions.addListener('afterWrapupTask', payload => {
      const { task } = payload;
      const {
        taskChannelUniqueName,
        attributes: { name }
      } = task;

      // Since this event can be fired for other types of tasks, it's good
      // practice to make sure your customization applies to this task
      if (taskChannelUniqueName === 'chat') {
        alert(`Ended chat with ${name}`);
      }
    });
  }
}
