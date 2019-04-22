/**
 * Notes
 */

class Note {

    /**
     * 
     * @param {Object} data - note's data to push into chrome storage
     * @param {String} labelId - label's id (default to 1 - default label)
     */
    constructor(data, labelId) {
        this.data = data;
        this.labelId = labelId;

        // Generate unique ID
        this.id = "n" + (Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15));

        // Add note to storage
        this._addToStorage()
            .then(() => { console.log("Note added to storage") })
            .catch((r) => console.log("Cannot add note to storage: " + r));
    }

    /**
     * Adding note to chrome local storage
     * @void
     */
    _addToStorage = () => {
        var note = this;
        return new Promise((resolve, reject) => {
            // Get current notes list
            chrome.storage.local.get('notes', (notes) => {

                // Add note to current notes list
                let currentList = notes.notes;
                currentList.push(note);

                // Update storage about new note
                chrome.storage.local.set({ notes: currentList }, () => {
                    resolve(true);
                });

            });
        });
    };

    /**
     * STATIC METHOD
     * Removing note by given ID
     * @param {Integer} id
     * @void
     */
    static remove = (id) => {
        return Promise((resolve, reject) => {
            // Get current notes list
            chrome.storage.local.get('notes', (notesList) => {
                // Generate new list
                let newList = notesList.notes.filter((a) => { a.id !== id });

                // Update storage about new list
                chrome.storage.local.set({ notes: newList }, () => {
                    resolve(true);
                })
            });
        });
    };


    /**
     * STATIC METHOD
     * Change label for note by given note ID and given label ID
     * @param {Integer} noteId - id of given note
     * @param {Integer} labelId - id of future label
     * @return {Promise}
     */
    static changeLabel = (noteId, labelId) => {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get('notes', (notesList) => {

                let filteredList = notesList.notes.filter((n) => n.id === noteId);
                if (filteredList.length === 0) {
                    reject("Note with ID:" + noteId + " wasn't found.");
                }
                else if (filteredList.length === 1) {
                    let currentNote = filteredList[0];
                    // Change label
                    currentNote.label = labelId;

                    // Update storage about new label
                    let noteIndex = notesList.notes.indexOf(currentNote);
                    notesList.notes[noteIndex] = currentNote;

                    chrome.storage.local.set({ notes: notesList.notes }, () => {
                        resolve(true);
                    });
                }
                else {
                    reject("Error");
                }
            });
        });
    }

    /**
     * Adding note to the given label + Extracting the neccessary data from the element
     * @param {DOM Event Object} ele - given clicked element of chosen label for new note
     * @void
     */
    static add = (ele) => {
        let post; // Post's container
        let labelId; // Label ID

        console.log(ele);
        if (ele.tagName.toLowerCase() === "span" || ele.tagName.toLowerCase() === "i") {
            // Click has been executed not on the LI, but on one of the children
            let li = $(ele).closest("li.list-group-item.tag")[0];
            labelId = li.dataset['labelId']; // Get label ID
            let postContainerId = li.dataset['postContainerId'];

            if(postContainerId){
                post = $('div[id="' + postContainerId + '"]')[0];
                console.log(post);
            }
            else{
                console.log("Cannot find post container");
                console.log(ele);
            }

        }
        else if (ele.tagName.toLowerCase() === "li") {
            // Click has been executed on the LI element
            labelId = ele.dataset['labelId']; // Get label ID
            let postContainerId = ele.dataset['postContainerId'];
            if(postContainerId){
                post = $('div[id="' + postContainerId + '"]')[0];
                console.log(post);
            }
            else{
                console.log("Cannot find post container");
                console.log(ele);
            }
        }
        else{
            // Element is not recognized as valid element for action
            console.log("Element is not recognized as valid element for action");
            return;
        }

        let data = extractPostDataFromContainer(post);

        // Generate new note
        var note = new Note(data,labelId);

    };

    /**
     * Creating popover content element for clicking event
     * @param {String} type - button type (add/ remove)
     * @param {String} postContainerUniqueID - post's container's unique ID
     * @return {Object} - Content element
     */
    static createPopoverContentElement = (type,postContainerUniqueID) => {
        type = type || null;
        switch (type) {
            case 'add':
                return new Promise((resolve, reject) => {
                    Label.getTopLabels().then((result) => {
                        console.log(result);
                        let ele = document.createElement("div");
                        ele.class = "popoverContentContainer";

                        let ulList = document.createElement("ul");
                        ulList.className = "list-group tags_list";

                        // Adding each favorite label to popover fast-selection
                        for (let i = 0; i < result.length; i++) {
                            let liMember = document.createElement("li");
                            liMember.className = "list-group-item tag";
                            liMember.setAttribute("data-label-id", result[i]['id']);
                            liMember.setAttribute("data-post-container-id", postContainerUniqueID);

                            // Create icon's element
                            let faIcon = document.createElement("i");
                            faIcon.className = "fa fa-" + result[i]['faIconId'];
                            liMember.appendChild(faIcon);

                            // Create button's element
                            let aButton = document.createElement("span");
                            aButton.className = "label_name";
                            aButton.innerHTML = result[i]['name'];

                            //aButton.setAttribute("onclick","Note.add(this)");
                            liMember.appendChild(aButton);

                            // Add label to list
                            ulList.appendChild(liMember);
                        }

                        // Adding 'add label' in the end of the popover
                        let addNewLabelLi = document.createElement("li");
                        addNewLabelLi.className = "list-group-item addTag";
                        let addNewLabelIcon = document.createElement("i");
                        addNewLabelIcon.className = "fas fa-plus-circle";
                        addNewLabelLi.appendChild(addNewLabelIcon);
                        addNewLabelLi.innerHTML += " הוסף תווית...";

                        ulList.appendChild(addNewLabelLi);

                        ele.appendChild(ulList);


                        //ele.getElementsByTagName("span")[0].setAttribute("data-label-id",result[i]['id']);
                        resolve(ele);
                    });
                });

                break;
            case 'remove':

                break;
            default:
            // DO NOTHING
        }
    }
}