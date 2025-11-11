import { gql } from "@apollo/client";

export const CURRENT_USER = gql`
  query Me {
    me {
      id
      email
      avatar
    }
  }
`;

export const ALL_POSTS = gql`
  query Posts($first: Int!) {
    posts(first: $first) {
      edges {
        cursor
        node {
          author {
            avatar
            id
            name
            username
          }
          id
          content
          likesCount
          commentsCount
          image
          createdAt
        }
      }
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

export const POST = gql`
  query Post($postId: ID!) {
    post(id: $postId) {
      content
      likesCount
      commentsCount
      author {
        avatar
        id
        name
        username
      }
      id
      image
      createdAt
    }
  }
`;

export const COMMENTS = gql`
  query Comments($postId: ID!, $first: Int!) {
    comments(postId: $postId, first: $first) {
      edges {
        node {
          content
          id
          createdAt
          author {
            avatar
            id
            username
            name
          }
        }
        cursor
      }
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
