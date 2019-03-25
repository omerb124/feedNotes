/**
 * Utilities file 
 */

/**
 * Injecting script to active tab via background script
 * @param {Object} injectDetails - object of inject details, like file or code to execute.
 */

var injectScript = (injectDetails) => {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
            {
                type: "injectScript",
                data: {
                    injectDetails: injectDetails
                }
            }, function (response) {
                console.log("Response has been recieved:");
                console.log(response);
                if (response.status !== 200) {
                    reject("Error " + response.status + " during InjectScript() execution:" + response.message);
                }
                else {
                    resolve(response.data);
                }
            });
    });
}

/**
 * @param {Object} element - element to check events on
 * @return {Array}
 */
var getEvents = (element) => {
    var elemEvents = $._data(element, "events");
    var allDocEvnts = $._data(document, "events");
    for (var evntType in allDocEvnts) {
        if (allDocEvnts.hasOwnProperty(evntType)) {
            var evts = allDocEvnts[evntType];
            for (var i = 0; i < evts.length; i++) {
                if ($(element).is(evts[i].selector)) {
                    if (elemEvents == null) {
                        elemEvents = {};
                    }
                    if (!elemEvents.hasOwnProperty(evntType)) {
                        elemEvents[evntType] = [];
                    }
                    elemEvents[evntType].push(evts[i]);
                }
            }
        }
    }
    return elemEvents;
}

/**
 * Creating popover content element for clicking event
 * @param {String} type - button type (add/ remove)
 * @return {Object} - Content element
 */
var createPopoverContentElement = (type) => {
    type = type || null;
    switch (type) {
        case 'add':
            return new Promise((resolve, reject) => {
                Label.getTopLabels().then((result) => {
                    console.log(result);
                    let ele = document.createElement("div");
                    ele.class = "popoverContentContainer";

                    // Create element's inner HTML
                    let html = '<ul class="list-group tags_list">';

                    // Adding each favorite label to popover fast-selection
                    for (let i = 0; i < result.length; i++) {
                        html += '<li class="list-group-item tag">';
                        html += '<i class="fa fa-' + result[i]['faIconId'] + '"></i>';
                        html += '<span class="label_name" data-label-id="' + result[i]['id'] + '">' + result[i]['name'] + '</span></li>';
                    }

                    // Adding 'add label' in the end of the popover
                    html += '<li class="list-group-item addTag"><i class="fas fa-plus-circle"></i> הוסף תווית...</li>';

                    // Close button
                    html += '</ul><button class="btn close">X</button>';

                    // Appending html to element
                    console.log(html);
                    ele.innerHTML += html;
                    resolve(ele.outerHTML);
                });
            });

            break;
        case 'remove':

            break;
        default:
        // DO NOTHING
    }
}

/**
 * Finding the closest add's bookmark button (for the most closest post) for given element
 * @param {DOM Object} element - the given element
 * @return {DOM Object}
 */
var findClosetstBookmarkButton = (element) => {
    return $(element).closest("div[data-testid='fbfeed_story']").first().find(".bookmark.add").first() || null;
};