export default function(di) {

  const success = res => result => {
    console.log('response:');
    console.log(result);
    res.send(result);
  };

  const error = next => err => {
    next(err);
  };

  di.register(
    'handler.multi-choice.get-new',
    [ 'service.mongodb' ],
    (db) => (req, res, next) => {
      db.getNewMulti().then(success(res), error(next));
    }
  );

  di.register(
    'handler.multi-choice.create',
    [ 'service.mongodb' ],
    (db) => (req, res, next) => {
      db.createMulti(req.body).then(success(res), error(next));
    }
  );
  
}