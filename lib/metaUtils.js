
var xmlBuilder = require('xmlbuilder');
var fs = require('fs-extra');
var mkdirp = require('mkdirp');

/**
 * Mapping of file name to Metadata Definition
 */
//@todo -- finish out all the different metadata types
var metaMap = {
	'actionLinkGroupTemplates': 'ActionLinkGroupTemplate',
	'analyticSnapshots': 'AnalyticSnapshot',
	'classes': 'ApexClass',
	'components': 'ApexComponent',
	'pages': 'ApexPage',
	'triggers': 'ApexTrigger',
	'appMenus': 'AppMenu',
	'approvalProcesses': 'ApprovalProcess',
	'assignmentRules': 'AssignmentRules',
	'aura': 'AuraDefinitionBundle',
	'authproviders': 'AuthProvider',
	'autoResponseRules': 'AutoResponseRules',
	'callCenters': 'CallCenter',
	'certs': 'Certificate',
	'channelLayouts': 'ChannelLayout',
	'communities': 'Community',
	'connectedApps': 'ConnectedApp',
	'corsWhitelistOrigins': 'CorsWhitelistOrigin',
	'applications': 'CustomApplication',
	'customApplicationComponents': 'CustomApplicationComponent',
	'feedFilters': 'CustomFeedFilter',
	'labels': 'CustomLabels',
	'customMetadata': 'CustomMetadata',
	'objects': 'CustomObject',
	'objectTranslations': 'CustomObjectTranslation',
	'weblinks': 'CustomPageWebLink',
	'customPermissions': 'CustomPermission',
	'sites': 'CustomSite',
	'tabs': 'CustomTab',
	'dashboards': 'Dashboard',
	'datacategorygroups': 'DataCategoryGroup',
	'delegateGroups': 'DelegateGroup',
	'documents': 'Document',
	'email': 'EmailTemplate',
	'entitlementProcesses': 'EntitlementProcess',
	'entitlementTemplates': 'EntitlementTemplate',
	'escalationRules': 'EscalationRules',
	'dataSources': 'ExternalDataSource',
	'flexipages': 'FlexiPage',
	'flows': 'Flow',
	'flowDefinitions': 'FlowDefinition',
	'globalPicklists': 'GlobalPicklist',
	'groups': 'Group',
	'homePageComponents': 'HomePageComponent',
	'homePageLayouts': 'HomePageLayout',
	'installedPackages': 'InstalledPackage',
	'moderation': 'KeywordList',
	'layouts': 'Layout',
	'letterhead': 'Letterhead',
	'managedTopics': 'ManagedTopics',
	'matchingRules': 'MatchingRules',
	'namedCredentials': 'NamedCredential',
	'networks': 'Network',
	'pathAssistants': 'PathAssistant',
	'permissionsets': 'PermissionSet',
	'cachePartitions': 'PlatformCachePartition',
	'portals': 'Portal',
	'postTemplates': 'PostTemplate',
	'profiles': 'Profile',
	'queues': 'Queue',
	'quickActions': 'QuickAction',
	'remoteSiteSettings': 'RemoteSiteSetting',
	'reports': 'Report',
	'reportTypes': 'ReportType',
	'roles': 'Role',
	'samlssoconfigs': 'SamlSsoConfig',
	'scontrols': 'Scontrol',
	'settings': 'settings',
	'sharingRules': 'SharingRules',
	'sharingSets': 'SharingSet',
	'siteDotComSites': 'SiteDotCom',
	'staticresources': 'StaticResource',
	'synonymDictionaries': 'SynonymDictionary',
	'transactionSecurityPolicies': 'TransactionSecurityPolicy',
	'translations': 'Translations',
	'wave': 'WaveApplication',
	'wave': 'WaveDashboard',
	'wave': 'WaveDataflow',
	'wave': 'WaveDataset',
	'wave': 'WaveLens',
	'workflows': 'Workflow'
};



exports.packageWriter = function(metadata, apiVersion) {

	apiVersion = apiVersion || '37.0';
	var xml = xmlBuilder.create('Package', { version: '1.0'});
		xml.att('xmlns', 'http://soap.sforce.com/2006/04/metadata');
	//console.log('packageWriter->metadata: ' + metadata);
	for (var type in metadata) {

		if (metadata.hasOwnProperty(type)) {

			var typeXml = xml.ele('types');


			metadata[type].forEach(function(item) {
				typeXml.ele('members', item);
			});

			typeXml.ele('name', metaMap[type]);
		}

	}
	xml.ele('version', apiVersion);

	return xml.end({pretty: true});
};

exports.buildPackageDir = function (dirName, name, metadata, packgeXML, cb) {

	var	packageDir = dirName + '/' + name + '/unpackaged';

	//@todo -- should probably validate this a bit
	mkdirp(packageDir, (err) => {

		if(err) {
			return cb('Failed to write package directory ' + packageDir);
		}


		fs.writeFile(packageDir + '/package.xml', packgeXML, 'utf8', (err) => {
			if(err) {
				return cb('Failed to write package.xml file');
			}

			return cb(null, packageDir);
		});


	});


};

exports.copyFiles = function(sourceDir, buildDir, files) {

    sourceDir = sourceDir + '/';
    buildDir = buildDir + '/';

    files.forEach(function(file) {
    	//console.log('file: ' + file);
        if(file) {
        	
        	//console.log('file.substr(4, file.length): ' + file.substr(4, file.length));
            fs.copySync(sourceDir + file, buildDir + file.substr(4, file.length));

            if(file.endsWith('-meta.xml')) {
                var nonMeta = file.replace('-meta.xml', '');
                fs.copySync(sourceDir + nonMeta, buildDir + nonMeta.substr(4, nonMeta.length));
            }
            else {
                var metaExists = true;
                try {
                    fs.accessSync(sourceDir + file + '-meta.xml', fs.F_OK);
                }
                catch (err) {
                    console.log(sourceDir + file + '-meta.xml does not exist');
                    metaExists = false;
                }

                if(metaExists) {
                    var meta = file + '-meta.xml';
                    fs.copySync(sourceDir + meta, buildDir + meta.substr(4, meta.length));
                }

            }


        }

    });

};
