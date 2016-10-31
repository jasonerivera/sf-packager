# README #

To get up and running follow the instructions below.

### What is this repository for? ###


This repository supports continuous integration of our salesforce applications.

This repository is one of 4 key repositories in our org:

> 1. Prod
> 2. UAT
> 3. QA
> 4. Dev

Each one of these repositories are forks of one another. UAT was forked from Prod, QA was foked from UAT and Dev was forked from QA. The official repsitory is Prod, of course.

When changes occur in Prod/master, they are automatically synced down into UAT/master, QA/master and Dev/master.


* Version
* [Learn Markdown](https://bitbucket.org/tutorials/markdowndemo)

### How do I get set up? ###

* Create a feature branch for each issue you work on in JIRA by using the 'Create Branch' button on the detail page of the issue.

* Clone the feature branch locally using teh git GUI of choice using the following Source Path URL:
  > http://firstName.lastName@bitbucket.sunnova.com:7990/scm/sf/sfdc-dev.git
 
  Remember to replace firstName.lastName with your actual username for your JIRA/bitbucket account.
* Make sure the destiantion path for your local copy points to an empty folder where you plan to keep your salesforce IDE project.
 * If using SublimeText3 with MavensMate: 
 > * Make sure to create the salesforce project first, then make a backup of the project folder.
 > * Next, delete the contents of the original project folder.
 > * Then clone the feature branch localy as instructed above into the empty project folder.
 > * Then copy the project specific files from the backup project folder into the original project folder. You shold now have all the files from the dev repository as well as  a hidden .git folder and MavensMate-specific project files.
 > * You may now proceed to make changes against the new feature.
 
 * If using any other Salesforce IDE tool like Eclipse or Welkinsuite, you may have to follow similar steps as listed above. Just keep in mind that cloning a repository localy using SourceTree or other git GUI tools, the directoy must be empty first. Also, when starting a new IDE project, some IDEs also require the directory to be empty as well, so it makes it inmpossible to do either first, so following the steps above should help you get around this issue.
 * You may also choose to use a git command line tool in order to track changes between your IDE project and your remote feature branche(s). All you have to do is create your IDE project locally as you normally would, then in the CLI tool, >cd to the project directory then run >git init to create the local repository. You can then run the command to checkout and track your remote branch to this local folder. This will overwrite the files in the project directory wiht similar names so that you are working with the repository version. 

 > 

* If you plan to start working on another branch at any time, you can either clone the branch localy into a different IDE project folder as we did in the previous steps or you can simply create the remote branch from JIRA as normal and then using the CLI or GUI such as SourceTree, checkout the remote branch you just created from the remote repository. This will overwrite the current files in the directory and show you the checked-out version instead. Don't worry! If you plan to work on both either commit or stash your changes in one branch and then checkout the other branch to start making those changes. Just remmeber that you must not have any uncommitted changes in your local working directory or else you won't be able to checkout another branch to it.

* Deployment instructions

### Contribution guidelines ###

* Writing tests
* Code review
* Other guidelines

### Who do I talk to? ###

* Jason Rivera or Srinivas Yeduru
* Other community or team contact