/**
 * Label class
 */

class Label {

    /**
     * Creating Label
     * @param {String} name 
     * @param {String} faIconId - font awesome icon's ID (Optional) (Default to "sticky-note")
     */
    constructor(name, faIconId) {

        // Declare on default icon
        faIconId = faIconId || "sticky-note";

        // Genereate unique ID for label
        this._isLabelNameAvailable(name)
            .then(() => {
                // Name is available

                // Generate unique ID for label
                this.id = "l" + (Math.random().toString(36).substring(2, 15) +
                    Math.random().toString(36).substring(2, 15));

                this.faIconId = faIconId;
                
                this.name = name;

                // Add the label to storage
                this._addToStorage().catch((err) => console.log("Cant add label to storage: " + err));
            })
            .catch((err) => {
                // Name is unavailable
                console.log(err);
                return;
            });


    }

    /**
     * Adding label to storage
     * @return {Promise}
     */
    _addToStorage = () => {
        var newLabel = this;
        return new Promise((resolve, reject) => {
            chrome.storage.local.get('labels', (l) => {
                // Get current labels list
                let currentLabelsList = l.labels;
                currentLabelsList.push(newLabel);

                chrome.storage.local.set({ labels: currentLabelsList }, () => {
                    resolve();
                });
            });
        });
    };

    /**
     * Checking if label's name is available
     * @param {String} name - future label name
     * @return {Promise}
     */
    _isLabelNameAvailable = (name) => {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get('labels', (l) => {
                let labelsList = l.labels;

                // Create a filtered list for checking if name is already taken
                let filitered = labelsList.filter((a) => {
                    return a.name === name
                });
                if (filitered.length === 0) {
                    // Available
                    resolve();
                }
                else {
                    // Taken
                    reject("Name is already taken");
                }
            });
        });
    };

    /**
     * Returns label's name by given ID
     * @param {Integer} id - label's id
     * @return {Promise}
     */
    static findNameById = (id) => {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get('labels', (l) => {
                var result = l.labels.filter((g) => g.id === id);
                if (result.length > 0) {
                    resolve(result[0].name);
                }
                else {
                    reject(null);
                }
            });
        });
    }

    /**
     * Get 3 most favorite labels
     * @return {Promise}
     */
    static getTopLabels = () => {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get('labels', (l) => {
                if (l.labels.length > 0 && l.labels < 4) {
                    resolve(l.labels);
                }
                else {
                    resolve(l.labels.slice(0, 3));
                }
            });
        });
    };
}