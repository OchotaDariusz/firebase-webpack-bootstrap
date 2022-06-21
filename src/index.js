import "./styles.scss";

import { initializeApp } from 'firebase/app';
import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc
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

const tableBody = document.querySelector('#tableBody');

onSnapshot(colRef, snapshot => {
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
})

const addBookForm = document.querySelector('.form-add');
addBookForm.addEventListener('submit', event => {
    event.preventDefault();

    addDoc(colRef, {
        title: addBookForm.title.value,
        author: addBookForm.author.value
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
