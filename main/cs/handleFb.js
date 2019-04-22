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
        if (val.toLowerCase().indexOf('locale') !== -1) {
            language = val;
        }
    });

    return {
        writingDirection: writingDirection,
        currentUrl: currentUrl,
        language: language
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
        postContainers = document.querySelectorAll(
            `
            *[id*=hyperfeed_story_id_]:not(.feedButtonSuccess):not(.feedButtonFail),
            *[id*=jumper_]:not(.feedButtonSuccess):not(.feedButtonFail),
            *[id*=mall_post_]:not(.feedButtonSuccess):not(.feedButtonFail)
            `
        );
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

var createButton = (postId, postLink) => {
    let button = document.createElement("a");
    button.className = "bookmark add";
    button.innerHTML = "&nbsp;";
    button.setAttribute("tabindex", "0");
    button.setAttribute("data-toggle", "popover");
    button.setAttribute("data-placement", "right");
    button.setAttribute("data-container", "body");
    button.setAttribute("post-id", postId);
    button.setAttribute("post-url", postLink);
    return button;
};

/**
 * Adding button to element
 * @param {Object} element
 * @param {String} postLink - post URL
 * @param {String} postContainerUniqueID - post container element's unique ID
 * @param {Object} space - space element ("•")
 * @void
 */
var addButton = (ele, postLink, postContainerUniqueID) => {
    // Validate element don't has the button
    if (!$(ele).has(".bookmark").length) {

        Note.createPopoverContentElement("add", postContainerUniqueID).then((result) => {
            $(ele).append('<span class="_6spk" role="presentation" aria-hidden="true"> · </span>');
            let newBtn = createButton(postContainerUniqueID, postLink);
            $(ele).append(newBtn);
            $(newBtn).popover({
                title: 'בחר תווית לשמירת הפוסט:',
                container: 'body',
                html: true,
                trigger: 'focus',
                content: result
            });
        });

    }
    else {
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

        let postUrl = $(ele).find("div[id*='feed_subtitle'] a[target], div[id*='feedsu_btitle'] a[target]").first().attr("href");

        let subtitle_container = null;
        if ($(ele).has("div[id*='feed_subtitle'], div[id*='feedsu_btitle']").length) {
            // Normal post
            // console.log("2");
            subtitle_container = $(ele).find("div[id*='feed_subtitle'], div[id*='feedsu_btitle']").first();
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

            // Get post container for passing post's unique ID as parameter for addButton function
            /**
             * mall_post_ -> group post
             * hyperfeed_story_id_ -> feed post
             * jumper_ -> profile post
             */
            let postContainer = $(ele).closest("div[id*='hyperfeed_story_id_'], div[id*='mall_post_'], div[id*='jumper_']")[0] || null;
            console.log(postContainer);

            let postContainerUniqueID = postContainer ? postContainer.id : null;

            if (postContainerUniqueID === null) {
                console.log(postContainer);
            }

            addButton(subtitle_container, postUrl, postContainerUniqueID);

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

/**
 * Returns the post data by given post's container
 * @param {DOM Object} container - post's container object
 * @return {Object}
 */
var extractPostDataFromContainer = (container) => {
    console.log(container);

    // Invalid post's container
    if (!container.id.includes("hyperfeed_story_id_") &&
        !container.id.includes("jumper_") &&
        !container.id.includes("mall_post_")
    ) return false;

    // Valid container
    let data = {};

    // Post content
    let content = $(container).find(".userContent").first().find("p");
    if (content.length === 0) {
        // Maybe no content?
        // Checks if spans are exisiting
        content = $(container).find(".userContent span[aria-hidden='true']:not(:has(*))").first();
        console.log(content);
        if (content[0].innerHTML.length === 0) {
            // No content
            data.content = null;
        }
        else {
            data.content = content[0].innerHTML;
        }



    }
    else if (content.length === 1) {
        // Single paragraph
        data.content = content[0].innerHTML;
    }
    else {
        // Multiple paragraphs
        data.content = "";
        $(content).map((i, v) => {
            data.content += v.innerHTML;
        });
        console.log(data.content);
    }

    // Post publishing date
    let timestamp = container.dataset["timestamp"];
    let date;
    if (timestamp) {
        // If timestamp dataset exists
        if (timestamp) {
            localDate = new Date(timestamp * 1000);
            date = localDate.toLocaleDateString() + " " + localDate.toLocaleTimeString();
        } else {
            date = "none";
        }
    }
    else if(container.dataset["store"]){
        // timestamp dataset is not exists, lets check about datastore
        let datastore = container.dataset["store"];
        let obj = JSON.parse(datastore);
        date = obj.timestamp || "none";
    }
    else{
        // use classic way to fetch the timestamp
        date = $(container).find("div[id*=feed_subtitle_]").first().find("abbr").first()[0].dataset['utime'] || "none";
    }

    data.publishingDate = date;

    // Post's photo
    let photo = $(container).find("a[ajaxify*='photo.php'][href*='photo.php'] img,a[ajaxify*='photos/'][href*='photos/'] img").first();
    data.photo = null;
    if (photo.length !== 0) {
        // Photo exists, lets save the first one
        let photoElement = photo[0];
        let photoUrl = $(photoElement).attr("src") || null;
        if (photoUrl) {
            data.photo = photoUrl;
        }
    }
    else {
        console.log(photo);
    }


    // Post's URL
    let url = null;
    url = "https://facebook.com" + $(container).find("div[id*='feed_subtitle'] a[target]").first().attr("href") || false;
    if (!url) {
        // Cannot find direct URL
        // Lets find FB id of post
        let postId = $(container).find("input[name='ft_ent_identifier']").first().attr("value");
        url = "https://facebook.com/" + postId;
    }
    data.postUrl = url;

    // Post's author
    let authorImageElement = $(container).find("a[data-hovercard*='/ajax/hovercard/user.php?'], a[data-hovercard*='/ajax/hovercard/page.php?']").first().find("img")[0];
    let authorName = $(authorImageElement).attr("aria-label");
    let authorImageUrl = $(authorImageElement).attr("src");
    data.author = {
        name: authorName,
        imgUrl: authorImageUrl
    };

    console.log(data);
    return data;
};

