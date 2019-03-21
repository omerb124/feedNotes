/**
 * Main file for content script
 * - Injects 'add note' for each post on FB feed
 * - Adds proper listeners
 */

var main = () => {
    let a = {};

    a.settings = {};

    const posts_containers = [];

    /**
     * Adds listeners to doucment elements
     * @void
     */

    var addListeners = () => {

        // jq('div[id="content"]').on("DOMNodeInserted", () => {
        //     // jq('div[data-testid="fbfeed_story"]').on("DOMNodeInserted", () => {
        //     //     console.log("HEY HEY HEY");
        //     //     handleNewPosts();
        //     // });
        //     let events = getEvents($('div[data-testid="fbfeed_story"]').first());
        //     if (!events) {
        //         jq('div[data-testid="fbfeed_story"]').on("DOMNodeInserted", (evt) => {
        //             handleNewPost(evt);
        //         });
        //     }
        // });
        
        // Feed posts
        $(document).on('DOMNodeInserted', 'div[data-testid="fbfeed_story"]', (evt) => {
            handleInsertedNewPost(evt,'feed');
        });

        // Group page posts
        $(document).on('DOMNodeInserted', "div[id*='mall_post']:not([id*='SUGGESTED'])", (evt) => {
            handleInsertedNewPost(evt,'group');
        });

        // Page posts
        $(document).on('DOMNodeInserted', "#pagelet_timeline_main_column div[role='article']", (evt) => {
            handleInsertedNewPost(evt,'page');
        });

        // Events pages posts
        $(document).on('DOMNodeInserted', "div[id*='mall_post'][role='article'], div[id*='event_post'][role='article']", (evt) => {
            handleInsertedNewPost(evt,'event');
        });
    }

    /**
     * Handling listener of inserting new post to feed
     * @param {Object} evt - event listener object
     * @param {String} type - post source type (group page post, feed post)
     * @void
     */
    var handleInsertedNewPost = (evt,type) => {
        // Check if post has already been added
        console.log
        if (!posts_containers.includes(evt.currentTarget)) {
            // Add new post to list
            let newPost = evt.currentTarget;
            posts_containers.push(
                newPost
            );

            console.log("Post has been added");

            // Execute actions on post
            handlePost(newPost);
            //console.log(newPost);
        }
        // else{
        //     console.log("Post has already been added to list.");
        // }

    };

    /**
     * Handling post container - doing all the job on the post
     * @param {Object} postContainer - Container of post 
     */
    var handlePost = (postContainer) => {
        console.log(postContainer);
        // break;
        placeButtons(postContainer);
    };

    /**
     * Handling situation of page loaded - neccessary if many posts was already
     * loaded, so DOMInserted event won't be fired.
     * Because of that, we must handle it manually :)
     * 
     * @void
     */
    var handlePageLoad = () => {

    };

    var devTests = () => {
        setTimeout(() => {console.log($("div[id*='feed_subtitle'] a[rel='theater']"))}, 5000);
    };

    a.init = () => {

        // Injecting jquery into webpage
        injectScript({ file: "/assets/js/jquery-3.3.1.min.js" })
            .then(
                () => {
                    console.log("Jquery has been injected.");

                    // Handle configuration and settings
                    a.settings = getFbSettings();

                    console.log(a.settings);
                    // Adding Listeners
                    addListeners();

                    // Execute dev tests
                    devTests();

                    //handlePageLoad();
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


