var App = {};

App.init = function () {
	// indexedDB sanity check
	window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	
	App.db = null;	// Reference for db 
	
	App.objectStore = {}
	App.objectStore.todos = "todos";	// Stores objectStore (aka collection) Can have many, just rename accordinglingly
	
	// Make request
	var request = window.indexedDB.open("myDB", 2);
	
	request.onsuccess = function (e) {
		App.db = e.target.result;	
		console.log("DB Initialized.");
		
		App.getData();
	};	
	
	request.onupgradeneeded = function (e) {
		App.db = e.target.result;
		
		var objectStore = App.db.createObjectStore(App.objectStore.todos, {autoIncrement: true});
		
		objectStore.transaction.oncomplete = function (e) {
			console.log("DB created.")
		}
	};
	
	request.onerror = function (e) {
		console.log("DB ERROR: " + e.target.errorCode);
	};
	
};

App.getData = function () {
	var objectStore = App.db.transaction(App.objectStore.todos).objectStore(App.objectStore.todos);
	
	objectStore.openCursor().onsuccess = function (e) {
		var cursor = e.target.result;
		
		if (cursor) {
			console.log(cursor.key, cursor.value);
			cursor.continue();
		} else {
			console.log("No more entries.");
		}
	}
};

App.addData = function (data) {
	if (!data) {
		console.log("Please provide data!");
		return;
	}
	
	var transaction = App.db.transaction([App.objectStore.todos], "readwrite");	
	
	transaction.oncomplete = function (e) {
		console.log("Data added.");	
	};
	
	transaction.onerror = function (e) {
		console.log("Add ERROR: " + e.target.errorCode);
	};
	
	var objectStore = transaction.objectStore(App.objectStore.todos);
	
	var request = objectStore.add(data);
	
	request.onsuccess = function (e) {
		
	};
	
};


App.removeData = function (key) {
	if (!key) {
		console.log("Please provide a key to remove data");
		return;
	}	
	
	var request = App.db.transaction([App.objectStore.todos], "readwrite").objectStore(App.objectStore.todos).delete(key);
	
	request.onsuccess = function (e) {
		console.log("Data removed.");	
	};
	
	request.onerror = function (e) {
		console.log("Data not deleted || Key doesn't exist.");	
	};
};

App.updateData = function (key, newData) {
	if (!key || !newData) {
		console.log("Please provide a key and data to update data");
		return;
	}
	
	var objectStore = App.db.transaction([App.objectStore.todos], "readwrite").objectStore(App.objectStore.todos);
	var request = objectStore.get(key);
	
	request.onsuccess = function (e) {
		var data = request.result;
		data = newData;
		
		var requestUpdate = objectStore.put(data, key);
		
		requestUpdate.onsucess = function (e) {
			console.log("Data Updated.");
		};
		
		requestUpdate.onerror = function (e) {
			consoel.log("Data update failed.");
		};
	};
};

App.init();		

