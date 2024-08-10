const bushido = {
  loaded: false,
  sdk: null,
  db: null,
  firebaseApp: null,
  access() {
    var self = this;
    return new Promise((resolve, reject) => {
      if (bushido.db == null || bushido.loaded == false || !bushido.db) {
        var script = document.createElement("script");
        script.type = "module";
        script.textContent = `import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js"
import * as fbfs from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

if (bushido){
  bushido.sdk = fbfs;
  const appfb = initializeApp(config.firebaseConfig);
  bushido.db = fbfs.getFirestore(appfb);
  bushido.firebaseApp = appfb;
  bushido.loaded = true;
  }`;

        var timer = setInterval(function() {
          if (bushido.loaded) {
            resolve()
            clearInterval(timer)
          }
        })

        document.head.appendChild(script);
      } else {
        resolve()
      }
    })
  },
  set(collection, data) {
    return new Promise((resolve, reject) => {
      bushido.access().then(function() {
        bushido.sdk.setDoc(bushido.sdk.doc(bushido.db, collection), data).then(resolve)
      })
    })
  },
  getCollection(collection, name) {
    return new Promise((resolve, reject) => {
      bushido.access().then(function() {
        bushido.sdk.getDocs(bushido.sdk.collection(bushido.db, collection)).then(resolve)
      })
    })
  },
  get(collection, name) {
    return new Promise((resolve, reject) => {
      bushido.access().then(function() {
        bushido.sdk.getDoc(bushido.sdk.doc(bushido.db, collection, name)).then(resolve)
      })
    })
  },
  useQuery(collectionName, where) {
    return new Promise((resolve, reject) => {

      var wh = [];

      bushido.access().then(function() {
        where.forEach(function(item) {
          wh.push(bushido.sdk.where(item[0], item[1], item[2]));
        });


        bushido.sdk.getDocs(
          bushido.sdk.query(bushido.sdk.collection(
              bushido.db, collectionName),
            ...wh)).then(function(item) {
          resolve(item)
        })
      })
    })
  }
}


bushido.useQuery('accounts', [
  ['title', '==', 'qwerty']
  ])