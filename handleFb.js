/**
 * Functions for manipulate & work with facebook webpage
 */



/**
 * Returns all the new posts in feed
 * @return {Array} 
 */
var getPosts = () => {
    let postsContainers = document.querySelectorAll(
        "div[data-testid='fbfeed_story']:not(.feedButtonSuccess)"
    );

    if (postsContainers.length === 0) {
        // Another options
        postContainers = document.querySelectorAll("*[id*=hyperfeed_story_id]:not(.feedButtonSuccess");
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
    let button = document.createElement("span");
    button.className = "bookmark add";
    button.innerHTML = "&nbsp;";
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
var addButton = (ele,postId,postLink,space) => {
    // Validate element don't has the button
    if(!$(ele).has(".bookmark").length){
        
        $(ele).append('<span class="_6spk" role="presentation" aria-hidden="true"> · </span>');
        $(ele).append(createButton(postId,postLink));
    }
    
}; 

