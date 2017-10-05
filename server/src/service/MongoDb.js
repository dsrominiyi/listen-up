import { MongoClient  } from 'mongodb';

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

  async getNewMulti() {
    try {
      const db = await this.getConnection('multi_choice');

      // Get random question
      const question = await db.collection('questions')
        .aggregate({ $sample: { size: 1 } }).next();
      const choices = await db.collection('choices')
        .find({ _id: { $in : question.choiceIds} }).toArray();
      const sound = await db.collection('sounds')
        .findOne({ _id: question.soundId });

      choices.forEach(choice => {
        choice.id = choice._id;
        delete choice._id;
      });

      sound.id = sound._id;
      delete sound._id;

      db.close();
      
      return { choices, sound };

    } catch (err) {
      console.error('Error!');
      throw err;
    }
  }

  async createMulti(newQuestion) {
    try {
      // const db = await this.getConnection('multi_choice');
      

    } catch (error) {
      console.error('Error!');
      return { error };
    }
  }
}