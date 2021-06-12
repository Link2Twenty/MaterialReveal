import React from 'react';
import './App.css';

import Icon from './components/icons';
import MaterialReveal from './components/MaterialReveal';

import styled from 'styled-components';

const TitleSpan = styled.span`
  display: block;
  font-weight: 600;
  font-size: 1.3em;
  margin: 0;
  margin-bottom: 0.5em;
  color: #212121;
`;

function App() {
  return (
    <aside>
      <MaterialReveal
        variant="warn"
        actions={[
          {
            title: 'delete',
            icon: <Icon type="delete" />,
            action: () => {},
          },
        ]}
      >
        <TitleSpan>Delete notification</TitleSpan>
        <span style={{ color: '#616161' }}>
          This colour implies there is something bad that could happen, in this case it's a delete function.
        </span>
      </MaterialReveal>
      <MaterialReveal
        variant="info"
        actions={[
          {
            title: 'Open folder',
            icon: <Icon type="folder" />,
            action: () => {},
          },
          {
            title: 'download',
            icon: <Icon type="download" />,
            action: () => {},
          },
        ]}
      >
        <TitleSpan>Info or Action notification</TitleSpan>
        <span style={{ color: '#616161' }}>
          This blue is an 'indifferent' colour meaning this is just to let you know or let you perform some action.
        </span>
      </MaterialReveal>
      <MaterialReveal
        variant="success"
        actions={[
          {
            title: 'confirm',
            icon: <Icon type="confirm" />,
            action: () => {},
          },
        ]}
      >
        <TitleSpan>Success notification</TitleSpan>
        <span style={{ color: '#616161' }}>
          The green implies there was a success and all there is left to do is acknowledge it.
        </span>
      </MaterialReveal>
    </aside>
  );
}

export default App;
