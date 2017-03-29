import {sync as globSync} from 'glob';
import * as fs from 'fs';
import { sync as mkdirpSync } from 'mkdirp';

const filePattern = './intl/**/*.json';
const outputDir = './data/messages/';

/*const translations = globSync('./lang/*.json')
    .map((filename) => [
        path.basename(filename, '.json'),
        readFileSync(filename, 'utf8'),
    ])
    .map(([locale, file]) => [locale, JSON.parse(file)])
    .reduce((collection, [locale, messages]) => {
        collection[locale] = messages;
        return collection;
    }, {});
console.log(translations);
*/
export function run() {
    let defaultMessages = globSync(filePattern)
      .map((filename) => fs.readFileSync(filename, 'utf8'))
      .map((file) => JSON.parse(file))
      .reduce((collection, descriptors) => {
          //console.log("Descriptors", descriptors, "Collection", collection);

        descriptors.forEach((descriptor) => {
          //console.log("Descriptor", descriptor, "Collection", collection);
          //let {id, defaultMessage} = descriptor;
          /*if (collection.hasOwnProperty(id)) {
            throw new Error(`Duplicate message id: ${id}`);
        }*/
          //collection[id] = defaultMessage;
          descriptor["message"] = "";
          descriptor["files"] = [];
          collection.push(descriptor);
        });

        return collection;
      }, []);

    // Create a new directory that we want to write the aggregate messages to
    mkdirpSync(outputDir);

    // Write the messages to this directory
    fs.writeFileSync(outputDir + '_default.json', JSON.stringify(defaultMessages, null, 2) );
    //fs.writeFileSync(outputDir + 'en.json', JSON.stringify(defaultMessages, null, 2) );
    //fs.writeFileSync(outputDir + 'fr.json', JSON.stringify(defaultMessages, null, 2) );

}


// const manageTranslations = require('react-intl-translations-manager').default;
//
// // es2015 import
// // import manageTranslations from 'react-intl-translations-manager';
//
// manageTranslations({
//   messagesDirectory: './intl',
//   translationsDirectory: './data/messages/',
//   languages: ['en','fr'], // any language you need
// });

/*import manageTranslations, {
  readMessageFiles,
  createSingleMessagesFile,
  getDefaultMessages
} from 'react-intl-translations-manager';

const messagesDirectory = './intl';
const translationsDirectory = './data/messages/';

// Output Default Messages
const extractedMessages = readMessageFiles(messagesDirectory);
createSingleMessagesFile({
  messages: getDefaultMessages(extractedMessages).messages,
  directory: translationsDirectory,
  fileName: 'en.json'
});

// Manage the Translations
manageTranslations({
  messagesDirectory,
  translationsDirectory,
  languages: ['fr']
});
*/
