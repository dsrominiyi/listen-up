import registerHandlers from './handler/index';
import registerServices from './service/index';

export default function (di) {

  registerHandlers(di);
  registerServices(di);
}