/*
 * © Kunskapsskolan Education AB all rights reserved
 * including all other voodoo lawyering terms and conditions.
 */
var resourceLocatorUtil = require('ResourceLocatorUtil');
var portletContextUtil = require('PortletContextUtil');
var propertyUtil = require('PropertyUtil');
var endecUtil = require('EndecUtil');
var user = portletContextUtil.getCurrentUser();
var site = resourceLocatorUtil.getSitePage();
var currentPage = portletContextUtil.getCurrentPage();
if (debugOn === undefined) {
	var debugOn = false;
}
var KED = KED || {};
KED.utils = KED.utils || {};
KED.utils.common = (function() {
	var _debugP = function(message, type) {
		if (debugOn === true) {
			if (message === undefined || message === null) {
				message = "";
			}
			var helpClass = "debugText";
			if (type == "header") {
				helpClass = "debugHeader debug_head";
			}
			if (type == "end") {
				helpClass = "debugEnd";
			}
			if (type == "error") {
				helpClass = "debugError";
			}
			try {
				out.println("<p class='debugOut " + helpClass + "'>" + message + "</p>");
			} catch (e) {
				out.println("<p class='debugOut debugError'>" + e + "</p>");
			}
			if (type === "header") {
				// out.println("<div class='debug_body'>");
			}
			if (type === "end") {
				//  out.println("</div>");
			}
		}
	};
	// Get all nodes from the current path in an array
	var _getPathArray = function(currentNode) {
		KED.utils.common.debugP("Inside  getPathArray(" + currentNode + ")", "header");
		var currentPath = currentNode.getPath();
		var drillArray = [];
		var walkNode = currentNode;
		var pushCandidate = "";
		var topNode = site.getParent().getParent();
		KED.utils.common.debugP("Adding " + walkNode + " first.");
		for (n = 0; n < 15; n++) {
			pushCandidate = walkNode;
			try {
				walkNode = walkNode.getParent();
			} catch (e) {
				KED.utils.common.debugP(e, "error");
				walkNode = "";
				debugP("Error occured exiting!");
				n = 9999;
			}
			if (pushCandidate == topNode) {
				drillArray.push(pushCandidate);
				n = 9999;
			}
			if (n !== 9999) {
				KED.utils.common.debugP("Site page or Page Repository check '" + pushCandidate + "'");
				if (pushCandidate == "Site page" || pushCandidate == "Page Repository") {} else {
					if (pushCandidate.isNodeType("sv:folder") || pushCandidate.isNodeType("sv:page")) {
						drillArray.push(pushCandidate);
						KED.utils.common.debugP("n = " + n + " pushing " + pushCandidate + " at drillArray[" + drillArray.length + "]");
					} else {
						KED.utils.common.debugP("Not adding anything else other than pages and folders.");
					} // only pages and folders
				} // check for odd names
			} else {
				KED.utils.common.debugP("Exiting nicely after 9999 ...");
			} // n== 9999
		}
		KED.utils.common.debugP("Reversing drillArray containing " + drillArray.length + " items and then exiting.");
		drillArray.reverse();
		if (debugOn === true) {
			KED.utils.common.debugP("drillArray contains ", "header");
			if (drillArray !== undefined) {
				for (n = 0; n < drillArray.length; n++) {
					KED.utils.common.debugP("drillArray[" + n + "] = " + drillArray[n]);
				}
			}
		}
		KED.utils.common.debugP("Closing getPathArray sending (" + drillArray + ")", "end");
		return (drillArray);
	};
	var _getUserArray = function() {
		var user = portletContextUtil.getCurrentUser();
		KED.utils.common.debugP("In createUserArray (" + user + ")", "header");
		// Fetching user DN
		var userDN = "";
		try {
			userDN = propertyUtil.getString(user, "dn", "null").toLowerCase();
		} catch (e) {
			KED.utils.common.debugP(e, "error");
		}
		KED.utils.common.debugP("userDN = " + userDN);
		if (userDN == "null") {
			KED.utils.common.debugP("is null... Getting department name:");
			try {
				pValue = propertyUtil.getString(user, "department", "null");
				KED.utils.common.debugP("" + pValue);
			} catch (e) {
				KED.utils.common.debugP(e, "error");
			}
			try {
				userName = propertyUtil.getString(user, "displayName", "null");
				KED.utils.common.debugP("" + userName);
			} catch (e) {
				KED.utils.common.debugP(e, "error");
			}
			var siteName = site.toString();
			userDN = "ou=sitevisioncloude,cn=customers,cn=kunskapsskolan,cn=" + siteName + ",cn=schools,cn=" + pValue + ",cn=" + userName;
			KED.utils.common.debugP("Reconstructed userDN=");
			KED.utils.common.debugP(userDN);
		}
		var userArray = userDN.split(",");
		try {
			var userName = user.getProperty("displayName").getString();
		} catch (e) {
			var userName = "Anonymous";
			KED.utils.common.debugP(e, "error");
		}
		var antal = userArray.length;
		for (i = 0; i < antal; i++) {
			userArray[i] = userArray[i].replace('cn=', '');
			userArray[i] = userArray[i].replace('ou=', '');
			userArray[i] = userArray[i].replace('dc=', '');
			KED.utils.common.debugP("userArray [" + i + "] = " + userArray[i]);
		}
		// userArray.reverse();
		if (debugOn === true) {
			KED.utils.common.debugP("userArray contains ", "header");
			if (userArray !== undefined) {
				for (n = 0; n < userArray.length; n++) {
					KED.utils.common.debugP("userArray[" + n + "] = " + userArray[n]);
				}
			}
		}
		return (userArray);
	};
	var _isEmployee = function() {
		KED.utils.common.debugP("Inside isEmployee ()", "header");
		var isEmployee = false;
		var employeeType = "";
		try {
			employeeType = propertyUtil.getString(user, "employeeType", false);
		} catch (e) {
			KED.utils.common.debugP("<p>" + e + "</p>");
		}
		KED.utils.common.debugP("<br>employeeType : " + employeeType);
		if (employeeType == "EMPLOYEE") {
			isEmployee = true;
		}
		KED.utils.common.debugP("<br>isEmployee : " + isEmployee);
		return (isEmployee);
    };
    
	var _getUserSchool = function() {
		KED.utils.common.debugP("In getUserSchool()", "header");
		//var userSchool="Västerås";
		if (userArray === undefined) {
			KED.utils.common.debugP("Setting usserArray, was undefined...");
			var userArray = KED.utils.common.getUserArray();
        }
        
		try {
			userSchool = userArray[2];
		} catch (e) {
			KED.utils.common.debugP(e, "error");
		}
		KED.utils.common.debugP("Got userSchool from userArray[2]= " + userSchool);
		var name = userSchool;
		
		try {
            var testNode = site.getNode("/Skolspecifikt/");
        } catch (e) {
            KED.utils.common.debugP(e,"error");
        }

		var startSida = "";
		var userSchool = name.toString().toLowerCase();
		var schoolName = "";
		if (testNode !== undefined) {
			for (var schools = testNode.getNodes(); schools.hasNext();) {
				var school = schools.next();
				schoolName = "" + school.toString().toLowerCase();
				//.replace(/i/g, "a");
				schoolName = schoolName.replace(/ö/g, "o");
				schoolName = schoolName.replace(/ä/g, "a");
				schoolName = schoolName.replace(/å/g, "a");
				if (schoolName == userSchool) {
					startSida = school;
					KED.utils.common.debugP(" **** ");
					KED.utils.common.debugP("Match found!! User school is : '" + startSida + "'");
					KED.utils.common.debugP(" **** ");
				} else {
					KED.utils.common.debugP("No match against : '" + schoolName + "'");
				}
			}
		} else {
			KED.utils.common.debugP("Unable to locate schools.");
		}
		KED.utils.common.debugP("Done fixSchoolName. Returning school node : " + startSida);
		userSchool = startSida;
		KED.utils.common.debugP("Returning " + userSchool + " from getUserSchool()");
		return userSchool;
    };
    
	function _userLpDataRead(key) {
		KED.utils.common.debugP("Inside userLpDataRead(" + key + ")", "header");
		var credentials = "";
		var ui = request.getAttribute("javax.portlet.userinfo");
		var userAttributes = ui.entrySet().iterator();
		while (userAttributes.hasNext()) {
			var ua = userAttributes.next();
			var currentKey = ua.getKey();
			var currentValue = ua.getValue();
			if (currentKey == key) {
				credentials = currentValue;
			}
		}
		return credentials;
	}

	function _userLpDataWrite(key, value) {
		KED.utils.common.debugP("Inside userLpDataWrite(" + key + "," + value + ")", "header");
		var userInfo = request.getAttribute("javax.portlet.userinfo");
		userInfo.put(key, value);
	}

	function _outputCurrentUserAttributes() {
		KED.utils.common.debugP("Inside outputCurrentUserAttributes()", "header");
		var ui = request.getAttribute("javax.portlet.userinfo");
		var userAttributes = ui.entrySet().iterator();
		while (userAttributes.hasNext()) {
			var ua = userAttributes.next();
			var currentKey = ua.getKey();
			var currentValue = ua.getValue();
			out.println("key: " + currentKey + "   value: " + currentValue + "<br>");
		}
	}
	var _getIntro = function(node) {
		KED.utils.common.debugP("Inside getIntro(" + node + ")", "header");
		var gotAny = false;
		var backUp = "";
		var correctIntro = "";
		for (var pages = node.getNodes(); pages.hasNext();) {
			var page = pages.next();
			if (gotAny === false && page.isNodeType("sv:page")) {
				KED.utils.common.debugP("Got backup page '" + page + "'...");
				backUp = page;
				gotAny = true;
			}
			// find introduction pages 
			if (page == "المقدِّمةُ" || page == "Introduction" || page == "Introduktion" || page == "Upptakt" || page == "Introductie") {
				correctIntro = page;
				KED.utils.common.debugP("Got the correct intro page '" + page + "'...");
			}
		}
		if (correctIntro === "") {
			correctIntro = backUp;
		}
		KED.utils.common.debugP("Done. Returning intro page...");
		return (correctIntro);
    };
    
	var _isLinkable = function(node) {
		KED.utils.common.debugP("Inside isLinkable(" + node + ")", "header");
		var state = false;
		if (node.isNodeType("sv:page") || node.isNodeType("sv:structurePage") || node.isNodeType("sv:link") || node.isNodeType("sv:structureLink")) {
			state = true;
		}
		return (state);
	};
	var _isVisible = function(node) {
		KED.utils.common.debugP("Inside isVisible(" + node + ")", "header");
		var state = false;
		try {
			state = node.getProperty("visibleInMenus").getBoolean();
		} catch (e) {
			KED.utils.common.debugP(e, "error");
		}
		return (state);
	};
	var _getURL = function(node) {
		var nodeURL = "#";
		try {
			nodeURL = node.getProperty("URI").getString();
		} catch (e) {
			KED.utils.common.debugP(e, "error");
		}
		return (nodeURL);
	};
	var _getProp = function(inputNode, prop) {
		var a = "";
		var error = "";
		try {
			var a = inputNode.getProperty(prop).getString();
		} catch (e) {
			var error = e;
		}
		KED.utils.common.debugP("- Fetched: <b>'" + a + "'</b> " + error + " (" + prop + ") from: " + inputNode + ".");
		return (a);
	};
	var _packageLearningTask = function(node) {
		var packageString = "";
		/* {name: "Tidslinjen 1", url: "http://dskjlds"} */
		var nodeName = endecUtil.unEscapeJcrName(node.getName());
		var nodeURL = node.getProperty("URI").getString();
		nodeURL = KED.utils.common.prepareURL(nodeURL);
		var nodeID = node.getIdentifier();
		packageString = '{name: "' + nodeName + '", url: "' + nodeURL + '", id: "' + nodeID + '"}';
		return (packageString);
	};
	var _findTheseInArray = function(needle, haystack) {
		KED.utils.common.debugP("Inside findTheseInArray(" + needle + ", " + haystack + ")", "header");
		var found = false;
		needle.forEach(function(name) {
			KED.utils.common.debugP("Checking for : " + name);
			haystack.forEach(function(straw) {
				if (straw.toString() == name.toString()) {
					found = true;
					KED.utils.common.debugP("Found!");
				}
			});
		});
		KED.utils.common.debugP("Returning :" + found);
		return (found);
	};
	var _getPageContentType = function(nodeArray) {
		KED.utils.common.debugP("Inside getPageContentType(" + nodeArray + ")", "header");
		var contentType = ""; // Theme, Step, Teacherpage ...
		if (nodeArray === undefined && currentPage !== undefined) {
			nodeArray = KED.utils.common.getPathArray(currentPage);
		}
		var themesNames = ["Themes", "Kurser"];
		if (KED.utils.common.findTheseInArray(themesNames, nodeArray) == true) {
			contentType = "theme";
			var currentTemplate = "";
			var lastPage = nodeArray[nodeArray.length - 1];
			KED.utils.common.debugP("Kollar mall på sidan " + lastPage);
			try {
				currentTemplate = lastPage.getProperty("template").getString();
			} catch (e) {
				KED.utils.common.debugP(e, "error");
			}
			if (currentTemplate === "") {
				KED.utils.common.debugP("Unable to get template. Possible file. Alternate check... And hard setting template read.");
				if (nodeArray[4].toString() == "Kursmodul") {
					currentTemplate = "91.4ea1d7cc14e42ec4fb65fef";
				}
			}
			if (currentTemplate.toString() == "91.4ea1d7cc14e42ec4fb65fef") {
				contentType = "looped";
			}
		}
		var stepNames = ["Steg", "Steps"];
		if (KED.utils.common.findTheseInArray(stepNames, nodeArray) == true) {
			contentType = "step";
		}
		var integratedNames = ["Ämnesintegrerade"];
		if (KED.utils.common.findTheseInArray(integratedNames, nodeArray) == true) {
			contentType = "integrated";
		}
		var teacherPagesNames = ["Lärarsidor", "Teacher Pages", "Ämnessidor"];
		if (KED.utils.common.findTheseInArray(teacherPagesNames, nodeArray) == true) {
			contentType = "teacher";
		}
		var learningStrategiesNames = ["Learning Strategies"];
		if (KED.utils.common.findTheseInArray(learningStrategiesNames, nodeArray) == true) {
			contentType = "strategies";
		}
      var corporateNames = ["Medarbetare"];
		if (KED.utils.common.findTheseInArray(corporateNames, nodeArray) == true) {
			contentType = "intranet";
		}
      var referenceNames = ["Referens"];
		if (KED.utils.common.findTheseInArray(referenceNames, nodeArray) == true) {
			contentType = "reference";
		}
      var academyNames = ["KS Akademi","KS Akademi GY","KS Akademi Övriga"];
		if (KED.utils.common.findTheseInArray(academyNames, nodeArray) == true) {
			contentType = "academy";
		}
      var helpNames = ["Service & support"];
		if (KED.utils.common.findTheseInArray(helpNames, nodeArray) == true) {
			contentType = "help";
		}
		KED.utils.common.debugP("Returning contentType : " + contentType);
		return (contentType);
	};
	var _getLearningTaskObject = function(node) {
		KED.utils.common.debugP("Inside _getLearningTaskObject(" + node + ")", "header");
		var taskName = "";
		var taskURL = "#";
		var taskLearningGoal = "";
		var taskCourseName = "";
		var taskStep = "";
		var nodeArray = KED.utils.common.getPathArray(node);
		debugP("******** Check nodeArray *************");
		if (nodeArray !== undefined) {
			debugP("Node link = " + node.isNodeType("sv:link"));
			if (node.isNodeType("sv:file")) {
				KED.utils.common.debugP("!!! File !!!");
				var contentType = KED.utils.common.getPageContentType(nodeArray);
				return ('{"Error":"Cannot use file nodes."}');
			} else {
				var contentType = KED.utils.common.getPageContentType(nodeArray);
			}
			if (contentType == "theme") {
				if (nodeArray[5] !== undefined) {
					foundLearningGoals = true;
					KED.utils.common.debugP("Theme");
					var subjectNode = nodeArray[3];
					var taskContainerNode = nodeArray[5];
					var courseNode = nodeArray[3];
					KED.utils.common.debugP("Checking if " + nodeArray[nodeArray.length - 1] + " is uppdrag !");
					if (nodeArray[nodeArray.length - 1] == "Uppdrag") {
						KED.utils.common.debugP("Mission!");
					}
					KED.utils.common.debugP("Learning goal set to : " + taskContainerNode);
					if (nodeArray[7] !== undefined) {
						if (nodeArray[7].toString() !== node.toString()) {
							var taskContainerNode = nodeArray[7];
							KED.utils.common.debugP("Page in folder changed to : " + taskContainerNode);
						}
					}
				}
			}
			if (contentType == "looped") {
				if (nodeArray[5] !== undefined) {
					foundLearningGoals = true;
					KED.utils.common.debugP("Theme");
					var subjectNode = nodeArray[3];
					var taskContainerNode = nodeArray[5];
					var courseNode = nodeArray[3];
					KED.utils.common.debugP("Learning goal set to : " + taskContainerNode);
					if (nodeArray[8] !== undefined) {
						if (nodeArray[8].toString() !== node.toString()) {
							var taskContainerNode = nodeArray[8];
							KED.utils.common.debugP("Page in folder changed to : " + taskContainerNode);
						}
					}
				}
			}
			if (contentType == "integrated") {
				if (nodeArray[5] !== undefined) {
					foundLearningGoals = true;
					KED.utils.common.debugP("Integrated");
					var subjectNode = nodeArray[5];
					var taskContainerNode = nodeArray[5];
					var courseNode = nodeArray[3];
					KED.utils.common.debugP("Learning goal set to : " + taskContainerNode);
					if (nodeArray[7] !== undefined) {
						if (nodeArray[7].toString() !== node.toString()) {
							var taskContainerNode = nodeArray[7];
							KED.utils.common.debugP("Page in folder changed to : " + taskContainerNode);
						}
					}
				}
			}
			if (contentType == "step") {
				if (nodeArray[5] !== undefined) {
					foundLearningGoals = true;
					KED.utils.common.debugP("Step");
					var subjectNode = nodeArray[2];
					var taskContainerNode = nodeArray[4];
					var courseNode = nodeArray[2];
					KED.utils.common.debugP("Learning goal set to : " + taskContainerNode);
					if (nodeArray[6] !== undefined) {
						if (nodeArray[6].toString() !== node.toString()) {
							var taskContainerNode = nodeArray[6];
							KED.utils.common.debugP("Page in folder changed to : " + taskContainerNode);
						}
					}
					taskStep = endecUtil.unEscapeJcrName(nodeArray[4].getName());
               taskStep =  parseInt(taskStep.replace(/\D/g,''));
				}
			}
			KED.utils.common.debugP("subjectNode = " + subjectNode);
			KED.utils.common.debugP("taskContainerNode = " + taskContainerNode);
			KED.utils.common.debugP("courseNode = " + courseNode);
			if (subjectNode !== undefined) {
				taskCourseName = endecUtil.unEscapeJcrName(courseNode.getName());
				moduleName = endecUtil.unEscapeJcrName(taskContainerNode.getName());
				taskLearningGoal = endecUtil.unEscapeJcrName(taskContainerNode.getName());
				taskURL = node.getProperty("URI").getString();
				taskName = endecUtil.unEscapeJcrName(node.getName());
				taskURL = KED.utils.common.prepareURL(taskURL);
			}
			/*
			name: string
			url: string
			learningGoal: string
			courseName: string
			step?: number
			*/
			KED.utils.common.debugP('{"name": "' + taskName + '","url": "' + taskURL + '","learningGoal": "' + taskLearningGoal + '","courseName": "' + taskCourseName + '"}');
			if (taskStep === "") {
				var outString = '{"name": "' + taskName + '","url": "' + taskURL + '","learningGoal": "' + taskLearningGoal + '","courseName": "' + taskCourseName + '"}';
			} else {
				var outString = '{"name": "' + taskName + '","url": "' + taskURL + '","learningGoal": "' + taskLearningGoal + '","courseName": "' + taskCourseName + '","step": "' + taskStep + '"}';
			}
			var outString = eval('(' + outString.toString() + ')');
			//debugP(outString);
		}
		return (outString);
	}
	var _prepareURL = function(nodeURL) {
		KED.utils.common.debugP("Inside prepareURL(" + nodeURL + ")", "header");
		var startOpen = "javascript:void(window.open('";
		var endOpen = "','_blank','toolbar=1,location=1,status=1,menubar=1,scrollbars=1,resizable=1'));";
		var fileArchive = "/download/";
		var siteURL = "https://ks.kunskapsporten.se";
		var firstCut = nodeURL.indexOf(endOpen);
		if (firstCut > -1) {
			KED.utils.common.debugP("Cleaning window.open link..");
			nodeURL = nodeURL.slice(0, firstCut);
			nodeURL = nodeURL.slice(startOpen.length, nodeURL.length);
			KED.utils.common.debugP("nodeURL cleaned now = " + nodeURL);
		}
		if (nodeURL.indexOf('http') == -1) {
			KED.utils.common.debugP("Adding " + siteURL);
			// Fuskar lite och hårdsätter kg
			nodeURL = siteURL + nodeURL;
		}
		return (nodeURL);
	};
	var _getLearningModuleTasks = function(selectedNode) {
		KED.utils.common.debugP("Inside getLearningModuleTasks(" + selectedNode + ")", "header");
		var nodeArray = [];
		var tasksArray = ["test", "test2"];
		nodeArray = KED.utils.common.getPathArray(selectedNode);
		var outString = null;
		var moduleName = "";
		var moduleURL = "";
		var moduleSubject = "";
		var moduleTaskFolder;
		var courseName = "";
		var courseURL = "";
		var taskFolderNodes = ["/Uppgifter", "/Exercises", "/Uppdrag", "/Tasks"];
		var commonTasks = [];
		var learningGoals = [];
		var foundLearningGoals = false;
		var contentType = KED.utils.common.getPageContentType(nodeArray);
		KED.utils.common.debugP("contentType is set to: '" + contentType + "' !");
		if (contentType == "theme") {
			if (nodeArray[5] !== undefined) {
				foundLearningGoals = true;
				KED.utils.common.debugP("Theme");
				var subjectNode = nodeArray[3];
				var taskContainerNode = nodeArray[5];
				KED.utils.common.debugP("Checking if " + nodeArray[nodeArray.length - 1] + " is uppdrag !");
				if (nodeArray[nodeArray.length - 1] == "Uppdrag") {
					KED.utils.common.debugP("Mission!");
				}
				var courseNode = nodeArray[3];
				var courseModule = nodeArray[5];
			}
			if (nodeArray[4] !== undefined) {
				KED.utils.common.debugP("Checking if " + nodeArray[nodeArray.length - 1] + " is uppdrag !");
				if (nodeArray[nodeArray.length - 1] == "Uppdrag") {
					KED.utils.common.debugP("Mission!");
					foundLearningGoals = true;
					var subjectNode = nodeArray[4];
					var taskContainerNode = nodeArray[4];
					var courseNode = nodeArray[3];
					var courseModule = nodeArray[4];
				}
			}
		}
		if (contentType == "looped") {
			if (nodeArray[5] !== undefined) {
				foundLearningGoals = true;
				KED.utils.common.debugP("Looped");
				var subjectNode = nodeArray[3];
				var taskContainerNode = nodeArray[5]; // get Förberedelse
				var courseModule = nodeArray[5];
				try {
					taskContainerNode = nodeArray[5].getNode("Förberedelse");
				} catch (e) {
					KED.utils.common.debugP(e, "error");
				}
				var courseNode = nodeArray[3];
			}
		}
		if (contentType == "integrated") {
			if (nodeArray[5] !== undefined) {
				foundLearningGoals = true;
				KED.utils.common.debugP("Integrated");
				var subjectNode = nodeArray[5];
				var courseModule = nodeArray[5];
				var taskContainerNode = nodeArray[5];
				var courseNode = nodeArray[3];
			}
			if (nodeArray[4] !== undefined) {
				KED.utils.common.debugP("Checking if " + nodeArray[nodeArray.length - 1] + " is uppdrag !");
				if (nodeArray[nodeArray.length - 1] == "Uppdrag") {
					KED.utils.common.debugP("Mission!");
					foundLearningGoals = true;
					var subjectNode = nodeArray[4];
					var taskContainerNode = nodeArray[4];
					var courseNode = nodeArray[3];
					var courseModule = nodeArray[4];
				}
			}
		}
		if (contentType == "step") {
			if (nodeArray[5] !== undefined) {
				foundLearningGoals = true;
				KED.utils.common.debugP("Step");
				var subjectNode = nodeArray[2];
				var taskContainerNode = nodeArray[4];
				var courseModule = nodeArray[4];
				var courseNode = nodeArray[2];
			}
		}
		if (subjectNode !== undefined) {
			KED.utils.common.debugP("subjectNode = " + subjectNode);
			KED.utils.common.debugP("taskContainerNode = " + taskContainerNode);
			KED.utils.common.debugP("courseNode = " + courseNode);
			moduleSubject = endecUtil.unEscapeJcrName(subjectNode.getName());
			moduleName = endecUtil.unEscapeJcrName(courseModule.getName());
			moduleURL = courseModule.getProperty("URI").getString();
			var taskFolderNode = "";
			taskFolderNodes.forEach(function(name) {
				var savedNode = taskFolderNode;
				try {
					taskFolderNode = taskContainerNode.getNode(name);
				} catch (e) {
					KED.utils.common.debugP(e, "error");
					taskFolderNode = savedNode;
					KED.utils.common.debugP("Reverting to " + savedNode);
				}
			});
			KED.utils.common.debugP("Looped all task folder names.");
			taskFolderNode = taskContainerNode.getNode(taskFolderNode);
			// Course
			courseName = endecUtil.unEscapeJcrName(courseNode.getName());
			courseURL = courseNode.getProperty("URI").getString();
			if (foundLearningGoals === true) {
				KED.utils.common.debugP("CourseModuelTasks", "header");
				KED.utils.common.debugP("moduleName : " + moduleName);
				KED.utils.common.debugP("moduleURL ? : " + moduleURL);
				KED.utils.common.debugP("schoolSubject name : " + moduleSubject);
				KED.utils.common.debugP("schoolSubject course : " + courseName);
				KED.utils.common.debugP("schoolSubject URL : " + courseURL);
				/*KED.utils.common.debugP("LearningGoal","header");

				KED.utils.common.debugP("name : " + courseName);
				KED.utils.common.debugP("courseURL : " + courseURL);*/
				KED.utils.common.debugP("Tasks under folder : " + taskFolderNode.getPath());
				var goals = [];
				for (var learningGoalFolders = taskFolderNode.getNodes(); learningGoalFolders.hasNext();) {
					var learningGoalFolder = learningGoalFolders.next();
					if (learningGoalFolder.isNodeType("sv:folder")) {
						var tasks = [];
						KED.utils.common.debugP("learningGoalFolder : " + learningGoalFolder);
						// commonTasks[commonTasks.length]=package;
						for (var learningTaskPages = learningGoalFolder.getNodes(); learningTaskPages.hasNext();) {
							var learningTaskPage = learningTaskPages.next();
							if (learningTaskPage.isNodeType("sv:link") || learningTaskPage.isNodeType("sv:page") || learningTaskPage.isNodeType("sv:structurePage")) {
								var package = KED.utils.common.packageLearningTask(learningTaskPage);
								//tasks=tasks.push(package);
								tasks[tasks.length] = package;
								//KED.utils.common.debugP("learningTaskPage : " + package);
							}
						}
						var folderName = endecUtil.unEscapeJcrName(learningGoalFolder.getName());
						var goalsText = '{name: "' + folderName + '"';
						if (tasks.length > 0) {
							goalsText += ', tasks: [' + tasks + ']';
						}
						goalsText += '}';
						goals[goals.length] = goalsText;
						KED.utils.common.debugP("Lägger till " + goalsText);
					} else if (learningGoalFolder.isNodeType("sv:link") || learningGoalFolder.isNodeType("sv:page") || learningGoalFolder.isNodeType("sv:structurePage") || learningGoalFolder.isNodeType("sv:link")) {
						var package = KED.utils.common.packageLearningTask(learningGoalFolder);
						//   KED.utils.common.debugP("commonTasks : " + package);
						commonTasks[commonTasks.length] = package;
					}
				}
				KED.utils.common.debugP("commonTasks : " + commonTasks);
				outString = '{moduleName: "' + moduleName + '",subject: {name: "' + moduleSubject + '",course: {name: "' + courseName + '", url: "' + courseURL + '"}},commonTasks: [' + commonTasks + '],learningGoals: [' + goals + ']}';
				var outString = eval('(' + outString.toString() + ')');
			} else {
				outString = null;
			}
		}
		KED.utils.common.debugP("Done! sending this : " + outString);
		return (outString);
	};
	return {
		getUserSchool: _getUserSchool,
		isEmployee: _isEmployee,
		userLpDataRead: _userLpDataRead,
		userLpDataWrite: _userLpDataWrite,
		outputCurrentUserAttributes: _outputCurrentUserAttributes,
		getUserArray: _getUserArray,
		getProp: _getProp,
		prepareURL: _prepareURL,
		getIntro: _getIntro,
		isLinkable: _isLinkable,
		isVisible: _isVisible,
		getURL: _getURL,
		getPageContentType: _getPageContentType,
		findTheseInArray: _findTheseInArray,
		getPathArray: _getPathArray,
		getLearningTaskObject: _getLearningTaskObject,
		getLearningModuleTasks: _getLearningModuleTasks,
		debugP: _debugP,
		packageLearningTask: _packageLearningTask
	};
})();