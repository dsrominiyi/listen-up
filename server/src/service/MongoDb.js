import { MongoClient } from 'mongodb';
import shuffleArray from '../util/shuffleArray';

export default class MongoDb {

  constructor(config = {}) {
    this.config = config;
    this.dbs = [];
  }

  async getConnection(dbName) {
    const { baseUrl } = this.config;
    const url = baseUrl
      ? `${baseUrl}/${dbName}`
      : `mongodb://localhost:27017/${dbName}`;

    if (this.dbs[dbName]) {
      await this.dbs[dbName].open();
    } else {
      this.dbs[dbName] = await MongoClient.connect(url);
    }

    return this.dbs[dbName];
  }

  async getNewMulti(req) {
    const db = await this.getConnection('multi_choice');

    // Get random question
    const question = await db.collection('questions')
      .aggregate({ $sample: { size: 1 } }, { cursor: { batchSize: 1 } }).next();
    let choices = await db.collection('choices')
      .find({ _id: { $in: question.choiceIds } }).toArray();
    const sound = await db.collection('sounds')
      .findOne({ _id: question.soundId });
    
    db.close();

    choices = shuffleArray(choices);

    choices.forEach(choice => {
      choice.id = choice._id;
      delete choice._id;
    });

    sound.id = sound._id;
    delete sound._id;

    const { description } = question;

    return { description, choices, sound };
  }

  async createMulti(newQuestion) {
    const db = await this.getConnection('multi_choice');

    const { description, choices, soundSrc, answerIndex } =  newQuestion;

    let result = await db.collection('choices').insertMany(choices);
    const choiceIds = result.insertedIds;

    const answerId = choiceIds[answerIndex];
    const sound = { src: soundSrc, answerId };

    result = await db.collection('sounds').insertOne(sound);
    const soundId = result.insertedId;
    const question = { description, choiceIds, soundId };

    result = await db.collection('questions').insertOne(question);

    db.close();

    return {
      success: true,
      questionId: result.insertedId
    };
  }
}