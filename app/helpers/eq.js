import { helper } from '@ember/component/helper';

export default helper(function eq(params) {
  const [a, b] = params;
  return a === b;
});
