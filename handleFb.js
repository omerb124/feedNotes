/**
 * Functions for manipulate & work with facebook webpage
 */


/**
 * Handling facebook page, its' configuration and 
 * additional settings, like checking LTR/RT or feed language
 *
 * @void
 */
 var getFbSettings = () => {
    const writingDirection = $("body").attr("dir");
    const currentUrl = window.location.href.toString();
    
    let bodyClasses = $("body").attr("class").split(" ");
    //console.log(bodyClasses);
    var language = "unknown";
    bodyClasses.forEach((val) => {
        if(val.toLowerCase().indexOf('locale') !== -1){
            language = val;
        }
    });
    
    return { 
        writingDirection : writingDirection,
        currentUrl : currentUrl,
        language : language
    };

 };

/**
 * Returns all the new posts in feed
 * @return {Array} 
 */
var getPosts = () => {
    let postsContainers = document.querySelectorAll(
        "div[data-testid='fbfeed_story']:not(.feedButtonSuccess):not(.feedButtonFail)"
    );

    if (postsContainers.length === 0) {
        // Another options
        postContainers = document.querySelectorAll("*[id*=hyperfeed_story_id]:not(.feedButtonSuccess):not(.feedButtonFail)");
        if (!postsContainers || postsContainers.length === 0) {
            return false;
        }
    }

    // Mark elements
    let list = Array.from(postsContainers);
    // list.map((ele) => {
    //     $(ele).addClass("feedNotesButton");
    // });

    // Convert nodeList to an Array
    return list;
};

/**
 * Creating button for adding note
 * @param {String} postId - post unique ID
 * @param {String} postLink - post URL
 * @return {Object}
 */

var createButton = (postId,postLink) => {
    let button = document.createElement("a");
    button.className = "bookmark add";
    button.innerHTML = "&nbsp;";
    button.setAttribute("tabindex","0");
    button.setAttribute("data-toggle","popover");
    button.setAttribute("data-placement","right");
    button.setAttribute("data-container","body");
    button.setAttribute("post-id",postId);
    button.setAttribute("post-url",postLink);
    return button;
};

/**
 * Adding button to element
 * @param {Object} element
 * @param {String} postId - post unique ID
 * @param {String} postLink - post URL
 * @param {Object} space - space element ("•")
 * @void
 */
var addButton = (ele,postId,postLink) => {
    // Validate element don't has the button
    if(!$(ele).has(".bookmark").length){

        $(ele).append('<span class="_6spk" role="presentation" aria-hidden="true"> · </span>');
        let newBtn = createButton(postId,postLink);
        $(ele).append(newBtn);
        $(newBtn).popover({
            title: 'בחר תגית לשמירת הפוסט:',
            container: 'body',
            html: true,
            trigger : 'focus',
            content: createPopoverContentElement("add")
        });
    }
    else{
        console.log("Already added");
    }
    
}; 


/**
 * Place buttons on specific element
 * @param {Object} ele - element object to place buttons on 
 * @return {Boolean}
 */
var placeButtons = (ele) => {
    let doneList = [];
    let failList = [];

    let postId = $(ele).find("input[name='ft_ent_identifier']").first().attr("value");
    console.log(postId);
    if (!postId) {
        // TODO - find a unique identifier to those posts
        postId = "unknown";
        return false;
    }
    if (!doneList.includes(ele) && !failList.includes(ele) && postId !== "unknown") {

        let postUrl = $(ele).find("div[id*='feed_subtitle'] a[target]").first().attr("href");

        let subtitle_container = null;
        if ($(ele).has("div[id*='feed_subtitle']").length) {
            // Normal post
            // console.log("2");
            subtitle_container = $(ele).find("div[id*='feed_subtitle']").first();
            // console.log(subtitle_container);
        } else if ($(ele).has(".userContentWrapper span.uiStreamAdditionalLogging").length) {
            // May be an ad
            // console.log("1");
            subtitle_container = $(ele).find("span.uiStreamAdditionalLogging").first().parent();
            // console.log(subtitle_container);
        }
        else {
            // Unknown post type
            console.log("Bookmark cant be added to postid '" + postId + "'.");
            return false;

        }
        console.log(subtitle_container);
        if (subtitle_container && !$(ele).has(".bookmark").length) {
            // let space = $(ele).find("div[id*='feed_subtitle'] span:contains(' · ')").first();
            // space.addClass("spaceFeedNotes");
            // console.log(subtitle_container);

            addButton(subtitle_container, postId, postUrl);

            if (!$(ele).has(".bookmark").length) {
                console.log("Failed " + postId);
                return false;
            }
            else {
                $(ele).addClass("feedButtonSuccess");
                console.log("Success " + postId);
                doneList.push(postId);
                return true;
            }
        }
        doneList.push(postId);
    } else {
        failList.push(ele);
        $(ele).addClass("feedButtonFail");

        return false;
    }
};