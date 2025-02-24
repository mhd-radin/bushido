const bushido = {
  loaded: false,
  sdk: null,
  db: null,
  firebaseApp: null,
  BOT_URL_ENDPOINT: "https://wbot-bodg.onrender.com/",
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
            resolve();
            clearInterval(timer);
          }
        });

        document.head.appendChild(script);
      } else {
        resolve();
      }
    });
  },
  set(collection, data, opt) {
    return new Promise((resolve, reject) => {
      bushido.access().then(function() {
        data = typeof data == "function" ? data(bushido.sdk) : data;
        bushido.sdk
          .setDoc(bushido.sdk.doc(bushido.db, collection), data, opt)
          .then(resolve);
      });
    });
  },
  getCollection(collection) {
    return new Promise((resolve, reject) => {
      bushido.access().then(function() {
        bushido.sdk
          .getDocs(bushido.sdk.collection(bushido.db, collection))
          .then(resolve);
      });
    });
  },
  get(collection, name) {
    return new Promise((resolve, reject) => {
      bushido.access().then(function() {
        bushido.sdk
          .getDoc(bushido.sdk.doc(bushido.db, collection, name))
          .then(resolve);
      });
    });
  },
  useQuery(collectionName, where, orderBy = []) {
    return new Promise((resolve, reject) => {
      var wh = [];
      var ordBy = [];

      bushido.access().then(function() {
        where.forEach(function(item) {
          wh.push(bushido.sdk.where(item[0], item[1], item[2]));
        });

        orderBy.forEach(function(item) {
          ordBy.push(bushido.sdk.orderBy(item[0], item[1]));
        });

        bushido.sdk
          .getDocs(
            bushido.sdk.query(
              bushido.sdk.collection(bushido.db, collectionName),
              ...wh,
              ...ordBy
            )
          )
          .then(function(item) {
            resolve(item);
          });
      });
    });
  },
  onSet(ref, handle, type = "collection", setup) {
    bushido.access().then(function() {
      var orgRef = bushido.sdk[type](bushido.db, ref);
      let unsub = bushido.sdk.onSnapshot(orgRef, handle);
      if (typeof setup == 'function') setup(unsub);
    });
  },
  toData(snapshot) {
    var data = [];
    snapshot.forEach(function(item) {
      data.push(item);
    });
    return data;
  },
  realtime: {
    inited: false,
    api: null,
    db: null,
    setup() {
      var self = this;
      return new Promise((resolve, reject) => {
        if (bushido.realtime.inited == false || bushido.realtime.api == null) {
          var script = document.createElement("script");
          script.type = "module";
          script.textContent = `
//import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js"
import * as rt from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

if (bushido){
  bushido.realtime.api = rt;
  bushido.realtime.inited = true;
  bushido.realtime.db = rt.getDatabase(bushido.firebaseApp);
  }`;

          var timer = setInterval(function() {
            if (bushido.realtime.inited) {
              resolve();
              clearInterval(timer);
            }
          });

          document.head.appendChild(script);
        } else {
          resolve();
        }
      });
    },
    set(path, data) {
      return new Promise((resolve, reject) => {
        bushido.access().then(() => {
          bushido.realtime.setup().then(() => {
            const sdk = bushido.realtime.api;
            const db = bushido.realtime.db;

            var ref = sdk.ref(db, path);
            sdk
              .set(ref, typeof data == "function" ? data() : data)
              .then(resolve);
          });
        });
      });
    },
    get(path) {
      return new Promise((resolve, reject) => {
        bushido.access().then(() => {
          bushido.realtime.setup().then(() => {
            const sdk = bushido.realtime.api;
            const db = bushido.realtime.db;
            var ref = sdk.ref(db, path);

            sdk.get(ref).then(resolve);
          });
        });
      });
    },
    onSet(path, handler, opt = {}) {
      return new Promise((resolve, reject) => {
        bushido.access().then(() => {
          bushido.realtime.setup().then(() => {
            const sdk = bushido.realtime.api;
            const db = bushido.realtime.db;
            var ref = sdk.ref(db, path);

            sdk.onValue(ref, handler, opt);
          });
        });
      });
    },
    push(path, data) {
      return new Promise((resolve, reject) => {
        bushido.access().then(() => {
          bushido.realtime.setup().then(() => {
            const sdk = bushido.realtime.api;
            const db = bushido.realtime.db;

            var ref = sdk.ref(db, path);
            sdk
              .push(ref, typeof data == "function" ? data() : data)
              .then(resolve);
          });
        });
      });
    },
  },
  convertToArray(obj) {
    if (Array.isArray(obj)) {
      return obj.map(item => bushido.convertToArray(item)); // Handle arrays
    } else if (typeof obj === 'object' && obj !== null) {
      // If the object contains numeric keys, convert it into an array
      if (Object.keys(obj).every(key => !isNaN(key))) {
        return Object.values(obj).map(value => bushido.convertToArray(value));
      } else {
        // If the object is not an array-like object, recurse into its properties
        const result = {};
        for (let key in obj) {
          result[key] = bushido.convertToArray(obj[key]);
        }
        return result;
      }
    }
    return obj; // Return the value if it's neither an array nor an object
  }
};

class PostData {
  constructor(title, des, type, imageType, imgUrl, extras) {
    this.title = title;
    this.des = des;
    this.type = type;
    this.imageType = imageType;
    this.imgUrl = imgUrl;
    this.extras = extras;
    this.id =
      "POST_" +
      type +
      "_" +
      Math.floor(Math.random() * 99999) +
      "__" +
      Math.floor(Math.random() * 99999);
    this.date = new Date();
    this.likes = 0;
    this.shares = 0;
    this.watched = 0;
    this.comments = 0;
  }

  export () {
    var obj = {};

    var self = this;
    Object.keys(this).forEach(function(key) {
      obj[key] = self[key];
    });

    return obj;
  }
}

PostData.getColl = function(type) {
  let postCollection = 'posts'
  switch (type) {
    case 'postThumb':
      postCollection = 'posts'
      break;
    case 'story':
      postCollection = 'stories'
      break;
    case 'video':
      postCollection = 'videos'
      break;
    case 'photo':
      postCollection = 'photos'
      break;
    case 'notice':
      postCollection = 'notices'
      break;
  }

  return postCollection
}

PostData.extractParams = function extractParams(str) {
  const regex = /^POST_(.*?)_(\d+)__(\d+)$/;
  const match = str.match(regex);
  return match.slice(1);
}
