#!/usr/bin/env ts-node
import { resolve } from 'path';

import moduleAlias from 'module-alias';
import { getAliases } from './moduleAliases';
moduleAlias.addAliases(getAliases());

import dotenv from 'dotenv';
dotenv.config({
  path: resolve(__dirname, '../../.env'),
});

import mentors from '@data/mentors.json';
import reviews from '@data/reviews.json';
import users from '@data/users.json';
import Mentor from '@models/Mentor';
import Order from '@models/Order';
import Review from '@models/Review';
import User from '@models/User';
import bcrypt from 'bcryptjs';
import debug from 'debug';
import mongoose from 'mongoose';

const log = debug('backend:seed');

async function main() {
  try {
    log('Seeding started');
    log('Dropping existing collections');
    await Promise.all([
      User.collection.drop(),
      Mentor.collection.drop(),
      Review.collection.drop(),
      Order.collection.drop(),
    ]);
    log('Collections dropped');
    log('Seeding new documents');
    log('Seeding users');
    const newUsers = await User.insertMany(
      users.map((user) => {
        const password = bcrypt.hashSync(user.email, 10);
        return {
          ...user,
          password,
        };
      }),
      {
        rawResult: true,
      },
    );

    log('Seeding mentors');
    const newMentors = await Mentor.insertMany(
      mentors.map((mentor) => {
        const password = bcrypt.hashSync(mentor.email, 10);
        return {
          ...mentor,
          password,
          isFeatured: Math.random() > 0.5,
        };
      }),
      {
        rawResult: true,
      },
    );

    log('Seeding reviews');
    const newReviews = reviews.map((review) => {
      const user =
        newUsers.insertedIds[
          Math.floor(Math.random() * Object.keys(newUsers.insertedIds).length)
        ];
      const mentor =
        newMentors.insertedIds[
          Math.floor(Math.random() * Object.keys(newMentors.insertedIds).length)
        ];

      return {
        ...review,
        by: user,
        forWhom: mentor,
      };
    });
    await Review.insertMany(newReviews);
  } catch (error) {
    console.log(error);
    console.log('Document already exists, skipping...');
  }
  log('Seeding completed');
}

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  log('Connected to MongoDB');
  try {
    await main();
  } catch (err) {
    console.log(err);
  } finally {
    mongoose.disconnect();
    process.exit();
  }
});
