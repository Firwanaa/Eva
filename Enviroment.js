/**
 * Enviroment: names storage.
 */
class Enviroment {
    /**
     * Creates an environment with given record.
     */
    constructor(record = {}) {
        this.record = record;
    }
    /**
     * Creates a variable with the given name and value.
     */
    define(name, value){
        this.record[name] = value;
        return value;
    }
    /**
     * Ensuring all variables are save to the env record.
     */
    printEnvRecord(){
        console.log(this.record);
    }
    /**
     * Returns the value of a defined variable or throws
     * if the value is not defined.
     */
    lookup(name){
        if(!this.record.hasOwnProperty(name)){
            throw new ReferenceError(`Variable "${name}" is not defined`);
        }
        return this.record[name];
    }
}

module.exports = Enviroment;
