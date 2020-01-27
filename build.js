const fs = require('fs'),
      path = require('path'),
      { execSync } = require('child_process');

const srcFolder = './src/';
const destinationFolder = './generated/';
let filesToProcess = {};

fs.readdirSync(srcFolder).forEach(file => {
    var filePath = path.join(srcFolder, file);
    var stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
        let mermaidDiagramFiles = [];
        fs.readdirSync(filePath).forEach(subFile => {
            if(subFile.indexOf('.mmd') !== -1) {
                mermaidDiagramFiles.push(path.join(filePath, subFile));
            }
        });
        if(mermaidDiagramFiles.length > 0) {
            filesToProcess[file] = mermaidDiagramFiles;
        }
    }
});

function generateDirectoriesAndSVGCommands(filesToProcess) {
    
    let generationCommands = [];
    Object.keys(filesToProcess).forEach((directory) => {

        let newDestinationDirectory = path.join(destinationFolder, directory);
        
        if (!fs.existsSync(newDestinationDirectory)){
            fs.mkdirSync(newDestinationDirectory);
        }
        filesToProcess[directory].forEach((file) => {
            let destination = path.join(newDestinationDirectory, path.basename(file).replace(/\.[^/.]+$/, ""));
            generationCommands.push(`./node_modules/.bin/mmdc -i ${file} -o ${destination}.svg`);
        });
    });

    return generationCommands;
};

function generateReadMe(filesToProcess) {
    let readmeFiles = [];
    Object.keys(filesToProcess).forEach((directory) => {

        let newDestinationDirectory = path.join(destinationFolder, directory);
        let readmeContents = `# ${directory}
    `;
        filesToProcess[directory].forEach((file) => {
            let fileNameOnly = path.basename(file).replace(/\.[^/.]+$/, "");
            readmeContents += `## ${fileNameOnly}
![Image of ${fileNameOnly}](./${fileNameOnly}.svg?sanitize=true)
`;
        });
        readmeFiles.push({path : `${newDestinationDirectory}/README.md`, contents : readmeContents});
    });

    return readmeFiles;
}

function storeReadMeFiles(ReadMeFiles) {
    ReadMeFiles.forEach(readme => {
        console.log("generating README at ", readme.path);
        fs.writeFileSync(readme.path,readme.contents,{encoding:'utf8',flag:'w'});
    });
    
}

function generateSVGFiles(generationCommands) {
    generationCommands.forEach(command => {
        console.log(`Executing : ${command}`);
        execSync(command, {timeout : 5000, stdio: 'inherit'});
    });
}


const SVGCommands = generateDirectoriesAndSVGCommands(filesToProcess);
const ReadMeFiles = generateReadMe(filesToProcess);

storeReadMeFiles(ReadMeFiles);
generateSVGFiles(SVGCommands);
