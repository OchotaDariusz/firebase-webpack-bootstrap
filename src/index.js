import "./styles.scss";

import { initializeApp } from 'firebase/app';
import {
    getFirestore, collection, onSnapshot, getDocs,
    addDoc, deleteDoc, doc, query, updateDoc,
    orderBy, serverTimestamp
} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCdF2AFt85UhbrFciNRF7JEVObQ2K3Jf40",
    authDomain: "udemy-modern-javascript-15386.firebaseapp.com",
    projectId: "udemy-modern-javascript-15386",
    storageBucket: "udemy-modern-javascript-15386.appspot.com",
    messagingSenderId: "298692664551",
    appId: "1:298692664551:web:191d70734a11380cf3d642",
    measurementId: "G-40ZQXDL1FZ"
};

initializeApp(firebaseConfig);

const db = getFirestore();

const colRef = collection(db, 'books');

const resultsOrderBy = document.querySelector('#orderBy');
const orderDirection = document.querySelector('#orderDirection');
let order;
let direction;
let q;

const queryResults = (order='title', direction='desc') => {
    q = query(colRef, orderBy(order, direction));

};

resultsOrderBy.addEventListener('change', () => {
    order = resultsOrderBy.value;
    direction = orderDirection.value;
    queryResults(order, direction);
    getDocs(q)
        .then(snapshot => {
            updateDOM(snapshot);
        })
        .catch(err => console.log(err));
});

orderDirection.addEventListener('change', () => {
    order = resultsOrderBy.value;
    direction = orderDirection.value;
    queryResults(order, direction);
    getDocs(q)
        .then(snapshot => {
            updateDOM(snapshot);
        })
        .catch(err => console.log(err));
});

const tableBody = document.querySelector('#tableBody');

const updateDOM = snapshot => {
    let books = [];
    snapshot.docs.forEach(doc => {
        books.push({ ...doc.data(), id: doc.id });
    });
    console.log(books);

    tableBody.innerHTML = '';
    books.forEach(book => {
        tableBody.innerHTML += `<tr>
                                <td>${book.id}</td>
                                <td>${book.title}</td>
                                <td>${book.author}</td>
                            </tr>`;
    });
};

queryResults();
onSnapshot(q, snapshot => {
    updateDOM(snapshot);
});

const addBookForm = document.querySelector('.form-add');
addBookForm.addEventListener('submit', event => {
    event.preventDefault();

    addDoc(colRef, {
        title: addBookForm.title.value,
        author: addBookForm.author.value,
        createdAt: serverTimestamp()
    })
        .then(() => {
            addBookForm.reset();
        })
        .catch(err => console.log(err));

});

const deleteBookForm = document.querySelector('.form-delete');
deleteBookForm.addEventListener('submit', event => {
    event.preventDefault();

    const docRef = doc(db, 'books', deleteBookForm.docid.value);

    deleteDoc(docRef)
        .then(() => {
            deleteBookForm.reset();
        })
        .catch(err => console.log(err));

});

const updateBookForm = document.querySelector('.form-update');
updateBookForm.addEventListener('submit', event => {
    event.preventDefault();

    const docRef = doc(db, 'books', updateBookForm.docid.value);
    const title = updateBookForm.title.value;
    const author = updateBookForm.author.value;

    updateDoc(docRef, { title, author })
        .then(() =>{
            updateBookForm.reset();
        })
        .catch(err => console.log(err));

});
