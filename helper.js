const fs = require('fs');
const path = require('path');
const asar = require('asar');

// Path to your app.asar file
const asarFilePath = 'app.asar';

// Function to print out the directory tree and handle errors
function printAsarDirectoryTree(asarPath, currentPath = '') {
    try {
        // Extracting the asar file
        const tempDir = 'temp'; // Temporary directory to extract the contents
        asar.extractAll(asarPath, tempDir);

        // Constructing the full path to the directory
        const directoryPath = path.join(tempDir, currentPath);

        // Reading the contents of the directory
        const contents = fs.readdirSync(directoryPath);

        // Iterating over the contents
        contents.forEach(item => {
            const itemPath = path.join(directoryPath, item);

            try {
                // Checking if the item is a directory
                if (fs.statSync(itemPath).isDirectory()) {
                    // Recursively print the directory tree
                    if (item != "node_modules") {
                        printAsarDirectoryTree(asarPath, path.join(currentPath, item));
                    }
                } else {
                    // Print the file path
                    console.log(path.join(currentPath, item));
                }
            } catch (error) {
                // Handle errors for files not found
                console.error(`Error accessing file '${path.join(currentPath, item)}': ${error.message}`);
            }
        });
    } catch (error) {
        // Handle errors for directory not found
        console.error(`Error accessing directory '${currentPath}': ${error.message}`);
    }
}

// Print out the directory tree of the app.asar file
printAsarDirectoryTree(asarFilePath);
