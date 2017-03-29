import React from 'react';
import { defineMessages, FormattedMessage, FormattedNumber, FormattedRelative } from 'react-intl';

const messages = defineMessages({
  mainTitle: {
      id: 'main.title',
      defaultMessage: 'Complex web apps made easy',
      description: 'Description in header',
    },
});

let user = {
    name: "Blah",
    unreadCount: 1,
    lastLoginTime:  Date.now() - 1000 * 60 * 60 * 24 * 2,
}

export default class List extends React.Component {

    constructor( props, context ) {
      super( props, context )
      this.state = {
        count: 0,
      }
    }

    _bind = (...methods) => methods.forEach( (method) => this[method] = this[method].bind(this) );
    _handle_OnChange = ( event ) => {}
    _getItem = ( node ) => {}

    render() {
      return (
        <div>
            <FormattedMessage
                id="greeting.welcome_message"
                defaultMessage={`
                    Welcome {name}, you have received {unreadCount, plural,
                        =0 {no new messages}
                        one {{formattedUnreadCount} new message}
                        other {{formattedUnreadCount} new messages}
                    } since {formattedLastLoginTime}.
                `}
                values={{
                    name: <b>{user.name}</b>,
                    unreadCount: user.unreadCount,
                    formattedUnreadCount: (
                        <b>
                            <FormattedNumber value={user.unreadCount} />
                        </b>
                    ),
                    formattedLastLoginTime: (
                        <FormattedRelative value={user.lastLoginTime} />
                    ),
                }}
            />
          <h3><FormattedMessage {...messages.mainTitle} /> list (Total: {this.state.count})</h3>
          <ul>
            {this.props.Viewer.hobbies.edges.map((edge, i) =>
              <li key={i}>{edge.node.title} (ID: {i}): <br/>
                { this._getItem(edge.node) }
              </li>
            )}
          </ul>
          <fieldset>
            <legend>Form</legend>
            Title: <input type="text" ref="title" /><br/>
            <button onClick={this._handle_OnChange.bind(this)}>Add New</button>
          </fieldset>
        </div>
      );
    }
}
