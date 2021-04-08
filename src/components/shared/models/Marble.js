/**
 * User model
 */
class Marble {
  constructor(data = {}) {
    this.id = null;
    this.fieldId = null;
    this.color = null;
    Object.assign(this, data);
  }
}
export default Marble;
