import MongoDb from './MongoDb';

export default function (di) {

  const mongoDb = new MongoDb();

  di.register(
    'service.mongodb',
    [],
    () => mongoDb
  );

}