export default function(di) {

  di.register(
    'handler.multi-choice.new',
    [ 'service.mongodb' ],
    (db) => (req, res) => {
      db.getNewMulti().then(newQuestion => {
        res.send(newQuestion);
      });
    }
  );
  
}