import * as React from 'react';
import { connect } from 'react-redux';
import { withTheme } from '@twilio/flex-ui';
import styled from 'react-emotion';

// Including this as an example of using react-emotion for styling
// your React components
const ChatWordContainer = styled('div')`
  background: white;
  border-left: 1px solid LightGrey;
  height: 100%;
  width: 100%;
  padding: 10px;
`;

// Including this as another pattern for applying styling to components
const allowedWordStyle = {
  color: 'black'
};

const blockedWordStyle = {
  color: 'red'
};

class LastChatWordTyped extends React.PureComponent {
  render() {
    const blockedWords = [
      'party',
      'jam',
      'wicked',
    ];

    // Variable lastWordTyped passed into props from Redux store using
    // mapStateToProps and Redux 'connect' method below
    let { lastWordTyped } = this.props;
    lastWordTyped = lastWordTyped
      ? lastWordTyped.replace(/\W/g, '').toLowerCase()
      : '';
    console.warn(`${lastWordTyped} in blocked words: ${blockedWords.includes(lastWordTyped)}`);

    return (
      <ChatWordContainer>
        <p>Last chat word typed:</p>
        <p style={
          blockedWords.includes(lastWordTyped)
            ? blockedWordStyle
            : allowedWordStyle
        }>
          {lastWordTyped}
        </p>
      </ChatWordContainer>
    )
  }
}

const mapStateToProps = state => {
  // Invoking the SetComponentState Flex action writes the value passed
  // in to the action to the componentViewStates property at this path
  // https://www.twilio.com/docs/flex/actions-framework#list-of-actions
  const componentViewStates = state.flex.view.componentViewStates;
  const lastChatWordTypedState = componentViewStates && componentViewStates.LastChatWordTyped;
  const lastWordTyped = lastChatWordTypedState && lastChatWordTypedState.lastWordTyped;
  return {
    lastWordTyped
  }
}

export default connect(mapStateToProps)(withTheme(LastChatWordTyped));
