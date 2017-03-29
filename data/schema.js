/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

import {
  // Import methods that your schema can use to interact with your database
  User,
  Widget,
  getUser,
  getViewer,
  getWidget,
  getWidgets,
  setLang,
} from './database';

import { join } from 'path';
import fs from 'fs';
import Promise from 'bluebird';
//import IntlMessageType from '../types/IntlMessageType';

// A folder with messages
const CONTENT_DIR = join(__dirname, './messages');
const readFile = Promise.promisify(fs.readFile);

function readLocaleFile(locale){

}
//console.log("Content Dir", CONTENT_DIR);

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    if (type === 'User') {
      return getUser(id);
    } else if (type === 'Widget') {
      return getWidget(id);
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof User) {
      return userType;
    } else if (obj instanceof Widget)  {
      return widgetType;
    } else if (obj instanceof Address)  {
      return addressType;
    } else {
      return null;
    }
  }
);

/**
 * Define your own types here
 */
var faction = {
    hobbies: [
      { id: 1, title:"Cricket" },
      { id: 2, title: "Reading" },
      { id: 3, title: "Traveling" }
    ]
}

var hobbyType = new GraphQLObjectType({
  name: 'Hobby',
  description: 'A user hobbies',
  fields: () => ({
    id: globalIdField('Widget'),
    title: {
      type: GraphQLString,
      description: 'Hobby Type',
    },
  }),
  interfaces: [nodeInterface],
});

const IntlMessageType = new GraphQLObjectType({
  name: 'translation',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    defaultMessage: { type: new GraphQLNonNull(GraphQLString) },
    message: { type: GraphQLString },
    description: { type: GraphQLString },
    files: { type: new GraphQLList(GraphQLString) },
  },
});

/**
 * Define your own connection types here
 */

var {connectionType: hobbyConnection} =
connectionDefinitions({name: 'Hobbies', nodeType: hobbyType});

/*const localeData = {
   en:[
     {
       "id": "main.title",
       "description": "Description in header",
       "defaultMessage": "Complex web apps made easy",
       "message": "Complex web apps made easy - English"
     },
     {
       "id": "greeting.welcome_message",
       "defaultMessage": "Welcome {name}, you have received {unreadCount, plural, =0 {no new messages} one {{formattedUnreadCount} new message} other {{formattedUnreadCount} new messages}} since {formattedLastLoginTime}.",
       "message": "Welcome {name}, you have received {unreadCount, plural, =0 {no new messages} one {{formattedUnreadCount} new message} other {{formattedUnreadCount} new messages}} since {formattedLastLoginTime}."
     }
   ],
    fr:[
      {
        "id": "main.title",
        "description": "Description in header",
        "defaultMessage": "Complex web apps made easy",
        "message": "Complex web apps made easy - French"
      },
      {
        "id": "greeting.welcome_message",
        "defaultMessage": "Bienvenue {name}, vous avez reçu {unreadCount, plural, =0 {no new messages} one {{formattedUnreadCount} new message} other {{formattedUnreadCount} message neuf}} depuis {formattedLastLoginTime}.",
        "message": "Bienvenue {name}, vous avez reçu {unreadCount, plural, =0 {no new messages} one {{formattedUnreadCount} new message} other {{formattedUnreadCount} message neuf}} depuis {formattedLastLoginTime}."
      }
    ]
};*/

var userType = new GraphQLObjectType({
  name: 'Viewer',
  description: 'A person who uses our app',
  fields: () => ({
    id: globalIdField('Viewer'),
    lang: {
      type: GraphQLString,
      defaultValue: "en",
      resolve: ( obj ) => obj.lang
    },
    /*intl: {
      type: new GraphQLList(IntlMessageType),
      args: {
        locale: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, { locale }, { rootValue: objectManager } ) => {
          console.log("Locale", locale);
          return localeData[locale];
      },
    },*/
    intl: {
      type: new GraphQLList(IntlMessageType),
      async resolve (parent, { rootValue: objectManager } ) {
          let user = getViewer();
          let { lang } = user;
          let localeData;
          //console.log("Locale", lang);
          //const readFile = Promise.promisify(fs.readFile);
          try {
            localeData = await readFile(join(CONTENT_DIR, `${lang}.json`));
          } catch (err) {
            if (err.code === 'ENOENT') {
              throw new Error(`Locale '${lang}' not found`);
            }
          }
          //console.log("Locale Data", localeData);
          return JSON.parse(localeData);

          //localeData = readLocaleFile(user.lang);
          //console.log("Locale Data", localeData);
          //return localeData;
      },
   },
    hobby: {
      type: hobbyType,
      args: { ...{ id: { type: GraphQLID } } },
      resolve: ( parent, { id }, context, { rootValue: objectManager } ) => faction.hobbies[ ((fromGlobalId( id ).id) - 1) ],
    },
    hobbies: {
        type: hobbyConnection,
        description: 'A person\'s hobbies',
        args: {
          status: {
            type: GraphQLString,
            defaultValue: 'any',
          },
          ...connectionArgs,
        },
        resolve: (obj,
            {status, ...args},
            context,
            {rootValue: objectManager}
          ) => {
              return connectionFromArray(
                  faction.hobbies,
                  args
              )
            },
      },
  }),
  interfaces: [nodeInterface],
});


/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    // Add your own root fields here
    Viewer: {
      type: userType,
      resolve: () => getViewer(),
    },
  }),
});

//==============================================================================
function addHobby(values){
    var hobbyId = faction.hobbies.push(values)  - 1;
    return { hobbyId };
}
const hobbyAddMutation = mutationWithClientMutationId({
  name: 'InsertHobby',
  inputFields: {
    title: {
      type: new GraphQLNonNull(GraphQLString)
    },
  },
  outputFields: {
    hobby: {
      type: hobbyType,
      resolve: ({hobbyId}) => {
        var hobby = faction.hobbies[payload.hobbyId];
        return {
          cursor: cursorForObjectInConnection(faction.hobbies, hobby),
          node: hobby,
        };
      },
    },
    Viewer: {
      type: userType,
      resolve: () => getUser('1') //VERY IMPORTANT OTHERWISE FRONTEND Component WILL NOT REFRESH
    }
  },
  mutateAndGetPayload: (args, content) => {
    //TODO: Length +1 to create id is not a good approach it may create unique keys
    //For better keys, time can be used
    let date = new Date();
    return addHobby({id: date.getTime(), title: args.title});
  }
});
//==============================================================================
function updateHobby(values){
    let {id, title} = values;
    let data;
    faction.hobbies =  faction.hobbies.map((hobby, key) => {
      if( hobby.id == id ) {
        hobby.title = title;
        data = hobby;
      }
      return hobby;
    });
    return {hobby: data};
}
const hobbyUpdateMutation = mutationWithClientMutationId({
  name: 'UpdateHobby',
  inputFields: {
    id: {
        type: new GraphQLNonNull(GraphQLID)
    },
    title: {
      type: new GraphQLNonNull(GraphQLString)
    },
  },
  outputFields: {
    hobby: {
      type: hobbyType,
      resolve: ({hobby}) => hobby
    },
  },
  mutateAndGetPayload: (args, context) => {
    const id = fromGlobalId(args.id).id;
    return updateHobby({ ...args, id });
  }
});
//==============================================================================
function deleteHobby(id){
    faction.hobbies = faction.hobbies.reduce(function(result, hobby) {
      if ( hobby.id != id ) {
        result.push(hobby);
      }
      return result;
    }, []);
    //delete faction.hobbies[id - 1]

    return id;
}
const hobbyDeleteMutation = mutationWithClientMutationId({
  name: 'DeleteHobby',
  inputFields: {
    id: {
        type: new GraphQLNonNull(GraphQLID)
    },
  },
  outputFields: {
    deletedHobbyId: {
      type: GraphQLID,
      resolve: ( {id} ) => id
    },
    Viewer: {
      type: userType,
      resolve: () => getUser('1') //VERY IMPORTANT OTHERWISE FRONTEND Component WILL NOT REFRESH
    }
  },
  mutateAndGetPayload: ({ id }, context) => {
    const local_id = fromGlobalId( id ).id;
    deleteHobby( local_id );
    return ( {id} );
  }
});

const viewerUpdateMutation = mutationWithClientMutationId({
  name: 'Viewer_update',
  inputFields: {
    id: { type: new GraphQLNonNull( GraphQLID ) },
    lang: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
      Viewer: {
        type: userType,
        resolve: ( parent, args, context, { rootValue: objectManager } ) => getUser('1')
     },
  },
  mutateAndGetPayload: async( { id, lang,}, context, { rootValue: objectManager } ) => {
    // Do not use the passed ID at this point. Use the viewer user ID since it is verified
        const local_id = fromGlobalId( id ).id
        //const local_id = objectManager.getViewerUserId()
        //console.log("Update Lang", lang);
        setLang(lang);
        return { local_id }
    },
})

//==============================================================================
var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    insertHobby: hobbyAddMutation,
    updateHobby: hobbyUpdateMutation,
    deleteHobby: hobbyDeleteMutation,
    viewerUpdate: viewerUpdateMutation,
  })
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export var Schema = new GraphQLSchema({
  query: queryType,
  // Uncomment the following after adding some mutation fields:
  mutation: mutationType
});
