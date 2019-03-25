/**
 * Notes
 */

class Note {

    /**
     * 
     * @param {String} content - post's content
     * @param {String} postUrl - contains post's url
     * @param {String} photoUrl- photo url
     * @param {Object} info - post's info (facebook id (fb_id), publishing date (publishing_date), author name and id) 
     * @param {String} label - label's id (default to 1 - default label)
     */
    constructor(content, postUrl, photoUrl, info, label) {
        this.content = content;
        this.url = postUrl;
        this.photoUrl = photoUrl;
        this.fbId = info['fb_id'];
        this.publishingDate = info['publishing_date'];
        this.author = { name: info['author_name'], id: info['author_id'] };
        this.label = label || 1;

        // Generate unique ID
        this.id = "n" +(Math.random().toString(36).substring(2, 15) +
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
        return new Promise((resolve,reject) => {
            chrome.storage.local.get('notes', (notesList) => {

                let filteredList = notesList.notes.filter((n) => n.id === noteId);
                if(filteredList.length === 0){
                    reject("Note with ID:" + noteId + " wasn't found.");
                }
                else if(filteredList.length === 1){
                    let currentNote = filteredList[0];
                    // Change label
                    currentNote.label = labelId;

                    // Update storage about new label
                    let noteIndex = notesList.notes.indexOf(currentNote);
                    notesList.notes[noteIndex] = currentNote;
     
                    chrome.storage.local.set({notes : notesList.notes},() => {
                        resolve(true);
                    });
                }
                else{
                    reject("Error");
                }
            });
        });
    }
}