export default function(app, di) {
  app.get('/multi', di.fetch('handler.multi-choice.get-new'));
  app.post('/multi', di.fetch('handler.multi-choice.create'));
}