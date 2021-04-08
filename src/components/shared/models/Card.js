/**
 * User model
 */
class Card {
  constructor(data = {}) {
    this.code = null;
    this.imgUrl = null;
    Object.assign(this, data);
  }
}
export default Card;