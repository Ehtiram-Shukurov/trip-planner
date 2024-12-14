import { helper } from '@ember/component/helper';

export default helper(function multiply(params) {
  const [a, b] = params;
  return a * b;
});
