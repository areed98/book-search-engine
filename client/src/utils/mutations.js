//import
import { gql } from '@apollo/client';

//exports
export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                _id
                username
            }
        }
    }
`;

export const ADD_USER = gql`
    mutation addUser($username: String!, $email: String!, $password: String!) {
        addUser(username: $username, email: $email, password: $password) {
            token
            user {
                _id
                username
            }
        }
    }
`;

export const SAVE_BOOK = gql`
    mutation saveBook($description: String!, $bookId: String!, $title: String!, $authors: [String], $image: String, $link: String) {
        saveBook(description: $description, bookId: $bookId, title: $title, authors: $authors, image: $image, link: $link) {
            _id
            username
            savedBooks {
                authors
                title
                description
                image
                bookId
                link
            }
        }
    }
`;

export const DELETE_BOOK = gql`
    mutation deleteBook($bookId: String!) {
        deleteBook(bookId: $bookId) {
            username
            savedBooks {
                authors
                title
                description
                image
                bookId
                link
            }
        }
    }
`;