import registerHandlers from './handler/_handler';
import registerServices from './service/_service';

export default function (di) {

  registerHandlers(di);
  registerServices(di);
}