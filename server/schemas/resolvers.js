//Imports
const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

//Resolvers
const resolvers = {
    //Query the resolvers
    Query: {
        me: async (parent, args, context) => {
        if (context.user) {
            const userData = await User.findOne({ _id: context.user._id })
            .select('-__v -password')
            .populate('savedBooks')
            return userData;
            }
            //Auth error
            throw new AuthenticationError('You are not logged in');
        }
    },
    //Mutations
    Mutation: {
        login: async (parent, { email, password }) => {
            //Login w/ arguments
            const user = await User.findOne({ email });
            //If no user, auth error
            if (!user) {
                throw new AuthenticationError('Wrong username!');
            }
            //Password auth
            const correctPw = await user.isCorrectPassword(password);
            //If incorrect, auth error
            if (!correctPw) {
                throw new AuthenticationError('Wrong password!');
            }
            //Token
            const token = signToken(user);
            return { token, user };
        },
        addUser: async (partent, args) => {
            //user creation
            const user = await User.create(args);
            //user token
            const token = signToken(user);
            //return
            return { token, user };
        },
        saveBook: async (parent, args, context) => {
            //save book if user is logged in
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate (
                    { _id: context.user._id },
                    { $addToSet: {savedBooks: args} },
                    { new: true, runValidators: true }
                );
                return updatedUser;
            }
            //login error
            throw new AuthenticationError('You must be logged in!');
        },
        deleteBook: async (parent, { bookId }, context) => {
            //delete book if user is logged in
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate (
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true }
                );
                return updatedUser;
            }
            //login error
            throw new AuthenticationError('You must be logged in!');
        }
    }
};

//export resolver
module.exports = resolvers;