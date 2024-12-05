import { helper } from '@ember/component/helper';

export default helper(function add(params) {
  const [a, b] = params;
  return a + b;
});
