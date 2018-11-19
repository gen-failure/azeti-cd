export default function formElement(obj) {

    obj.prototype.setField = function (name,value) {
    let fieldObject = {};
    fieldObject[name]=value;
    this.setState((state) => {
      return Object.assign({},state,fieldObject);
    });
  }
}
