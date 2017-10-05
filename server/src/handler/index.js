export default function(di) {

  di.register(
    'handler.multi-choice.get-new',
    [ 'service.mongodb' ],
    (db) => (req, res) => {
      db.getNewMulti().then(newQuestion => {
        res.send(newQuestion);
      });
    }
  );

  di.register(
    'handler.multi-choice.create',
    [ 'service.mongodb' ],
    (db) => (req, res) => {
      const newQuestion = req.body;

      db.createMulti(newQuestion).then(rsp => {
        res.send(rsp);
      });
    }
  );
  
}