const eventBus = {
    events: {},
    on(event,funcName,listener) {//监听
      if (!this.events[event]) {
        this.events[event] = new Map();
      }
      this.events[event].set(funcName,listener);
    },
    off(event,funcName) {
        if (!this.events[event]) return;
        this.events[event].delete(funcName)
    },
    emit(event, data) {
        if (!this.events[event]) return;
        this.events[event].forEach(( value,key) =>{
            value(data)
        });
    }
};
  
module.exports = eventBus;