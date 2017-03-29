import React from 'react';
import Relay from 'react-relay';
import HobbiesList from './units/Hobbies';
import Viewer_updateMutation from './units/viewerUpdateMutation';

import {addLocaleData, IntlProvider, FormattedRelative, FormattedTime, FormattedDate, FormattedNumber } from 'react-intl';
import en from 'react-intl/locale-data/en';
import fr from 'react-intl/locale-data/fr';

// This example app only uses English. A fake `"en-UPPER"` locale is created so
// translations can be emulated.
addLocaleData([...en, ...fr]);

const DEFAULT_LOCALE = "en";

/*const formatTranslationMessages = (locale, messages) => {
  const defaultFormattedMessages = locale !== DEFAULT_LOCALE
    ? formatTranslationMessages(DEFAULT_LOCALE, localeData["en"])
    : {};
  return Object.keys(messages).reduce((formattedMessages, key) => {
    const formattedMessage = !messages[key] && locale !== DEFAULT_LOCALE
      ? defaultFormattedMessages[key]
      : messages[key];
    return Object.assign(formattedMessages, { [key]: formattedMessage });
  }, {});
};

const translationMessages = {
      en: formatTranslationMessages('en', localeData["en"]),
      fr: formatTranslationMessages('fr', localeData["fr"]),
    };
*/
//console.log( "Translated", translationMessages[localeProp] );
//let messagesProp = localeData[localeProp] ; //translationMessages[localeProp];

class App extends React.Component {

    static contextTypes = {
      relay: Relay.PropTypes.Environment,
    }

    _handleSetLocale(locale, evt) {
      // Increments the number of stories being rendered by 10.
    //   console.log("Relay", this.props);
    //   console.log("Language Set request", locale);
      /*this.props.relay.setVariables({
        lang: "en"
    });*/
      this.context.relay.commitUpdate(
          new Viewer_updateMutation( {
            Viewer: this.props.Viewer,
            lang: locale
          } )
        )
    }

  render() {
      console.log(this.props.Viewer);

      let messages = {};
      let localeProp = this.props.Viewer.lang || "en";
      if( this.props.Viewer && this.props.Viewer.intl.length  > 0 && this.props.Viewer.intl[0].message ) {
          messages = this.props.Viewer.intl.reduce((msgs, {id, message}) => {
              msgs[id] = message; // eslint-disable-line no-param-reassign
              return msgs;
        }, {});
      }
      var postDate    = Date.now() - (1000 * 60 * 60 * 24);
      var commentDate = Date.now() - (1000 * 60 * 60 * 2);
      var meetingDate = Date.now() + (1000 * 60 * 51);
      var yesterday = Date.now() - (1000 * 60 * 60 * 24);

      console.log("Messages", messages);
    return (
        <IntlProvider
                    defaultLocale="en"
                    locale={localeProp}
                    key={localeProp}
                    messages={messages}>
            <div>
                Changed Language to:
                 <button onClick={this._handleSetLocale.bind(this, "en")}> -- English -- </button>&nbsp;&nbsp;
                 <button onClick={this._handleSetLocale.bind(this, "fr")}> -- French -- </button>
                 <br/><br/>
                 
                <strong>Lang: </strong>{this.props.Viewer.lang}<br/>
                <strong>Date: </strong>
                <FormattedDate
                   value={new Date()}
                   day="numeric"
                   month="long"
                   year="numeric" /><br/>
               <strong>Time:</strong>
               <ul>
                   <li><FormattedRelative value={postDate} /></li>
                   <li><FormattedRelative value={commentDate} /></li>
                   <li><FormattedRelative value={meetingDate} /></li>
                   <li><strong>Currency: </strong><FormattedNumber value={1400.34} style='currency' currency='CAD' currencyDisplay='symbol' /></li>
                    <li><FormattedDate value={1390518044403} year='numeric' month='long' day='2-digit' /></li>
                    <li><FormattedTime value={new Date()} /></li>
                    <li><FormattedRelative value={yesterday} units="hour" /></li>
               </ul><br/>
                <HobbiesList Viewer={this.props.Viewer} />
            </div>
        </IntlProvider>
    )
  }
}

export default Relay.createContainer(App, {
  initialVariables: {
      lang: "fr"
  },
  prepareVariables: prevVariables => {
    return {
      ...prevVariables,
      // If devicePixelRatio is `2`, the new size will be `100`.
      //lang: prevVariables.lang ,
    };
  },
  fragments: {
    Viewer: () => Relay.QL`
      fragment on Viewer {
        id,
        lang,
        intl {
            id,
            message,
        },
        ${Viewer_updateMutation.getFragment('Viewer')},
        ${HobbiesList.getFragment('Viewer')},
      }
    `,
  },
});
