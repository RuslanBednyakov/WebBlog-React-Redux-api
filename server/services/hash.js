import crypto from 'crypto';

import config from '../config/config';

export function createPass(pass){
  // const hmac = crypto.createHmac('sha256', config.secret).update(pass).diggest('hex');
  // return hmac;
  const secret = config.secret;
  const hash = crypto.createHmac('sha256', secret)
                   .update(pass)
                   .digest('hex');
  return hash;
}

export function comparePass(user, pass){
  const checkPass = createPass(pass);
  console.log(checkPass)
  console.log(user.password)
  return (checkPass === user.password);
}