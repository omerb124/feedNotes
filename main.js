/**
 * Main file for content script
 * - Injects 'add note' for each post on FB feed
 * - Adds proper listeners
 */

var main = () => {
    let a = {};

    /**
     * Adds listeners to doucment elements
     * @void
     */
    var addListeners = () => {

        jq('div[id="content"]').on("DOMNodeInserted", () => {
            // jq('div[data-testid="fbfeed_story"]').on("DOMNodeInserted", () => {
            //     console.log("HEY HEY HEY");
            //     handleNewPosts();
            // });
            let events = getEvents($('div[data-testid="fbfeed_story"]').first()[0]);
            if (!events) {
                jq('div[data-testid="fbfeed_story"]').on("DOMNodeInserted", () => {
                    handleNewPosts();
                });
            }
        });

    }

    /**
     * Handling scrolling and additional posts on feed
     * @void
     */
    var handleNewPosts = () => {
        placeButtons();
    };

    /**
     * Injects buttons into facebook feed for each post
     * @void
     * */
    var placeButtons = () => {

        /**
         * TODO: find the differences between ads posts to regular posts
         */

        // Find the whole posts containers
        let postsList = getPosts();
        if (!postsList || postsList.length === 0) {
            return;
        }

        console.log(postsList);

        console.log(postsList.length + " new posts has been found");
        let space = $("body").find("div[id*='feed_subtitle'] span:contains(' · ')").first()[0];
        console.log(space);
        if (!space) {
            space = document.createElement("span");
            space.innerHTML = " ";
        }
        $(space).addClass("spaceFeedNotes");

        $.each(postsList, (index, ele) => {

            let postId = $(ele).find("input[name='ft_ent_identifier']").first().attr("value");
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
                // console.log("Bookmark cant be added to postid '" + postId + "'.");

            }

            if (subtitle_container && !$(ele).has(".bookmark").length) {
                // let space = $(ele).find("div[id*='feed_subtitle'] span:contains(' · ')").first();
                // space.addClass("spaceFeedNotes");
                // console.log(subtitle_container);

                addButton(subtitle_container, postId, postUrl, space);

                if (!$(ele).has(".bookmark").length) {
                    console.log("Failed " + postId);
                }
                else {
                    $(ele).addClass("feedButtonSuccess");
                    console.log("Success " + postId);
                }
            }




        });

    };

    a.init = () => {

        // Injecting jquery into webpage
        injectScript({ file: "/assets/js/jquery-3.3.1.min.js" })
            .then(
                () => {
                    console.log("Jquery has been injected.");

                    // Adding Listeners
                    addListeners();

                    // Placing 'add' and 'remove' buttons nearby posts
                    placeButtons();
                })
            .catch(
                (err) => {
                    console.error("Error has been occurred during injecting scripts: " + err);
                }
            )





        // ...

        return a;
    }

    return a.init();

}

main();


