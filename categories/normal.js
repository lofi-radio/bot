const { Category } = require('kawaii/src/Structures/Base');

class NormalCategory extends Category {
  constructor(...args) {
    super(...args);

    this.name = 'normal';
  }
}

module.exports = NormalCategory;
