#!/usr/bin/env node

/**
 * CLI tool to parse git diff and build a package.xml file from it.
 * This is useful for using the MavensMate deployment tool and selecting the existing package.xml file
 * Also used in larger orgs to avoid deploying all metadata in automated deployments
 *
 * usage:
 *  $ sfpackage master featureBranch ./deploy/
 *
 *  This will create a file at ./deploy/featureBranch/unpackaged/package.xml
 */

var program = require('commander');
var util = require('util'),
    spawn = require('child_process').spawn,
    packageWriter = require('./lib/metaUtils').packageWriter,
    buildPackageDir = require('./lib/metaUtils').buildPackageDir,
    copyFiles = require('./lib/metaUtils').copyFiles,
    packageVersion = require('./package.json').version;

var DoNotDeployMetaType = ['profiles', 'permissionsets'];
//make sure meta item is unique before adding to this list, if not, will need to modify it or modify this script
var DoNotDeployMeta = ['BrightPlanetSolarPartnerUser'];
var FolderBasaedAssets = ['email', 'documents', 'dashboards', 'reports'];

program
    .arguments('<compare> <branch> [target]')
    .version(packageVersion)
    .option('-d, --dryrun', 'Only print the package.xml that would be generated')
    .action(function (compare, branch, target) {
        console.log("compare: " + compare);
        console.log("branch: " + branch);
        console.log("target: " + target);
        if (!branch || !compare) {
            console.error('branch and target branch are both required');
            program.help();
            process.exit(1);
        }

        var dryrun = false;
        if (program.dryrun) {
            dryrun = true;
        }

        if (!dryrun && !target) {
            console.error('target required when not dry-run');
            program.help();
            process.exit(1);
        }

        var currentDir = process.cwd();
        console.log("currentDir: " + currentDir);
        var gitDiff = spawn('git', ['diff', '--name-only', '--diff-filter=d', compare, branch]);
        var files = '';
        var fileList = [];
        var validFileList = [];
        var streamIterations = 0;

        // the data is streamed in chunks of Kbs which means the callback function 
        // may get called multiple times so we should build the files list as a string first
        gitDiff.stdout.on('data', function (data) {
            //console.log("data: " + data);
            var buff = new Buffer(data);
            files += buff.toString('utf8');
            streamIterations+=1;
        });

        // then process the list once the stream is finished
        gitDiff.stdout.on('end', function (data) {
            console.log("streamIterations: " + streamIterations);

            //defines the different member types
            var metaBag = {};

            fileList = files.split('\n');
            //console.log('fileList: ' + fileList);
            fileList.forEach(function (fileName) {
                //console.log('filename: ' + fileName);
                //ensure file is inside of src directory of project
                if (fileName && fileName.substring(0,3) === 'src') {
                    validFileList.push(fileName);

                    //ignore changes to the package.xml file
                    if(fileName === 'src/package.xml') {
                        return;
                    }

                    var parts = fileName.split('/');
                    if (!metaBag.hasOwnProperty(parts[1])) {
                        metaBag[parts[1]] = [];
                    }

                    // use the 2nd and 3rd part of the file path as the metadata name if 
                    // the first part of the file path is 'email', 'document' or 'dashboard'
                    // , otherwise use the 2nd part of the file path
                    var meta = (FolderBasaedAssets.indexOf(parts[1]) > -1 ? parts[2] + '/' + parts[3].split('.')[0] : parts[2].split('.')[0]);
                    //console.log('metaBag[parts[1]]: ' + metaBag[parts[1]]);
                    //console.log('meta: ' + meta);
                    // make sure we do not push metadata types or items in our DoNotDeployMetaType & DoNotDeployMeta lists
                    if (metaBag[parts[1]].indexOf(meta) === -1 && DoNotDeployMetaType.indexOf(parts[1]) <= -1 && DoNotDeployMeta.indexOf(meta) <= -1) {
                        metaBag[parts[1]].push(meta);
                    }

                }


            });

            //console.log('Object.keys(metaBag).length: ' + Object.keys(metaBag).length);

            // build the package file and package directory only if there is metadata to deploy
            if(Object.keys(metaBag).length > 0){

                //build package.xml file
                var packageXML = packageWriter(metaBag);
                if (dryrun) {
                    console.log(packageXML);
                    process.exit(0);
                }
                console.log('packageXML: ' + packageXML);
                console.log('building in dir %s', target);

                buildPackageDir(target, branch, metaBag, packageXML, (err, buildDir) => {

                    if (err) {
                        return console.error(err);
                    }

                    copyFiles(currentDir, buildDir, validFileList);
                    console.log('Successfully created package package.xml in %s',buildDir);

                });
            } else {
                console.log('No metadata changes to deploy');
            }
        });

        gitDiff.stderr.on('data', function (data) {
            console.error('stderror:: ' + data);
        });

    });


program.parse(process.argv);
