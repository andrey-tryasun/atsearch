#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (args.length === 0) {
    const message = 'This is CLI-utility to search files\n\n' +
        '\x1b[1;33m' + 'Usage:\n' + '\x1b[0m' +
        '--DIR (required) base lookup directory\n' +
        '--TYPE (optional) [D|F] D - directory, F - file\n' +
        '--PATTERN (optional) regular expression to test file/directory name\n' +
        '--MIN-SIZE (optional) minimum file size [B|K|M|G]\n' +
        '--MAX-SIZE (optional) maximum file size [B|K|M|G]\n' +
        '  (B - bytes, K - kilobytes, M - megabytes, G - gigabytes)\n\n' +
        '\x1b[1m' + 'Parameters order is not strict.\n\n' + '\x1b[0m' +
        '\x1b[1;32m' + 'Examples:\n' + '\x1b[0m' +
        'index.js --DIR="/User/Documents" --PATTERN=\\.js\n' +
        'index.js --DIR="/User/Documents" --TYPE=D\n' +
        'index.js --PATTERN=\\.mkv --TYPE=F --MIN-SIZE=4G --DIR="/User/Documents"';
    console.log(message);
    process.exit(0);
}

let dir = '', type = 'F', pattern = '', minSizeStr = '', maxSizeStr = '';

const getArgValue = argument => argument.slice(argument.indexOf('=') + 1);

args.forEach(argument => {
    if (argument.startsWith('--DIR=')) dir = getArgValue(argument);
    if (argument.startsWith('--TYPE=')) type = getArgValue(argument);
    if (argument.startsWith('--PATTERN=')) pattern = getArgValue(argument);
    if (argument.startsWith('--MIN-SIZE=')) minSizeStr = getArgValue(argument);
    if (argument.startsWith('--MAX-SIZE=')) maxSizeStr = getArgValue(argument);
});

const checkArguments = () => {
    if (!dir) return '--DIR=  is required!';
    if (!(type === 'F' || type === 'D')) return 'TYPE must be [D]irectory or [F]ile';
};

const error = checkArguments();
if (error) {
    console.log(error);
    process.exit(0);
}

const getSize = string => {
    switch (string.slice(-1)) {
        case 'B':
            return +string.slice(0, -1);
        case 'K':
            return +string.slice(0, -1) * 1024;
        case 'M':
            return +string.slice(0, -1) * 1048576;
        case 'G':
            return +string.slice(0, -1) * 1073741824;
    }
};

const minSize = getSize(minSizeStr) || 0;
const maxSize = getSize(maxSizeStr) || Infinity;

(() => {
    const results = [];
    let counter = 0;    // number of recursion calls
    let thread = 0;     // number of threads

    const showResults = (results) => {
        results.forEach(item => console.log(item));
        console.log(`\nFound ${results.length} items`);
    };

    const getFiles = (dir, callback) => {
        counter++;
        fs.readdir(dir, (err, files) => {
            if (err) throw err;
            thread++;
            let cursor = {item: files.length, parent: thread};
            files.forEach((file) => {
                const filePath = path.join(dir, file);
                fs.stat(filePath, (err, stats) => {
                    if (err) throw err;
                    if (((type === 'F' && stats.isFile() &&
                          stats.size >= minSize &&
                          stats.size <= maxSize) ||
                          (type === 'D' && stats.isDirectory())) &&
                          file.match(pattern)) {
                            results.push(filePath);
                    }
                    if (stats.isDirectory()) {
                        getFiles(filePath, callback);
                    }
                    if (counter === thread && cursor.parent === thread && !--cursor.item) callback(results);
                });
            });
        });
    };

    getFiles(dir, showResults);

})(dir);
