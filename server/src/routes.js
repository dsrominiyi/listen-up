export default function(app, di) {

  app.get('/multi/new', di.fetch('handler.multi-choice.new'));
  
  
}