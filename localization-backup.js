
/*
This code goes in plugins section in babelrc

"react-intl", {
  "messagesDir": "./intl",
  "enforceDescriptions": false
}

*/

/*
import {sync as globSync} from 'glob';
import * as fs from 'fs';
import { sync as mkdirpSync } from 'mkdirp';
*/
//const filePattern = './intl/**/*.json';
//const outputDir = './data/messages/';
/*
const translations = globSync('./lang/*.json')
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


let defaultMessages = globSync(filePattern)
  .map((filename) => fs.readFileSync(filename, 'utf8'))
  .map((file) => JSON.parse(file))
  .reduce((collection, descriptors) => {
      console.log("Descriptors", descriptors, "Collection", collection);
    /*
    descriptors.forEach((descriptor) => {
      console.log("Descriptor", descriptor, "Collection", collection);
      let {id, defaultMessage} = descriptor;
      if (collection.hasOwnProperty(id)) {
        throw new Error(`Duplicate message id: ${id}`);
      }
      collection[id] = defaultMessage;
    });

    return collection;
  }, {});

// Create a new directory that we want to write the aggregate messages to
mkdirpSync(outputDir);
*/
// Write the messages to this directory
//fs.writeFileSync(outputDir + 'data.json', `{ "en": ${JSON.stringify(defaultMessages, null, 2)} }`);
