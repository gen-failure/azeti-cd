export default function(target, name, descriptor) {
  return {
    ...descriptor,
    value: function() {
      try {
        if (!this.stores.auth.authenticated) throw new Error("not authorized");
        return descriptor.value.apply(this,arguments)
      } catch(e) {
        this.changePath(`/signin?redirectTo=${this.stores.nav.path}${this.stores.nav.query}`);
      }
    }
  }
}
