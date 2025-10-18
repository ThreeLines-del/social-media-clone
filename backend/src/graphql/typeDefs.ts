const typeDefs = `#graphql
    # =========================
    #  Shared Pagination Types
    # =========================
    type PageInfo {
        endCursor: ID
        hasNextPage: Boolean!
    }

    # =========================
    #  User Type
    # =========================
    type User {
        id: ID!
        username: String!
        name: String
        email: String!
        bio: String
        avatar: String
        createdAt: String!
        followersCount: Int!
        followingCount: Int!
        postsCount: Int!

        # Relations
        posts(first: Int, after: ID): PostConnection!
        followers(first: Int, after: ID): UserConnection!
        following(first: Int, after: ID): UserConnection!
    }

    # =========================
    #  Post Type
    # =========================
    type Post {
        id: ID!
        author: User!
        content: String!
        image: String
        likesCount: Int!
        commentsCount: Int!
        createdAt: String!

        # Relations
        comments(first: Int, after: ID): CommentConnection!
        likes(first: Int, after: ID): LikeConnection!
    }

    # =========================
    #  Comment Type
    # =========================
    type Comment {
        id: ID!
        post: Post!
        author: User!
        content: String!
        createdAt: String!
    }

    # =========================
    #  Like Type
    # =========================
    type Like {
        id: ID!
        post: Post!
        user: User!
        createdAt: String!
    }

    # =========================
    #  Connection Types
    # =========================
    type UserEdge {
        cursor: ID!
        node: User!
    }
    type UserConnection {
        edges: [UserEdge!]!
        pageInfo: PageInfo!
        totalCount: Int!
    }

    type PostEdge {
        cursor: ID!
        node: Post!
    }
    type PostConnection {
        edges: [PostEdge!]!
        pageInfo: PageInfo!
        totalCount: Int!
    }

    type CommentEdge {
        cursor: ID!
        node: Comment!
    }
    type CommentConnection {
        edges: [CommentEdge!]!
        pageInfo: PageInfo!
        totalCount: Int!
    }

    type LikeEdge {
        cursor: ID!
        node: Like!
    }
    type LikeConnection {
        edges: [LikeEdge!]!
        pageInfo: PageInfo!
        totalCount: Int!
    }

    # =========================
    #  Auth Payloads
    # =========================
    type AuthPayload {
        token: String!
        user: User!
    }

    # =========================
    #  Activity Payloads
    # =========================
    type ActivityPayload {
        success: Boolean!
        message: String
    }
    
    type LikePostPayload {
        liked: Boolean!
    }

    type FollowUserResponse {
        success: Boolean!
        following: Boolean!
        message: String!
    }

    type UpdateProfileResponse {
        success: Boolean!
        message: String
        user: User
    }

    # =========================
    #  Queries
    # =========================
    type Query {
        # Users
        me: User
        user(username: String!): User
        users(first: Int!, after: ID): UserConnection!

        # Posts
        post(id: ID!): Post
        posts(first: Int!, after: ID): PostConnection!
        feed(first: Int!, after: ID): PostConnection! # Posts from followed users

        # Comments
        comments(postId: ID!, first: Int!, after: ID): CommentConnection!
    }

    # =========================
    #  Mutations
    # =========================
    type Mutation {
        # Auth
        register(username: String!, email: String!, password: String!): AuthPayload!
        login(email: String!, password: String!): AuthPayload!

        # Posts
        createPost(content: String!, image: String): Post!
        deletePost(id: ID!): ActivityPayload!

        # Comments
        addComment(postId: ID!, content: String!): Comment!
        deleteComment(id: ID!): ActivityPayload!

        # Likes
        likePost(postId: ID!): LikePostPayload!

        # Follow system
        followUser(userId: ID!): FollowUserResponse!

        # Profile
        updateProfile(name: String, bio: String, avatar: String): UpdateProfileResponse!
    }

    # =========================
    #  Subscriptions
    # =========================
    type Subscription {
        newPost: Post!
        newComment(postId: ID!): Comment!
    }

`;

export default typeDefs;
